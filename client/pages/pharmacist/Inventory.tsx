import PharmacistHeader from "@/components/PharmacistHeader";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";

const sampleInventory = [
    { id: 'it-1', name: 'Dewormer', category: 'Antiparasitic', stock: 12, price: 15 },
    { id: 'it-2', name: 'Antibiotic X', category: 'Antibiotic', stock: 3, price: 40 },
    { id: 'it-3', name: 'Vaccine Y', category: 'Vaccine', stock: 25, price: 25 },
];

export default function Inventory() {
    const { user } = useAuth();
    if (!user || user.role !== 'pharmacist') return <Navigate to="/login" />;

    const [items, setItems] = useState(sampleInventory);

    const updateStock = (id: string, value: number) => {
        setItems(items.map(it => it.id === id ? { ...it, stock: value } : it));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <PharmacistHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-3">Medication Inventory</h1>
                <p className="text-muted-foreground mb-6">Manage medication stock and prices</p>

                <Card className="p-6 border border-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Item ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Stock</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map(it => (
                                <TableRow key={it.id}>
                                    <TableCell>{it.id}</TableCell>
                                    <TableCell>{it.name}</TableCell>
                                    <TableCell>{it.category}</TableCell>
                                    <TableCell>
                                        <input type="number" value={it.stock} min={0} onChange={(e) => updateStock(it.id, parseInt(e.target.value || '0'))} className="w-20 px-2 py-1 border rounded" />
                                    </TableCell>
                                    <TableCell>${it.price}</TableCell>
                                    <TableCell>
                                        {it.stock < 5 ? <span className="text-red-600 font-semibold">Low</span> : <span className="text-muted-foreground">OK</span>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}
