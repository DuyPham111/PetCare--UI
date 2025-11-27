import PharmacistHeader from "@/components/PharmacistHeader";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const sampleLow = [
    { id: 'it-2', name: 'Antibiotic X', stock: 3 },
    { id: 'it-5', name: 'Sedative Z', stock: 2 },
];

export default function LowStock() {
    const { user } = useAuth();
    if (!user || user.role !== 'pharmacist') return <Navigate to="/login" />;

    return (
        <div className="min-h-screen bg-gray-50">
            <PharmacistHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-3">Low Stock Alerts</h1>
                <p className="text-muted-foreground mb-6">Items with stock below threshold</p>

                <Card className="p-6 border border-border">
                    <ul className="space-y-3">
                        {sampleLow.map(i => (
                            <li key={i.id} className="flex items-center justify-between border rounded p-3">
                                <div>
                                    <div className="font-medium">{i.name}</div>
                                    <div className="text-sm text-muted-foreground">ID: {i.id}</div>
                                </div>
                                <div className="text-sm text-red-600 font-semibold">{i.stock} left</div>
                            </li>
                        ))}
                    </ul>
                </Card>
            </div>
        </div>
    );
}
