import VetHeader from "@/components/VetHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import VetProfileEditForm from "@/components/vet/VetProfileEditForm";
import { sampleVetProfile } from "@/data/sampleVetData";

export default function VetEditProfile() {
    const { user } = useAuth();
    if (!user || user.role !== 'veterinarian') return <Navigate to="/login" />;

    const initial = {
        staffId: (user as any).staffId || 'EMP-1001',
        fullName: user.fullName || 'Dr. Anna Smith',
        dob: (user as any).dob || '1985-06-12',
        gender: (user as any).gender || 'Female',
        startDate: (user as any).startDate || '2020-04-01',
        specialization: (user as any).specialization || 'Small Animal Surgery',
        branchId: user.branchId || 'Downtown Branch',
        baseSalary: (user as any).baseSalary || '60000',
        transferHistory: (user as any).transferHistory || [],
    };

    const [form, setForm] = useState(initial);

    // Save from edit form
    const navigate = useNavigate();
    const { toast } = useToast();

    const save = (updated: any) => {
        const allUsers = JSON.parse(localStorage.getItem('petcare_users') || '[]');
        const idx = allUsers.findIndex((u: any) => u.id === user.id);
        if (idx >= 0) {
            allUsers[idx] = { ...allUsers[idx], ...updated };
            localStorage.setItem('petcare_users', JSON.stringify(allUsers));
            localStorage.setItem('petcare_user', JSON.stringify(allUsers[idx]));
            toast({ title: 'Profile saved', description: 'Saved your changes. Showing updated profile.' });
            navigate('/vet/profile');
        } else {
            // fallback for demo
            toast({ title: 'Profile saved', description: 'Saved your changes (demo)' });
            navigate('/vet/profile');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <VetHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-3">Edit Profile</h1>
                <div className="max-w-3xl">
                    <VetProfileEditForm profile={form} onSave={save} />
                </div>
            </div>
        </div>
    );
}
