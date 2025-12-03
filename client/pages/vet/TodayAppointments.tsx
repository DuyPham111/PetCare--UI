import VetHeader from "@/components/VetHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
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

const initialAppointments: Appointment[] = [
    { id: 'apt-1', time: '09:00', petId: 'pet-1', petName: 'Bella', owner: 'John Doe', reason: 'Routine checkup', status: 'Scheduled' },
    { id: 'apt-2', time: '10:30', petId: 'pet-2', petName: 'Max', owner: 'Mary Smith', reason: 'Tiêm mũi lẻ', status: 'Scheduled' },
    { id: 'apt-3', time: '14:00', petId: 'pet-3', petName: 'Charlie', owner: 'Bob Johnson', reason: 'Tiêm theo gói', status: 'Scheduled' },
    { id: 'apt-4', time: '15:30', petId: 'pet-4', petName: 'Luna', owner: 'Alice Brown', reason: 'Emergency check', status: 'In Progress' },
];

export default function TodayAppointments() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);

    if (!user || user.role !== 'veterinarian') return <Navigate to="/login" />;

    const handleComplete = (id: string) => {
        // Update appointment status to Completed
        setAppointments(prevAppointments =>
            prevAppointments.map(apt =>
                apt.id === id ? { ...apt, status: 'Completed' } : apt
            )
        );

        // Show success toast
        toast({
            title: 'Appointment Completed',
            description: 'The appointment has been marked as completed.',
        });
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
                                                    >
                                                        Mark as Complete
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
