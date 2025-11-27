import VetHeader from "@/components/VetHeader";
import { Card } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import MedicalRecordsTable, { MedicalRecordItem } from "@/components/vet/MedicalRecordsTable";
import { useToast } from "@/hooks/use-toast";
import MedicalRecordCard from "@/components/vet/MedicalRecordCard";
import { sampleRecords } from "@/data/sampleVetData";


export default function MedicalRecords() {
    const { user } = useAuth();
    if (!user || user.role !== 'veterinarian') return <Navigate to="/login" />;

    const [records, setRecords] = useState<MedicalRecordItem[]>(sampleRecords);
    const [editingId, setEditingId] = useState<string | null>(null);
    const { toast } = useToast();

    const startEdit = (id: string) => setEditingId(id);
    const stopEdit = () => setEditingId(null);

    const handleDelete = (id: string) => {
        // remove the record in-memory (demo only)
        setRecords((prev) => prev.filter((r) => r.id !== id));
        if (editingId === id) stopEdit();
        toast({ title: 'Record deleted', description: `Record ${id} removed (demo)` });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <VetHeader />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Medical Records Manager</h1>
                    <p className="text-muted-foreground">View and update medical records, diagnoses and prescriptions</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="p-6 border border-border lg:col-span-2">
                        <MedicalRecordsTable records={records} onEdit={(id) => startEdit(id)} onDelete={(id) => handleDelete(id)} />
                    </Card>

                    <Card className="p-6 border border-border">
                        <h3 className="text-lg font-semibold mb-3">Record Editor</h3>
                        <MedicalRecordCard record={records.find((r) => r.id === editingId) || null} onSave={(updated) => {
                            setRecords((prev) => prev.map((p) => p.id === updated.id ? updated : p));
                            // close editor after save
                            stopEdit();
                            toast({ title: 'Record saved', description: `Record ${updated.id} updated (demo)` });
                        }} />
                    </Card>
                </div>
            </div>
        </div>
    );
}
