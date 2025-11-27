import VetHeader from "@/components/VetHeader";
import { Card } from "@/components/ui/card";
import VetNotificationsList from "@/components/vet/VetNotificationsList";
// sampleNotifications imported above previously caused conflict with local variable, use alias
import { sampleNotifications as _sampleNotifications } from "@/data/sampleVetData";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const sampleNotifications = [
    { id: 'n-1', type: 'Appointment', text: 'New appointment booked for Bella at 09:00' },
    { id: 'n-2', type: 'Feedback', text: 'Customer Mary left feedback for Max' },
    { id: 'n-3', type: 'Alert', text: 'System maintenance scheduled tonight' },
];

export default function Notifications() {
    const { user } = useAuth();
    if (!user || user.role !== 'veterinarian') return <Navigate to="/login" />;

    return (
        <div className="min-h-screen bg-gray-50">
            <VetHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-3">Notifications</h1>
                <p className="text-muted-foreground mb-6">Recent appointments, feedback and system alerts</p>

                <VetNotificationsList notifications={_sampleNotifications} />
            </div>
        </div>
    );
}
