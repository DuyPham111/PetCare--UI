import VetHeader from "@/components/VetHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import VetProfileView from "@/components/vet/VetProfileView";
import { sampleVetProfile } from "@/data/sampleVetData";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function VetProfile() {
    const { user, logout } = useAuth();
    const [editing, setEditing] = useState(false);

    if (!user || user.role !== "veterinarian") return <Navigate to="/login" />;

    // View-only profile values with English labels and sample placeholder fallbacks
    const [form, setForm] = useState({
        staffId: (user as any).staffId || 'EMP-1001',
        fullName: user.fullName || 'Dr. Anna Smith',
        dob: (user as any).dob || '1985-06-12',
        gender: (user as any).gender || 'Female',
        startDate: (user as any).startDate || '2020-04-01',
        specialization: (user as any).specialization || 'Small Animal Surgery',
        branchId: user.branchId || 'Downtown Branch',
        baseSalary: (user as any).baseSalary || '60000',
        transferHistory: (user as any).transferHistory || [{ from: 'Branch A', to: 'Hanoi Central Clinic', date: '2019-01-12', reason: 'Promotion' }],
    });

    const { toast } = useToast();

    const save = () => {
        // Persist to localStorage users collection if exists
        const allUsers = JSON.parse(localStorage.getItem("petcare_users") || "[]");
        const idx = allUsers.findIndex((u: any) => u.id === user.id);
        if (idx >= 0) {
            allUsers[idx] = { ...allUsers[idx], ...form };
            localStorage.setItem("petcare_users", JSON.stringify(allUsers));
            localStorage.setItem("petcare_user", JSON.stringify(allUsers[idx]));
            toast({ title: 'Profile saved', description: 'Your profile has been updated.' });
        }
        setEditing(false);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <VetHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">My Profile</h1>
                <VetProfileView profile={form || sampleVetProfile} />
            </div>
        </div>
    );
}
