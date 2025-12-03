import VetHeader from "@/components/VetHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicalRecords } from "@/contexts/MedicalRecordsContext";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { MedicalRecord, PrescriptionItem } from "@shared/types";
import { Plus, Trash2 } from "lucide-react";

export default function MedicalRecords() {
    const { user } = useAuth();
    const { records, updateRecord, deleteRecord, getRecordsByVeterinarianId } = useMedicalRecords();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<Partial<MedicalRecord>>({});
    const [prescriptionItems, setPrescriptionItems] = useState<PrescriptionItem[]>([]);
    const { toast } = useToast();

    if (!user || user.role !== 'veterinarian') return <Navigate to="/login" />;

    // Filter records for current veterinarian
    const vetRecords = user.id ? getRecordsByVeterinarianId(user.id) : records;

    const handleEdit = (record: MedicalRecord) => {
        setEditingId(record.id);
        setFormData({ ...record });
        setPrescriptionItems(record.prescription || []);
    };

    const handleSave = () => {
        if (!formData || !editingId) return;

        updateRecord(editingId, {
            ...formData,
            prescription: prescriptionItems,
        });

        setEditingId(null);
        setFormData({});
        setPrescriptionItems([]);
        toast({ title: 'Record Updated', description: 'Medical record has been updated successfully.' });
    };

    const handleCancel = () => {
        setEditingId(null);
        setFormData({});
        setPrescriptionItems([]);
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this medical record?")) {
            deleteRecord(id);
            if (editingId === id) {
                setEditingId(null);
                setFormData({});
                setPrescriptionItems([]);
            }
            toast({ title: 'Record Deleted', description: 'Medical record has been deleted.' });
        }
    };

    const handleAddPrescription = () => {
        setPrescriptionItems([
            ...prescriptionItems,
            { drugName: "", quantity: 1, dosage: "", frequency: "", duration: "", instructions: "" },
        ]);
    };

    const handleRemovePrescription = (index: number) => {
        setPrescriptionItems(prescriptionItems.filter((_, i) => i !== index));
    };

    const handlePrescriptionChange = (index: number, field: keyof PrescriptionItem, value: any) => {
        const updated = [...prescriptionItems];
        updated[index] = { ...updated[index], [field]: value };
        setPrescriptionItems(updated);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <VetHeader />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Medical Records</h1>
                    <p className="text-muted-foreground">View and manage pet medical records</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Records Table */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>All Records ({vetRecords.length})</CardTitle>
                            <CardDescription>Complete list of medical records</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Pet Name</TableHead>
                                            <TableHead>Customer</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Diagnosis</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {vetRecords.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                                                    No medical records found
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            vetRecords.map((record) => (
                                                <TableRow key={record.id}>
                                                    <TableCell className="font-medium">{record.petName}</TableCell>
                                                    <TableCell>{record.customerName}</TableCell>
                                                    <TableCell>{formatDate(record.createdAt)}</TableCell>
                                                    <TableCell className="max-w-xs truncate">{record.diagnosis}</TableCell>
                                                    <TableCell className="text-right">
                                                        <div className="flex justify-end gap-2">
                                                            <Button size="sm" variant="outline" onClick={() => handleEdit(record)}>
                                                                Edit
                                                            </Button>
                                                            <Button size="sm" variant="destructive" onClick={() => handleDelete(record.id)}>
                                                                Delete
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Edit Panel */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Record Editor</CardTitle>
                            <CardDescription>{editingId ? 'Edit selected record' : 'Select a record to edit'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {editingId && formData ? (
                                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                                    <div>
                                        <Label htmlFor="petName">Pet Name</Label>
                                        <Input
                                            id="petName"
                                            value={formData.petName || ""}
                                            onChange={(e) => setFormData({ ...formData, petName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="customerName">Customer Name</Label>
                                        <Input
                                            id="customerName"
                                            value={formData.customerName || ""}
                                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="symptoms">Symptoms</Label>
                                        <Textarea
                                            id="symptoms"
                                            value={formData.symptoms || ""}
                                            onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="diagnosis">Diagnosis</Label>
                                        <Textarea
                                            id="diagnosis"
                                            value={formData.diagnosis || ""}
                                            onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
                                            rows={2}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="conclusion">Conclusion</Label>
                                        <Textarea
                                            id="conclusion"
                                            value={formData.conclusion || ""}
                                            onChange={(e) => setFormData({ ...formData, conclusion: e.target.value })}
                                            rows={3}
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="followUpDate">Follow-up Date</Label>
                                        <Input
                                            id="followUpDate"
                                            type="date"
                                            value={formData.followUpDate || ""}
                                            onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
                                        />
                                    </div>

                                    {/* Prescription Items */}
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <Label>Prescription</Label>
                                            <Button size="sm" variant="outline" onClick={handleAddPrescription}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                        <div className="space-y-2">
                                            {prescriptionItems.map((item, index) => (
                                                <div key={index} className="p-2 border rounded-lg space-y-2">
                                                    <Input
                                                        placeholder="Drug name"
                                                        value={item.drugName}
                                                        onChange={(e) =>
                                                            handlePrescriptionChange(index, "drugName", e.target.value)
                                                        }
                                                    />
                                                    <Input
                                                        type="number"
                                                        placeholder="Quantity"
                                                        value={item.quantity}
                                                        onChange={(e) =>
                                                            handlePrescriptionChange(
                                                                index,
                                                                "quantity",
                                                                parseInt(e.target.value)
                                                            )
                                                        }
                                                    />
                                                    <Input
                                                        placeholder="Dosage (e.g., 250mg)"
                                                        value={item.dosage || ""}
                                                        onChange={(e) =>
                                                            handlePrescriptionChange(index, "dosage", e.target.value)
                                                        }
                                                    />
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        onClick={() => handleRemovePrescription(index)}
                                                        className="w-full"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-2 pt-4">
                                        <Button onClick={handleSave}>Save Changes</Button>
                                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-muted-foreground text-sm">Click Edit on a record to modify its details</p>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
