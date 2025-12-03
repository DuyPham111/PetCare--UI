import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Appointment, Pet, User as UserType, Vaccine, VaccinePackage } from "@shared/types";
import { Eye, Calendar, Clock, Edit, X, AlertCircle, CheckCircle2, Ban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CustomerAppointments() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>([]);
    const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
    const [pets, setPets] = useState<Pet[]>([]);
    const [vets, setVets] = useState<UserType[]>([]);
    const [loading, setLoading] = useState(true);

    // Reschedule modal state
    const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [rescheduleForm, setRescheduleForm] = useState({
        date: "",
        time: "",
        veterinarianId: "",
        notes: "",
    });

    // Cancel modal state
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);

    if (!user || user.role !== "customer") {
        return <Navigate to="/login" />;
    }

    useEffect(() => {
        loadData();
    }, [user]);

    const loadData = () => {
        try {
            const allAppointments = JSON.parse(localStorage.getItem("petcare_appointments") || "[]");
            const customerAppointments = allAppointments.filter(
                (a: Appointment) => a.customerId === user.id
            );

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const upcoming: Appointment[] = [];
            const past: Appointment[] = [];

            customerAppointments.forEach((apt: Appointment) => {
                const aptDate = new Date(apt.appointmentDate);
                aptDate.setHours(0, 0, 0, 0);

                if (apt.status === "completed" || apt.status === "cancelled") {
                    past.push(apt);
                } else if (aptDate >= today) {
                    upcoming.push(apt);
                } else {
                    past.push(apt);
                }
            });

            // Sort by date
            upcoming.sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
            past.sort((a, b) => new Date(b.appointmentDate).getTime() - new Date(a.appointmentDate).getTime());

            setUpcomingAppointments(upcoming);
            setPastAppointments(past);

            // Load pets
            const allPets = JSON.parse(localStorage.getItem("petcare_pets") || "[]");
            const customerPets = allPets.filter((p: Pet) => p.customerId === user.id);
            setPets(customerPets);

            // Load veterinarians
            const allUsers = JSON.parse(localStorage.getItem("petcare_users") || "[]");
            let branchVets = allUsers.filter(
                (u: UserType) => u.role === "veterinarian" && u.branchId === user.branchId
            );

            if (branchVets.length === 0 || !user.branchId) {
                branchVets = allUsers.filter((u: UserType) => u.role === "veterinarian");
            }

            branchVets.sort((a: UserType, b: UserType) => {
                const aSpec = a.specialization || "General";
                const bSpec = b.specialization || "General";
                if (aSpec === "General" && bSpec !== "General") return 1;
                if (aSpec !== "General" && bSpec === "General") return -1;
                return aSpec.localeCompare(bSpec);
            });

            setVets(branchVets);
        } catch (error) {
            console.error("Error loading appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const getPetName = (petId: string) => {
        const pet = pets.find((p) => p.id === petId);
        return pet ? `${pet.name} (${pet.type})` : "Unknown Pet";
    };

    const getVetName = (vetId: string) => {
        const vet = vets.find((v) => v.id === vetId);
        return vet ? vet.fullName : "Not assigned";
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const formatTime = (timeString: string) => {
        return timeString;
    };

    const getServiceTypeName = (type: string) => {
        switch (type) {
            case "medical-exam":
                return "Medical Exam";
            case "single-vaccine":
                return "Single-Dose Injection";
            case "vaccine-package":
                return "Package Injection";
            default:
                return type;
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = {
            confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-800" },
            pending: { label: "Pending", color: "bg-yellow-100 text-yellow-800" },
            completed: { label: "Completed", color: "bg-green-100 text-green-800" },
            cancelled: { label: "Cancelled", color: "bg-red-100 text-red-800" },
        };

        const config = statusConfig[status as keyof typeof statusConfig] || {
            label: status,
            color: "bg-gray-100 text-gray-800",
        };

        return <Badge className={config.color}>{config.label}</Badge>;
    };

    const canReschedule = (appointment: Appointment) => {
        return appointment.status === "checked-in" || appointment.status === "pending";
    };

    const canCancel = (appointment: Appointment) => {
        return appointment.status === "checked-in" || appointment.status === "pending";
    };

    const openRescheduleModal = (appointment: Appointment) => {
        setSelectedAppointment(appointment);
        setRescheduleForm({
            date: appointment.appointmentDate,
            time: appointment.appointmentTime,
            veterinarianId: appointment.veterinarianId || "",
            notes: appointment.notes || "",
        });
        setRescheduleModalOpen(true);
    };

    const handleRescheduleSubmit = () => {
        if (!selectedAppointment) return;

        if (!rescheduleForm.date || !rescheduleForm.time) {
            toast({
                title: "Missing Information",
                description: "Please select date and time.",
                variant: "destructive",
            });
            return;
        }

        const newDate = new Date(rescheduleForm.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (newDate < today) {
            toast({
                title: "Invalid Date",
                description: "Appointment date must be in the future.",
                variant: "destructive",
            });
            return;
        }

        try {
            const allAppointments = JSON.parse(localStorage.getItem("petcare_appointments") || "[]");
            const updatedAppointments = allAppointments.map((a: Appointment) => {
                if (a.id === selectedAppointment.id) {
                    return {
                        ...a,
                        appointmentDate: rescheduleForm.date,
                        appointmentTime: rescheduleForm.time,
                        veterinarianId: rescheduleForm.veterinarianId || a.veterinarianId,
                        notes: rescheduleForm.notes,
                    };
                }
                return a;
            });

            localStorage.setItem("petcare_appointments", JSON.stringify(updatedAppointments));

            toast({
                title: "Appointment rescheduled",
                description: "Your appointment has been rescheduled successfully.",
            });

            setRescheduleModalOpen(false);
            setSelectedAppointment(null);
            loadData();
        } catch (error) {
            console.error("Error rescheduling appointment:", error);
            toast({
                title: "Error",
                description: "Failed to reschedule appointment.",
                variant: "destructive",
            });
        }
    };

    const openCancelModal = (appointment: Appointment) => {
        setAppointmentToCancel(appointment);
        setCancelModalOpen(true);
    };

    const handleCancelConfirm = () => {
        if (!appointmentToCancel) return;

        try {
            const allAppointments = JSON.parse(localStorage.getItem("petcare_appointments") || "[]");
            const updatedAppointments = allAppointments.map((a: Appointment) => {
                if (a.id === appointmentToCancel.id) {
                    return { ...a, status: "cancelled" as const };
                }
                return a;
            });

            localStorage.setItem("petcare_appointments", JSON.stringify(updatedAppointments));

            toast({
                title: "Appointment cancelled",
                description: "Your appointment has been cancelled successfully.",
            });

            setCancelModalOpen(false);
            setAppointmentToCancel(null);
            loadData();
        } catch (error) {
            console.error("Error cancelling appointment:", error);
            toast({
                title: "Error",
                description: "Failed to cancel appointment.",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-foreground mb-2">My Appointments</h1>
                    <p className="text-muted-foreground">
                        View and manage your upcoming and past appointments
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                            <Calendar className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{upcomingAppointments.length}</div>
                            <p className="text-xs text-muted-foreground">Scheduled appointments</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Completed</CardTitle>
                            <CheckCircle2 className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {pastAppointments.filter((a) => a.status === "completed").length}
                            </div>
                            <p className="text-xs text-muted-foreground">Total completed</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Cancelled</CardTitle>
                            <Ban className="h-4 w-4 text-red-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {pastAppointments.filter((a) => a.status === "cancelled").length}
                            </div>
                            <p className="text-xs text-muted-foreground">Total cancelled</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="upcoming" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="upcoming">Upcoming Appointments</TabsTrigger>
                        <TabsTrigger value="past">Past Appointments</TabsTrigger>
                    </TabsList>

                    {/* Upcoming Appointments Tab */}
                    <TabsContent value="upcoming">
                        <Card>
                            <CardHeader>
                                <CardTitle>Upcoming Appointments</CardTitle>
                                <CardDescription>
                                    Manage your scheduled and pending appointments
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="text-center py-8">Loading appointments...</div>
                                ) : upcomingAppointments.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground mb-4">
                                            No upcoming appointments
                                        </p>
                                        <Link to="/customer/booking">
                                            <Button>Book an Appointment</Button>
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Appointment ID</TableHead>
                                                    <TableHead>Date & Time</TableHead>
                                                    <TableHead>Service Type</TableHead>
                                                    <TableHead>Pet</TableHead>
                                                    <TableHead>Veterinarian</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {upcomingAppointments.map((appointment) => (
                                                    <TableRow key={appointment.id}>
                                                        <TableCell className="font-medium">
                                                            {appointment.id}
                                                        </TableCell>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                <span>{formatDate(appointment.appointmentDate)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Clock className="h-3 w-3" />
                                                                <span>{formatTime(appointment.appointmentTime)}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {getServiceTypeName(appointment.serviceType)}
                                                        </TableCell>
                                                        <TableCell>{getPetName(appointment.petId)}</TableCell>
                                                        <TableCell>{getVetName(appointment.veterinarianId || "")}</TableCell>
                                                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Link to={`/customer/appointments/${appointment.id}`}>
                                                                    <Button variant="ghost" size="sm">
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                </Link>
                                                                {canReschedule(appointment) && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openRescheduleModal(appointment)}
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                                {canCancel(appointment) && (
                                                                    <Button
                                                                        variant="ghost"
                                                                        size="sm"
                                                                        onClick={() => openCancelModal(appointment)}
                                                                    >
                                                                        <X className="h-4 w-4 text-red-600" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Past Appointments Tab */}
                    <TabsContent value="past">
                        <Card>
                            <CardHeader>
                                <CardTitle>Past Appointments</CardTitle>
                                <CardDescription>
                                    View your completed and cancelled appointments
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                {loading ? (
                                    <div className="text-center py-8">Loading appointments...</div>
                                ) : pastAppointments.length === 0 ? (
                                    <div className="text-center py-8">
                                        <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                                        <p className="text-muted-foreground">No past appointments</p>
                                    </div>
                                ) : (
                                    <div className="rounded-md border">
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead>Date & Time</TableHead>
                                                    <TableHead>Service Type</TableHead>
                                                    <TableHead>Pet</TableHead>
                                                    <TableHead>Veterinarian</TableHead>
                                                    <TableHead>Status</TableHead>
                                                    <TableHead className="text-right">Actions</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {pastAppointments.map((appointment) => (
                                                    <TableRow key={appointment.id}>
                                                        <TableCell>
                                                            <div className="flex items-center gap-2">
                                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                                <span>{formatDate(appointment.appointmentDate)}</span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                                <Clock className="h-3 w-3" />
                                                                <span>{formatTime(appointment.appointmentTime)}</span>
                                                            </div>
                                                        </TableCell>
                                                        <TableCell>
                                                            {getServiceTypeName(appointment.serviceType)}
                                                        </TableCell>
                                                        <TableCell>{getPetName(appointment.petId)}</TableCell>
                                                        <TableCell>{getVetName(appointment.veterinarianId || "")}</TableCell>
                                                        <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                                                        <TableCell className="text-right">
                                                            <Link to={`/customer/appointments/${appointment.id}`}>
                                                                <Button variant="ghost" size="sm">
                                                                    <Eye className="h-4 w-4" />
                                                                </Button>
                                                            </Link>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Reschedule Modal */}
                <Dialog open={rescheduleModalOpen} onOpenChange={setRescheduleModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle>Reschedule Appointment</DialogTitle>
                            <DialogDescription>
                                Choose a new date and time for your appointment
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div>
                                <Label htmlFor="reschedule-date">
                                    New Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="reschedule-date"
                                    type="date"
                                    value={rescheduleForm.date}
                                    onChange={(e) =>
                                        setRescheduleForm({ ...rescheduleForm, date: e.target.value })
                                    }
                                    min={new Date().toISOString().split("T")[0]}
                                />
                            </div>
                            <div>
                                <Label htmlFor="reschedule-time">
                                    New Time <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    id="reschedule-time"
                                    type="time"
                                    value={rescheduleForm.time}
                                    onChange={(e) =>
                                        setRescheduleForm({ ...rescheduleForm, time: e.target.value })
                                    }
                                />
                            </div>
                            <div>
                                <Label htmlFor="reschedule-vet">Veterinarian (Optional)</Label>
                                <Select
                                    value={rescheduleForm.veterinarianId}
                                    onValueChange={(value) =>
                                        setRescheduleForm({ ...rescheduleForm, veterinarianId: value })
                                    }
                                >
                                    <SelectTrigger id="reschedule-vet">
                                        <SelectValue placeholder="Keep current veterinarian" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {vets.map((vet) => (
                                            <SelectItem key={vet.id} value={vet.id}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">
                                                        {vet.fullName} - {vet.specialization || "General Veterinarian"}
                                                    </span>
                                                    <span className="text-xs text-muted-foreground">
                                                        {vet.phone && `Tel: ${vet.phone}`}
                                                        {vet.licenseNumber && ` | License: ${vet.licenseNumber}`}
                                                    </span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="reschedule-notes">Notes (Optional)</Label>
                                <Textarea
                                    id="reschedule-notes"
                                    value={rescheduleForm.notes}
                                    onChange={(e) =>
                                        setRescheduleForm({ ...rescheduleForm, notes: e.target.value })
                                    }
                                    placeholder="Any special requests or notes..."
                                    rows={3}
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setRescheduleModalOpen(false)}
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleRescheduleSubmit}>
                                Reschedule Appointment
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                {/* Cancel Confirmation Modal */}
                <Dialog open={cancelModalOpen} onOpenChange={setCancelModalOpen}>
                    <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                                <AlertCircle className="h-5 w-5 text-red-600" />
                                Cancel Appointment
                            </DialogTitle>
                            <DialogDescription>
                                Are you sure you want to cancel this appointment? This action cannot be undone.
                            </DialogDescription>
                        </DialogHeader>
                        {appointmentToCancel && (
                            <div className="py-4 space-y-2">
                                <p className="text-sm">
                                    <strong>Date:</strong> {formatDate(appointmentToCancel.appointmentDate)}
                                </p>
                                <p className="text-sm">
                                    <strong>Time:</strong> {formatTime(appointmentToCancel.appointmentTime)}
                                </p>
                                <p className="text-sm">
                                    <strong>Service:</strong> {getServiceTypeName(appointmentToCancel.serviceType)}
                                </p>
                            </div>
                        )}
                        <DialogFooter>
                            <Button
                                variant="outline"
                                onClick={() => setCancelModalOpen(false)}
                            >
                                Keep Appointment
                            </Button>
                            <Button
                                variant="destructive"
                                onClick={handleCancelConfirm}
                            >
                                Yes, Cancel Appointment
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </main>
        </div>
    );
}
