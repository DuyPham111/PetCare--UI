import VetHeader from "@/components/VetHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiGet, apiPut } from "@/api/api";
import { Syringe, Package } from "lucide-react";

interface Appointment {
    id: string;
    time: string;
    petId?: string;
    petName: string;
    owner: string;
    reason: string;
    status: string;
}

export default function TodayAppointments() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [appointments, setAppointments] = useState<Appointment[]>([]);

    // Fetch appointments from backend, filter for today and by doctor if available
    useEffect(() => {
        let mounted = true;
        const fetchToday = async () => {
            try {
                const body = await apiGet('/appointments');
                const rows = body?.data ?? [];

                const today = new Date();
                const tzOffset = today.getTimezoneOffset() * 60000;
                const todayISO = new Date(today.getTime() - tzOffset).toISOString().split('T')[0];

                // possible doctor id sources on the user object (use safe nullish coalescing)
                const u: any = user;
                const doctorId = u ? String(u.employee_id ?? u.employeeId ?? u.doctorId ?? u.id) : null;

                const mapped = (rows as any[])
                    .filter(r => {
                        // determine appointment date
                        const aptDate = r.appointment_time ? new Date(r.appointment_time).toISOString().split('T')[0] : (r.date ? new Date(r.date).toISOString().split('T')[0] : null);
                        if (!aptDate) return false;
                        if (aptDate !== todayISO) return false;
                        if (doctorId) {
                            const docId = r.doctor_id ? String(r.doctor_id) : (r.doctor ? String(r.doctor.id || r.doctor_id) : null);
                            if (!docId) return false;
                            return docId === doctorId;
                        }
                        return true;
                    })
                    .map(r => ({
                        id: String(r.id),
                        time: r.appointment_time ? new Date(r.appointment_time).toTimeString().slice(0, 5) : (r.time || ''),
                        petId: r.pet_id ? String(r.pet_id) : (r.pet ? String(r.pet.id) : undefined),
                        petName: r.pet_name || (r.pet && (r.pet.name || r.pet.pet_name)) || 'Unknown',
                        owner: r.owner_name || (r.owner && (r.owner.full_name || r.owner.name)) || 'Unknown',
                        reason: r.reason || r.notes || '',
                        status: r.status || (r.state || 'Scheduled'),
                    })) as Appointment[];

                if (mounted) setAppointments(mapped);
            } catch (err) {
                setAppointments([]);
            }
        };
        fetchToday();
        return () => { mounted = false; };
    }, [user]);

    if (!user || user.role !== 'veterinarian') return <Navigate to="/login" />;

    const [updatingId, setUpdatingId] = useState<string | null>(null);

    const handleComplete = async (id: string) => {
        // Call backend to update appointment status
        setUpdatingId(id);
        try {
            // Use PUT as update; if backend requires PATCH change to api.request('PATCH', ...)
            await apiPut(`/appointments/${id}`, { status: 'Completed' });
            setAppointments(prevAppointments =>
                prevAppointments.map(apt =>
                    apt.id === id ? { ...apt, status: 'Completed' } : apt
                )
            );
            toast({ title: 'Appointment Completed', description: 'The appointment has been marked as completed.' });
        } catch (err: any) {
            console.error('Failed to update appointment status', err);
            toast({ title: 'Error', description: err?.message || 'Failed to update appointment', variant: 'destructive' });
        } finally {
            setUpdatingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <VetHeader />
            <main className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Today's Appointments</h1>
                    <p className="text-muted-foreground">View and manage today's scheduled appointments</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Appointment Schedule</CardTitle>
                        <CardDescription>All appointments scheduled for today</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Pet Name</TableHead>
                                    <TableHead>Owner</TableHead>
                                    <TableHead>Reason</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {appointments.map((appointment) => (
                                    <TableRow key={appointment.id}>
                                        <TableCell className="font-medium">{appointment.time}</TableCell>
                                        <TableCell>{appointment.petName}</TableCell>
                                        <TableCell>{appointment.owner}</TableCell>
                                        <TableCell>{appointment.reason}</TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                appointment.status === 'Completed' ? 'secondary' :
                                                    appointment.status === 'In Progress' ? 'default' :
                                                        'outline'
                                            }>
                                                {appointment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex gap-2 justify-end">
                                                {/* Show injection buttons based on reason */}
                                                {appointment.reason.toLowerCase().includes('tiêm mũi lẻ') && appointment.petId && (
                                                    <Link to={`/vet/injections/single?petId=${appointment.petId}`}>
                                                        <Button size="sm" variant="outline">
                                                            <Syringe className="w-3 h-3 mr-1" />
                                                            Perform Injection
                                                        </Button>
                                                    </Link>
                                                )}
                                                {appointment.reason.toLowerCase().includes('tiêm theo gói') && appointment.petId && (
                                                    <Link to={`/vet/injections/package?petId=${appointment.petId}`}>
                                                        <Button size="sm" variant="outline">
                                                            <Package className="w-3 h-3 mr-1" />
                                                            Perform Package Injection
                                                        </Button>
                                                    </Link>
                                                )}
                                                {appointment.status !== 'Completed' && (
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleComplete(appointment.id)}
                                                        disabled={updatingId === appointment.id}
                                                    >
                                                        {updatingId === appointment.id ? 'Updating...' : 'Mark as Complete'}
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
