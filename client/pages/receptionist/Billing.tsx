import ReceptionHeader from "@/components/ReceptionHeader";
import { Card } from "@/components/ui/card";
import BillingForm from "@/components/receptionist/BillingForm";
import InvoiceList from "@/components/receptionist/InvoiceList";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";

const sampleServices = [{ id: 's1', name: 'Checkup', price: 30 }, { id: 's2', name: 'Vaccine', price: 20 }];
const sampleProducts = [{ id: 'p1', name: 'Dewormer', price: 15 }, { id: 'p2', name: 'Ticks Spray', price: 10 }];

export default function Billing() {
    const { user } = useAuth();
    if (!user || user.role !== 'receptionist') return <Navigate to="/login" />;

    const [items, setItems] = useState<{ id: string; name: string; price: number; qty: number }[]>([]);

    const addItem = (it: any) => setItems([...items, { id: it.id, name: it.name, price: it.price, qty: 1 }]);
    const updateQty = (idx: number, qty: number) => { const next = [...items]; next[idx].qty = qty; setItems(next); };

    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const tax = Math.round(subtotal * 0.1 * 100) / 100;
    const total = subtotal + tax;

    return (
        <div className="min-h-screen bg-gray-50">
            <ReceptionHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-3">Billing Support</h1>
                <p className="text-muted-foreground mb-6">Quick invoice creator for services and products</p>

                <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="p-6 border border-border lg:col-span-2">
                        <BillingForm />
                    </Card>

                    <Card className="p-6 border border-border">
                        <h4 className="font-semibold mb-3">Invoice</h4>
                        <InvoiceList />
                    </Card>
                </div>
            </div>
        </div>
    );
}
