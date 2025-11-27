import ReceptionHeader from "@/components/ReceptionHeader";
import { Card } from "@/components/ui/card";
import ReceptionProfileView from "@/components/receptionist/ReceptionProfileView";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";

export default function ReceptionProfile() {
    const { user, logout } = useAuth();
    const [editing, setEditing] = useState(false);

    if (!user || user.role !== "receptionist") return <Navigate to="/login" />;

    const persisted = (() => {
        try {
            const raw = localStorage.getItem('petcare_reception_profile');
            if (raw) return JSON.parse(raw);
        } catch (e) { }
        return null;
    })();

    const profile = persisted || null;

    const save = () => {
        const allUsers = JSON.parse(localStorage.getItem("petcare_users") || "[]");
        const idx = allUsers.findIndex((u: any) => u.id === user.id);
        if (idx >= 0) {
            allUsers[idx] = { ...allUsers[idx], ...form };
            localStorage.setItem("petcare_users", JSON.stringify(allUsers));
            localStorage.setItem("petcare_user", JSON.stringify(allUsers[idx]));
            alert("Profile saved.");
        }
        setEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <ReceptionHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">My Profile</h1>
                <Card className="p-6 border border-border max-w-3xl">
                    <div className="space-y-3">
                        <ReceptionProfileView profile={profile || { ...user }} />
                    </div>
                </Card>
            </div>
        </div>
    );
}
