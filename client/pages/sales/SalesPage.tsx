import SalesHeader from "@/components/SalesHeader";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { mockPetItems } from "@/lib/mockData";
import { Trash2, Search, ShoppingCart, AlertTriangle, PackageX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
    getProductStock,
    validateProductStock,
    deductProductStock,
    getStockStatus,
    getStockBadgeClass
} from "@/lib/inventoryUtils";
import { updateCustomerMembership } from "@/lib/membershipUtils";
import { User } from "@shared/types";

interface CartItem {
    id: string;
    productCode: string;
    name: string;
    price: number;
    quantity: number;
    subtotal: number;
}

export default function SalesPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [customerName, setCustomerName] = useState("");
    const [customerPhone, setCustomerPhone] = useState("");
    const [membershipTier, setMembershipTier] = useState<"none" | "familiar" | "vip">("none");
    const [searchTerm, setSearchTerm] = useState("");
    const [cart, setCart] = useState<CartItem[]>([]);
    const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "transfer">("cash");
    const [stockLevels, setStockLevels] = useState<Record<string, number>>({});

    if (!user || user.role !== "sales") return <Navigate to="/login" />;

    // Load real-time stock levels
    useEffect(() => {
        const loadStockLevels = () => {
            const levels: Record<string, number> = {};
            mockPetItems.forEach(product => {
                levels[product.id] = getProductStock(user.branchId || "branch-1", product.id);
            });
            setStockLevels(levels);
        };
        loadStockLevels();
    }, [user.branchId]);
    const filteredProducts = mockPetItems.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productCode.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product: any) => {
        const branchId = user.branchId || "branch-1";
        const currentStock = stockLevels[product.id] || 0;
        const existingItem = cart.find(item => item.id === product.id);
        const currentCartQuantity = existingItem ? existingItem.quantity : 0;
        const requestedQuantity = currentCartQuantity + 1;

        // Validate stock availability
        const validation = validateProductStock(branchId, product.id, requestedQuantity);

        if (!validation.valid) {
            toast({
                title: "Insufficient Stock",
                description: validation.message,
                variant: "destructive",
            });
            return;
        }

        if (existingItem) {
            setCart(cart.map(item =>
                item.id === product.id
                    ? { ...item, quantity: item.quantity + 1, subtotal: (item.quantity + 1) * item.price }
                    : item
            ));
        } else {
            setCart([...cart, {
                id: product.id,
                productCode: product.productCode,
                name: product.name,
                price: product.price,
                quantity: 1,
                subtotal: product.price,
            }]);
        }
        toast({
            title: "Added to Cart",
            description: `${product.name} has been added to cart.`,
        });
    };

    const removeFromCart = (productId: string) => {
        setCart(cart.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: string, newQuantity: number) => {
        if (newQuantity <= 0) {
            removeFromCart(productId);
            return;
        }

        // Validate stock for new quantity
        const branchId = user.branchId || "branch-1";
        const validation = validateProductStock(branchId, productId, newQuantity);

        if (!validation.valid) {
            toast({
                title: "Insufficient Stock",
                description: validation.message,
                variant: "destructive",
            });
            return;
        }

        setCart(cart.map(item =>
            item.id === productId
                ? { ...item, quantity: newQuantity, subtotal: newQuantity * item.price }
                : item
        ));
    };

    const calculateSubtotal = () => {
        return cart.reduce((sum, item) => sum + item.subtotal, 0);
    };

    const calculateDiscount = () => {
        const subtotal = calculateSubtotal();
        if (membershipTier === "familiar") return subtotal * 0.05;
        if (membershipTier === "vip") return subtotal * 0.10;
        return 0;
    };

    const calculateVAT = () => {
        return (calculateSubtotal() - calculateDiscount()) * 0.08;
    };

    const calculateTotal = () => {
        return calculateSubtotal() - calculateDiscount() + calculateVAT();
    };

    const calculateLoyaltyPoints = () => {
        return Math.floor(calculateTotal() / 50000);
    };

    const handleConfirmSale = () => {
        if (!customerName || !customerPhone) {
            toast({
                title: "Missing Information",
                description: "Please enter customer name and phone number.",
                variant: "destructive",
            });
            return;
        }

        if (cart.length === 0) {
            toast({
                title: "Empty Cart",
                description: "Please add products to cart before confirming sale.",
                variant: "destructive",
            });
            return;
        }

        const branchId = user.branchId || "branch-1";

        // Validate all items in cart have sufficient stock
        for (const item of cart) {
            const validation = validateProductStock(branchId, item.id, item.quantity);
            if (!validation.valid) {
                toast({
                    title: "Insufficient Stock",
                    description: `Not enough stock for ${item.name}. ${validation.message}`,
                    variant: "destructive",
                });
                return;
            }
        }

        // Deduct stock for all items (transactional safety)
        const deductedItems: Array<{ productId: string; quantity: number }> = [];
        try {
            for (const item of cart) {
                const success = deductProductStock(branchId, item.id, item.quantity);
                if (!success) {
                    // Rollback previous deductions
                    for (const deducted of deductedItems) {
                        // Restore stock by adding back the quantity
                        const inventory = JSON.parse(localStorage.getItem("petcare_product_inventory") || "[]");
                        const index = inventory.findIndex(
                            (inv: any) => inv.branchId === branchId && inv.productId === deducted.productId
                        );
                        if (index !== -1) {
                            inventory[index].quantity += deducted.quantity;
                            localStorage.setItem("petcare_product_inventory", JSON.stringify(inventory));
                        }
                    }
                    toast({
                        title: "Sale Failed",
                        description: `Failed to deduct stock for ${item.name}. Transaction rolled back.`,
                        variant: "destructive",
                    });
                    return;
                }
                deductedItems.push({ productId: item.id, quantity: item.quantity });
            }

            // Save invoice to localStorage
            const invoices = JSON.parse(localStorage.getItem("petcare_product_invoices") || "[]");
            const newInvoice = {
                id: `invoice-${Date.now()}`,
                branchId,
                customerId: null,
                customerName,
                customerPhone,
                items: cart,
                subtotal: calculateSubtotal(),
                discount: calculateDiscount(),
                vat: calculateVAT(),
                total: calculateTotal(),
                paymentMethod,
                membershipTier,
                loyaltyPoints: calculateLoyaltyPoints(),
                createdBy: user.id,
                createdAt: new Date().toISOString(),
            };
            invoices.push(newInvoice);
            localStorage.setItem("petcare_product_invoices", JSON.stringify(invoices));

            // Find customer by phone and update membership
            const users: User[] = JSON.parse(localStorage.getItem("petcare_users") || "[]");
            const customer = users.find(
                (u) => u.role === "customer" && u.phone === customerPhone
            );

            if (customer) {
                // Update customer ID in invoice
                newInvoice.customerId = customer.id;
                localStorage.setItem("petcare_product_invoices", JSON.stringify(invoices));

                // Auto-update membership level
                const membershipResult = updateCustomerMembership(customer.id);

                if (membershipResult.success) {
                    if (membershipResult.upgraded) {
                        toast({
                            title: "🎉 Membership Upgraded!",
                            description: `Customer upgraded from ${membershipResult.oldLevel} to ${membershipResult.newLevel}!`,
                        });
                    } else if (membershipResult.newLevel !== membershipResult.oldLevel) {
                        toast({
                            title: "Membership Updated",
                            description: `Customer membership: ${membershipResult.newLevel}`,
                        });
                    }
                }
            }

            // Reload stock levels
            const levels: Record<string, number> = {};
            mockPetItems.forEach(product => {
                levels[product.id] = getProductStock(branchId, product.id);
            });
            setStockLevels(levels);

            toast({
                title: "Sale Completed",
                description: `Order processed successfully. Total: ${calculateTotal().toLocaleString()} VND`,
            });

            // Reset form
            setCart([]);
            setCustomerName("");
            setCustomerPhone("");
            setMembershipTier("none");
            setPaymentMethod("cash");
        } catch (error) {
            console.error("Error processing sale:", error);
            toast({
                title: "Error",
                description: "An error occurred while processing the sale.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <SalesHeader />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Point of Sale (POS)</h1>
                    <p className="text-muted-foreground">Process sales and manage customer orders</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Left Column: Customer Info & Product Selection */}
                    <div className="space-y-6">
                        {/* Customer Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Customer Information</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <Label htmlFor="customerName">Customer Name</Label>
                                    <Input
                                        id="customerName"
                                        value={customerName}
                                        onChange={(e) => setCustomerName(e.target.value)}
                                        placeholder="Enter customer name"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="customerPhone">Phone Number</Label>
                                    <Input
                                        id="customerPhone"
                                        value={customerPhone}
                                        onChange={(e) => setCustomerPhone(e.target.value)}
                                        placeholder="Enter phone number"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="membership">Membership Tier</Label>
                                    <Select value={membershipTier} onValueChange={(value: any) => setMembershipTier(value)}>
                                        <SelectTrigger id="membership">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="none">None</SelectItem>
                                            <SelectItem value="familiar">Familiar (-5%)</SelectItem>
                                            <SelectItem value="vip">VIP (-10%)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Product Selection */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Product Selection</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            placeholder="Search products..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="pl-9"
                                        />
                                    </div>
                                </div>
                                <div className="max-h-96 overflow-y-auto space-y-2">
                                    {filteredProducts.map((product) => {
                                        const stock = stockLevels[product.id] || 0;
                                        const stockStatus = getStockStatus(stock);
                                        const isOutOfStock = stock === 0;
                                        const badgeClass = getStockBadgeClass(stockStatus);

                                        return (
                                            <div
                                                key={product.id}
                                                className={`flex items-center justify-between p-3 border rounded-lg ${isOutOfStock
                                                    ? "opacity-50 cursor-not-allowed"
                                                    : "hover:bg-accent cursor-pointer"
                                                    }`}
                                                onClick={() => !isOutOfStock && addToCart(product)}
                                            >
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <p className="font-medium">{product.name}</p>
                                                        {isOutOfStock && (
                                                            <PackageX className="h-4 w-4 text-destructive" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-muted-foreground">{product.productCode}</p>
                                                </div>
                                                <div className="text-right space-y-1">
                                                    <p className="font-semibold">{product.price.toLocaleString()} VND</p>
                                                    <div className="flex items-center gap-2 justify-end">
                                                        <p className="text-sm text-muted-foreground">Stock: {stock}</p>
                                                        <Badge variant="outline" className={`${badgeClass} text-xs`}>
                                                            {stockStatus === "out" && "Out"}
                                                            {stockStatus === "critical" && "Critical"}
                                                            {stockStatus === "low" && "Low"}
                                                            {stockStatus === "normal" && "In Stock"}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Cart & Payment */}
                    <div className="space-y-6">
                        {/* Shopping Cart */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <ShoppingCart className="h-5 w-5" />
                                    Shopping Cart ({cart.length})
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                {cart.length === 0 ? (
                                    <p className="text-center text-muted-foreground py-8">Cart is empty</p>
                                ) : (
                                    <div className="space-y-3">
                                        {cart.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 border-b pb-3">
                                                <div className="flex-1">
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-sm text-muted-foreground">{item.price.toLocaleString()} VND</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                    >
                                                        -
                                                    </Button>
                                                    <span className="w-8 text-center">{item.quantity}</span>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                    >
                                                        +
                                                    </Button>
                                                </div>
                                                <div className="w-24 text-right font-semibold">
                                                    {item.subtotal.toLocaleString()}
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => removeFromCart(item.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 text-destructive" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Payment Summary */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>{calculateSubtotal().toLocaleString()} VND</span>
                                    </div>
                                    {calculateDiscount() > 0 && (
                                        <div className="flex justify-between text-green-600">
                                            <span>Membership Discount:</span>
                                            <span>-{calculateDiscount().toLocaleString()} VND</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between">
                                        <span>VAT (8%):</span>
                                        <span>{calculateVAT().toLocaleString()} VND</span>
                                    </div>
                                    <div className="flex justify-between text-lg font-bold border-t pt-2">
                                        <span>Total:</span>
                                        <span>{calculateTotal().toLocaleString()} VND</span>
                                    </div>
                                    <div className="flex justify-between text-sm text-blue-600">
                                        <span>Loyalty Points:</span>
                                        <span>+{calculateLoyaltyPoints()} points</span>
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="paymentMethod">Payment Method</Label>
                                    <Select value={paymentMethod} onValueChange={(value: any) => setPaymentMethod(value)}>
                                        <SelectTrigger id="paymentMethod">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="cash">Cash</SelectItem>
                                            <SelectItem value="card">Credit/Debit Card</SelectItem>
                                            <SelectItem value="transfer">Bank Transfer</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    onClick={handleConfirmSale}
                                    className="w-full"
                                    size="lg"
                                >
                                    Confirm Sale
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
