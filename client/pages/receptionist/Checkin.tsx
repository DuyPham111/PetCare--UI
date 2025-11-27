import ReceptionHeader from "@/components/ReceptionHeader";
import { Card } from "@/components/ui/card";
import CustomerCheckinTable from "@/components/receptionist/CustomerCheckinTable";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";

const sampleToday = [
    { id: 'apt-1', time: '09:00', pet: 'Bella', owner: 'John Doe', status: 'Scheduled' },
    { id: 'apt-2', time: '10:30', pet: 'Max', owner: 'Mary Smith', status: 'Scheduled' },
];

export default function Checkin() {
    const { user } = useAuth();
    if (!user || user.role !== 'receptionist') return <Navigate to="/login" />;

    const [list, setList] = useState(sampleToday);

    const markChecked = (id: string) => {
        setList(list.map(item => item.id === id ? { ...item, status: 'Checked In' } : item));
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ReceptionHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-3">Customer Check-in</h1>
                <p className="text-muted-foreground mb-6">Mark customer arrivals for today</p>

                <Card className="p-6 border border-border">
                    <CustomerCheckinTable />
                </Card>
            </div>
        </div>
    );
}
