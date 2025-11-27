import VetHeader from "@/components/VetHeader";
import { Card } from "@/components/ui/card";
import VetAppointmentsTable, { VetAppointment } from "@/components/vet/VetAppointmentsTable";
import { sampleAppointments } from "@/data/sampleVetData";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";


export default function TodayAppointments() {
    const { user } = useAuth();
    if (!user || user.role !== 'veterinarian') return <Navigate to="/login" />;

    const [appointments, setAppointments] = useState<VetAppointment[]>(sampleAppointments as VetAppointment[]);
    const { toast } = useToast();

    const markCompleted = (id: string) => {
        setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: 'Completed' } : a));
        toast({ title: 'Appointment marked', description: 'Appointment marked as completed' });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <VetHeader />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Today's Appointments</h1>
                    <p className="text-muted-foreground">Appointments scheduled for today</p>
                </div>

                <Card className="p-6 border border-border">
                    <VetAppointmentsTable
                        appointments={appointments}
                        onComplete={(id) => markCompleted(id)}
                    />
                </Card>
            </div>
        </div>
    );
}
