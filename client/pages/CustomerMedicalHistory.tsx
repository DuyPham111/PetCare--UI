import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { useMedicalRecords } from "@/contexts/MedicalRecordsContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { Eye, Calendar, Stethoscope, FileText } from "lucide-react";
import { MedicalRecord } from "@shared/types";

export default function CustomerMedicalHistory() {
    const { user } = useAuth();
    const { records, getRecordsByCustomerId } = useMedicalRecords();
    const [viewRecordId, setViewRecordId] = useState<string | null>(null);

    if (!user || user.role !== "customer") {
        return <Navigate to="/login" />;
    }

    // Get all medical records for this customer's pets
    const customerRecords = getRecordsByCustomerId(user.id);

    const viewRecord = viewRecordId
        ? records.find((r) => r.id === viewRecordId)
        : null;

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-background">
            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Medical History</h1>
                    <p className="text-muted-foreground">
                        View your pets' medical records and treatment history
                    </p>
                </div>

                {/* Medical Records Table */}
                <Card>
                    <CardHeader>
                        <CardTitle>
                            <FileText className="inline h-5 w-5 mr-2" />
                            All Medical Records ({customerRecords.length})
                        </CardTitle>
                        <CardDescription>
                            Complete medical history for all your pets
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {customerRecords.length === 0 ? (
                            <div className="text-center py-12">
                                <Stethoscope className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground">
                                    No medical records found for your pets
                                </p>
                                <p className="text-sm text-muted-foreground mt-2">
                                    Medical records will appear here after veterinary visits
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Pet Name</TableHead>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Veterinarian</TableHead>
                                            <TableHead>Diagnosis</TableHead>
                                            <TableHead>Follow-up Date</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {customerRecords.map((record) => (
                                            <TableRow key={record.id}>
                                                <TableCell className="font-medium">
                                                    {record.petName}
                                                </TableCell>
                                                <TableCell>{formatDate(record.createdAt)}</TableCell>
                                                <TableCell>{record.veterinarianName}</TableCell>
                                                <TableCell className="max-w-xs truncate">
                                                    {record.diagnosis}
                                                </TableCell>
                                                <TableCell>
                                                    {record.followUpDate ? (
                                                        <Badge variant="outline">
                                                            {formatDate(record.followUpDate)}
                                                        </Badge>
                                                    ) : (
                                                        <span className="text-muted-foreground text-sm">
                                                            N/A
                                                        </span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={() => setViewRecordId(record.id)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* View Record Dialog */}
                <Dialog open={!!viewRecordId} onOpenChange={() => setViewRecordId(null)}>
                    <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Medical Record Details</DialogTitle>
                            <DialogDescription>
                                Complete medical examination record
                            </DialogDescription>
                        </DialogHeader>
                        {viewRecord && (
                            <div className="space-y-6">
                                {/* Patient Information */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label className="text-muted-foreground">Pet Name</Label>
                                        <p className="font-semibold">{viewRecord.petName}</p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Date</Label>
                                        <p className="font-semibold">
                                            {formatDate(viewRecord.createdAt)}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Veterinarian
                                        </Label>
                                        <p className="font-semibold">
                                            {viewRecord.veterinarianName}
                                        </p>
                                    </div>
                                    <div>
                                        <Label className="text-muted-foreground">Branch</Label>
                                        <p className="font-semibold">
                                            {viewRecord.branchId || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                {/* Vital Signs */}
                                {(viewRecord.weight ||
                                    viewRecord.temperature ||
                                    viewRecord.bloodPressure) && (
                                        <div>
                                            <h3 className="font-semibold mb-2">Vital Signs</h3>
                                            <div className="grid grid-cols-3 gap-4 bg-muted/50 p-4 rounded-lg">
                                                {viewRecord.weight && (
                                                    <div>
                                                        <Label className="text-muted-foreground text-xs">
                                                            Weight
                                                        </Label>
                                                        <p className="font-semibold">
                                                            {viewRecord.weight} lbs
                                                        </p>
                                                    </div>
                                                )}
                                                {viewRecord.temperature && (
                                                    <div>
                                                        <Label className="text-muted-foreground text-xs">
                                                            Temperature
                                                        </Label>
                                                        <p className="font-semibold">
                                                            {viewRecord.temperature}°F
                                                        </p>
                                                    </div>
                                                )}
                                                {viewRecord.bloodPressure && (
                                                    <div>
                                                        <Label className="text-muted-foreground text-xs">
                                                            Blood Pressure
                                                        </Label>
                                                        <p className="font-semibold">
                                                            {viewRecord.bloodPressure}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                {/* Symptoms */}
                                <div>
                                    <Label className="text-muted-foreground">Symptoms</Label>
                                    <p className="mt-1 p-3 bg-muted/50 rounded-lg">
                                        {viewRecord.symptoms}
                                    </p>
                                </div>

                                {/* Diagnosis */}
                                <div>
                                    <Label className="text-muted-foreground">Diagnosis</Label>
                                    <p className="mt-1 p-3 bg-muted/50 rounded-lg font-semibold">
                                        {viewRecord.diagnosis}
                                    </p>
                                </div>

                                {/* Conclusion */}
                                <div>
                                    <Label className="text-muted-foreground">
                                        Treatment Plan & Conclusion
                                    </Label>
                                    <p className="mt-1 p-3 bg-muted/50 rounded-lg">
                                        {viewRecord.conclusion}
                                    </p>
                                </div>

                                {/* Prescription */}
                                {viewRecord.prescription &&
                                    viewRecord.prescription.length > 0 && (
                                        <div>
                                            <Label className="text-muted-foreground">
                                                Prescription
                                            </Label>
                                            <div className="mt-2 space-y-2">
                                                {viewRecord.prescription.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="p-3 bg-muted/50 rounded-lg"
                                                    >
                                                        <div className="font-semibold">
                                                            {item.drugName} - Quantity: {item.quantity}
                                                        </div>
                                                        {(item.dosage || item.frequency || item.duration) && (
                                                            <div className="text-sm text-muted-foreground mt-1">
                                                                {item.dosage && <span>Dosage: {item.dosage} | </span>}
                                                                {item.frequency && (
                                                                    <span>Frequency: {item.frequency} | </span>
                                                                )}
                                                                {item.duration && (
                                                                    <span>Duration: {item.duration}</span>
                                                                )}
                                                            </div>
                                                        )}
                                                        {item.instructions && (
                                                            <div className="text-sm mt-1">
                                                                <span className="font-medium">
                                                                    Instructions:
                                                                </span>{" "}
                                                                {item.instructions}
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                {/* Follow-up */}
                                {viewRecord.followUpDate && (
                                    <div>
                                        <Label className="text-muted-foreground">
                                            Follow-up Appointment
                                        </Label>
                                        <p className="mt-1 font-semibold">
                                            <Calendar className="inline h-4 w-4 mr-2" />
                                            {formatDate(viewRecord.followUpDate)}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setViewRecordId(null)}
                            >
                                Close
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
