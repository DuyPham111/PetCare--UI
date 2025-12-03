import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link, Navigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { Order, OrderItem, LoyaltyAccount, LOYALTY_CONFIG } from "@shared/types";

export default function Cart() {
  const { user } = useAuth();
  const { items, removeItem, updateQuantity, clearCart } = useCart();
  const [loyalty, setLoyalty] = useState<LoyaltyAccount | null>(null);

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to={`/login?redirect=/cart`} replace />;
  }

  useEffect(() => {
    if (!user) return;
    const loyaltyAccounts = JSON.parse(localStorage.getItem("petcare_loyalty") || "[]");
    const customerLoyalty = loyaltyAccounts.find(
      (l: LoyaltyAccount) => l.customerId === user.id
    );
    setLoyalty(customerLoyalty);
  }, [user]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax

  // Calculate loyalty discount based on tier
  const discountRate = loyalty
    ? loyalty.tier === "bronze"
      ? 0.05
      : loyalty.tier === "silver"
        ? 0.1
        : 0.15
    : 0;

  const loyaltyDiscount = subtotal * discountRate;
  const total = subtotal + tax - loyaltyDiscount;

  // Calculate points earned
  const pointsEarned = Math.floor(total * LOYALTY_CONFIG.pointsPerVND);

  const handleCheckout = () => {
    if (items.length === 0) {
      alert("Your cart is empty");
      return;
    }

    if (!user) {
      alert("Please login first");
      return;
    }

    // Create new order
    const orderItems: OrderItem[] = items.map((item) => ({
      id: `oi-${Date.now()}-${Math.random()}`,
      itemId: item.id,
      itemName: item.name,
      quantity: item.quantity,
      unitPrice: item.price,
      total: item.price * item.quantity,
    }));

    const newOrder: Order = {
      id: `order-${Date.now()}`,
      customerId: user.id,
      items: orderItems,
      subtotal,
      tax,
      loyaltyPointsApplied: pointsEarned,
      loyaltyDiscount,
      total,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    // Save order
    const allOrders = JSON.parse(localStorage.getItem("petcare_orders") || "[]");
    allOrders.push(newOrder);
    localStorage.setItem("petcare_orders", JSON.stringify(allOrders));

    // Update inventory
    const allProducts = JSON.parse(localStorage.getItem("petcare_pet_items") || "[]");
    items.forEach((cartItem) => {
      const product = allProducts.find((p: any) => p.id === cartItem.id);
      if (product) {
        product.stock -= cartItem.quantity;
      }
    });
    localStorage.setItem("petcare_pet_items", JSON.stringify(allProducts));

    // Update loyalty points
    if (loyalty) {
      const allLoyalty = JSON.parse(localStorage.getItem("petcare_loyalty") || "[]");
      const loyaltyIndex = allLoyalty.findIndex(
        (l: LoyaltyAccount) => l.customerId === user.id
      );
      if (loyaltyIndex >= 0) {
        allLoyalty[loyaltyIndex].points += pointsEarned;
        allLoyalty[loyaltyIndex].totalSpent += total;
        // Update tier
        if (allLoyalty[loyaltyIndex].totalSpent >= 12000000) {
          allLoyalty[loyaltyIndex].tier = "gold";
        } else if (allLoyalty[loyaltyIndex].totalSpent >= 5000000) {
          allLoyalty[loyaltyIndex].tier = "silver";
        }
        allLoyalty[loyaltyIndex].updatedAt = new Date().toISOString();
        localStorage.setItem("petcare_loyalty", JSON.stringify(allLoyalty));
      }
    }

    // Clear cart
    clearCart();

    // Show success message and redirect
    alert("Order placed successfully!");
    window.location.href = "/orders";
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-12">
            <Link to="/shop">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Continue Shopping
              </Button>
            </Link>
            <h1 className="text-4xl font-bold text-foreground">Shopping Cart</h1>
          </div>

          {items.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="p-6 border border-border">
                    <div className="flex items-start gap-4">
                      {/* Product Image Placeholder */}
                      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                        <div className="text-2xl">
                          {item.category === "food"
                            ? "🍖"
                            : item.category === "toy"
                              ? "🎾"
                              : item.category === "medication"
                                ? "💊"
                                : "🛍️"}
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-grow">
                        <h3 className="font-semibold text-foreground">{item.name}</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Code: {item.productCode}
                        </p>
                        <p className="font-bold text-primary mt-2">{formatPrice(item.price)}</p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center border border-input rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity === 1}
                            className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                          >
                            −
                          </button>
                          <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
                          >
                            +
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors text-muted-foreground hover:text-red-600"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Subtotal */}
                      <div className="text-right">
                        <p className="text-lg font-bold text-foreground">
                          {formatPrice(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Order Summary */}
              <div className="space-y-4">
                {/* Loyalty Info */}
                {loyalty && (
                  <Card className="p-6 border border-primary/20 bg-primary/5">
                    <h3 className="font-semibold text-foreground mb-3">Your Loyalty Benefits</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Tier:</span>
                        <span className="font-medium capitalize">{loyalty.tier}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Discount:</span>
                        <span className="font-medium">{discountRate * 100}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Points to earn:</span>
                        <span className="font-medium text-primary">{pointsEarned}</span>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Price Summary */}
                <Card className="p-6 border border-border sticky top-4">
                  <h3 className="font-semibold text-foreground mb-4">Order Summary</h3>

                  <div className="space-y-3 mb-4 border-b border-border pb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal:</span>
                      <span>{formatPrice(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Tax (10%):</span>
                      <span>{formatPrice(tax)}</span>
                    </div>
                    {loyaltyDiscount > 0 && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Loyalty Discount ({discountRate * 100}%):</span>
                        <span>-{formatPrice(loyaltyDiscount)}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between text-lg font-bold text-foreground mb-6">
                    <span>Total:</span>
                    <span className="text-primary">{formatPrice(total)}</span>
                  </div>

                  <Button
                    onClick={handleCheckout}
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    size="lg"
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    onClick={() => clearCart()}
                    variant="outline"
                    className="w-full mt-2"
                  >
                    Clear Cart
                  </Button>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <ShoppingBag className="w-20 h-20 text-muted-foreground mx-auto mb-6 opacity-30" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Your cart is empty</h2>
              <p className="text-muted-foreground mb-8">
                Start shopping to add items to your cart
              </p>
              <Link to="/store">
                <Button className="bg-primary hover:bg-primary/90 text-white">
                  Continue Shopping
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
