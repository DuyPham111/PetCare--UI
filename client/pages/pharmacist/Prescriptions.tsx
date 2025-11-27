import PharmacistHeader from "@/components/PharmacistHeader";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";

const samplePres = [
    { id: 'pr-1', pet: 'Bella', owner: 'John Doe', vet: 'Dr. Anna Smith', status: 'Pending' },
    { id: 'pr-2', pet: 'Max', owner: 'Mary Smith', vet: 'Dr. Lee Johnson', status: 'Completed' },
];

export default function Prescriptions() {
    const { user } = useAuth();
    if (!user || user.role !== 'pharmacist') return <Navigate to="/login" />;

    const [list, setList] = useState(samplePres);

    const confirmDispense = (id: string) => setList(list.map(p => p.id === id ? { ...p, status: 'Completed' } : p));

    return (
        <div className="min-h-screen bg-gray-50">
            <PharmacistHeader />
            <div className="container mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-3">Prescription Processing</h1>
                <p className="text-muted-foreground mb-6">Prescriptions assigned by veterinarians</p>

                <Card className="p-6 border border-border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>ID</TableHead>
                                <TableHead>Pet</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Veterinarian</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {list.map(p => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.id}</TableCell>
                                    <TableCell>{p.pet}</TableCell>
                                    <TableCell>{p.owner}</TableCell>
                                    <TableCell>{p.vet}</TableCell>
                                    <TableCell>{p.status}</TableCell>
                                    <TableCell>
                                        {p.status === 'Pending' ? <button className="bg-primary text-white px-3 py-1 rounded" onClick={() => confirmDispense(p.id)}>Confirm Dispense</button> : <span className="text-muted-foreground">Done</span>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    );
}
