import PharmacistHeader from "@/components/PharmacistHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";

export default function PharmacistEditProfile() {
    const { user } = useAuth();
    if (!user || user.role !== 'pharmacist') return <Navigate to="/login" />;

    const initial = {
        staffId: (user as any).staffId || 'EMP-3001',
        fullName: user.fullName || 'Michael Pharmacy',
        dob: (user as any).dob || '1988-09-02',
        gender: (user as any).gender || 'Male',
        startDate: (user as any).startDate || '2019-08-01',
        position: (user as any).position || 'Pharmacist',
        branchId: user.branchId || 'Central Pharmacy',
        baseSalary: (user as any).baseSalary || '45000',
        history: (user as any).history || ['Joined - 2019'],
    };

    const [form, setForm] = useState(initial);

    const save = () => {
        const allUsers = JSON.parse(localStorage.getItem('petcare_users') || '[]');
        const idx = allUsers.findIndex((u: any) => u.id === user.id);
        if (idx >= 0) {
            allUsers[idx] = { ...allUsers[idx], ...form };
            localStorage.setItem('petcare_users', JSON.stringify(allUsers));
            localStorage.setItem('petcare_user', JSON.stringify(allUsers[idx]));
            alert('Profile saved.');
            window.location.href = '/pharmacist/profile';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <PharmacistHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-3">Edit Profile</h1>
                <Card className="p-6 border border-border max-w-3xl">
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">Employee ID</label>
                                <input value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })} className="w-full px-3 py-2 border border-input rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">Full Name</label>
                                <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className="w-full px-3 py-2 border border-input rounded-md" />
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">Date of Birth</label>
                                <input type="date" value={form.dob} onChange={(e) => setForm({ ...form, dob: e.target.value })} className="w-full px-3 py-2 border border-input rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">Gender</label>
                                <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full px-3 py-2 border border-input rounded-md">
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">Start Date</label>
                                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="w-full px-3 py-2 border border-input rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">Position</label>
                                <input value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} className="w-full px-3 py-2 border border-input rounded-md" />
                            </div>

                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">Branch</label>
                                <input value={form.branchId} onChange={(e) => setForm({ ...form, branchId: e.target.value })} className="w-full px-3 py-2 border border-input rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm text-muted-foreground mb-1">Base Salary</label>
                                <input value={form.baseSalary} onChange={(e) => setForm({ ...form, baseSalary: e.target.value })} className="w-full px-3 py-2 border border-input rounded-md" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-muted-foreground mb-1">Transfer History (one per line)</label>
                            <textarea value={(form.history || []).join('\n')} onChange={(e) => setForm({ ...form, history: e.target.value.split('\n') })} className="w-full px-3 py-2 border border-input rounded-md" rows={4} />
                        </div>

                        <div className="flex gap-2 pt-4">
                            <Button onClick={save} className="bg-primary text-white">Save</Button>
                            <Button variant="outline" onClick={() => window.location.href = '/pharmacist/profile'}>Cancel</Button>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
