import PharmacistHeader from "@/components/PharmacistHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";

export default function PharmacistProfile() {
    const { user, logout } = useAuth();
    const [editing, setEditing] = useState(false);

    if (!user || user.role !== "pharmacist") return <Navigate to="/login" />;

    const [form, setForm] = useState({
        staffId: (user as any).staffId || 'EMP-3001',
        fullName: user.fullName || 'Michael Pharmacy',
        dob: (user as any).dob || '1988-09-02',
        gender: (user as any).gender || 'Male',
        startDate: (user as any).startDate || '2019-08-01',
        position: (user as any).position || 'Pharmacist',
        branchId: user.branchId || 'Central Pharmacy',
        baseSalary: (user as any).baseSalary || '45000',
        history: (user as any).history || ['Joined - 2019'],
    });

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
            <PharmacistHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-4">My Profile</h1>
                <Card className="p-6 border border-border max-w-3xl">
                    <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-muted-foreground">Employee ID</p>
                                <p className="font-medium text-foreground">{form.staffId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Full Name</p>
                                <p className="font-medium text-foreground">{form.fullName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Date of Birth</p>
                                <p className="font-medium text-foreground">{form.dob}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Gender</p>
                                <p className="font-medium text-foreground capitalize">{form.gender}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Start Date</p>
                                <p className="font-medium text-foreground">{form.startDate}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Position</p>
                                <p className="font-medium text-foreground">{form.position}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Branch</p>
                                <p className="font-medium text-foreground">{form.branchId}</p>
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Base Salary</p>
                                <p className="font-medium text-foreground">${form.baseSalary}</p>
                            </div>
                        </div>

                        <div className="pt-4 border-t border-border">
                            <h4 className="text-sm font-semibold mb-2">Transfer History</h4>
                            {form.history && form.history.length > 0 ? (
                                <ul className="list-disc pl-6 text-sm text-muted-foreground">
                                    {form.history.map((h: any, idx: number) => (
                                        <li key={idx}>{h}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-sm text-muted-foreground">No history available</p>
                            )}
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button asChild className="bg-primary text-white"><a href="/pharmacist/profile/edit">Edit Profile</a></Button>
                            <Button variant="outline" onClick={() => { logout(); window.location.href = '/login'; }}>Logout</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
