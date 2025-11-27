import React from "react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import sampleReceptionData from "@/data/sampleReceptionData";
import { useToast } from "@/hooks/use-toast";

export default function CustomerCheckinTable() {
    const { toast } = useToast();

    const [appointments, setAppointments] = React.useState(() => {
        try {
            const saved = localStorage.getItem("petcare_appointments");
            if (saved) return JSON.parse(saved);
        } catch (e) {
            console.error(e);
        }
        return sampleReceptionData.sampleReceptionAppointments || [];
    });

    function updateStatus(id: string, status: string) {
        const next = appointments.map((a: any) => (a.id === id ? { ...a, status } : a));
        setAppointments(next);
        localStorage.setItem("petcare_appointments", JSON.stringify(next));
        toast({ title: `Appointment ${status}`, description: `Appointment ${id} marked ${status}.` });
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Pet</TableHead>
                    <TableHead>Owner</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {appointments.map((a: any) => (
                    <TableRow key={a.id}>
                        <TableCell>{a.time}</TableCell>
                        <TableCell>{a.date}</TableCell>
                        <TableCell>{a.petId ?? a.pet ?? "—"}</TableCell>
                        <TableCell>{a.customerId ?? a.owner ?? "—"}</TableCell>
                        <TableCell className="font-medium">{a.status}</TableCell>
                        <TableCell>
                            <div className="flex gap-2">
                                {a.status !== "Checked-In" && (
                                    <Button size="sm" variant="outline" onClick={() => updateStatus(a.id, "Checked-In")}>
                                        Check in
                                    </Button>
                                )}

                                {a.status !== "Completed" && (
                                    <Button size="sm" onClick={() => updateStatus(a.id, "Completed")}>
                                        Complete
                                    </Button>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
