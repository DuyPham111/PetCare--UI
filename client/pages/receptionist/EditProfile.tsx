import ReceptionHeader from "@/components/ReceptionHeader";
import { Card } from "@/components/ui/card";
import ReceptionProfileEditForm from "@/components/receptionist/ReceptionProfileEditForm";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";

export default function ReceptionEditProfile() {
    const { user } = useAuth();
    if (!user || user.role !== 'receptionist') return <Navigate to="/login" />;

    const initial = {
        staffId: (user as any).staffId || 'EMP-2001',
        fullName: user.fullName || 'Sarah Reception',
        dob: (user as any).dob || '1990-02-18',
        gender: (user as any).gender || 'Female',
        startDate: (user as any).startDate || '2021-03-15',
        position: (user as any).position || 'Receptionist',
        branchId: user.branchId || 'Uptown Branch',
        baseSalary: (user as any).baseSalary || '40000',
        history: (user as any).history || ['Joined - 2021'],
    };


    return (
        <div className="min-h-screen bg-gray-50">
            <ReceptionHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-3">Edit Profile</h1>
                <Card className="p-6 border border-border max-w-3xl">
                    <ReceptionProfileEditForm />
                </Card>
            </div>
        </div>
    );
}
