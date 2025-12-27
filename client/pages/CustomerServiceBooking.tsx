import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Pet, User as UserType, Appointment, Vaccine, VaccinePackage } from "@shared/types";
import { Calendar, Stethoscope, Syringe, Package, Eye, X, ChevronDown, ChevronUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CustomerServiceBooking() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [pets, setPets] = useState<Pet[]>([]);
    const [vets, setVets] = useState<UserType[]>([]);
    const [vaccines, setVaccines] = useState<Vaccine[]>([]);
    const [packages, setPackages] = useState<VaccinePackage[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedPackage, setSelectedPackage] = useState<VaccinePackage | null>(null);
    const [showPackageDetails, setShowPackageDetails] = useState(false);

    // Medical Exam Form (use `doctorId` and `time` as selected slot HH:mm)
    const [examForm, setExamForm] = useState({
        petId: "",
        doctorId: "",
        date: "",
        time: "",
        notes: "",
    });

    // Single-Dose Form
    const [singleDoseForm, setSingleDoseForm] = useState({
        petId: "",
        vaccineId: "",
        doctorId: "",
        date: "",
        time: "",
        notes: "",
    });

    // Package Form
    const [packageForm, setPackageForm] = useState({
        petId: "",
        packageId: "",
        doctorId: "",
        date: "",
        time: "",
        notes: "",
    });

    // Busy slots state (computed from existing appointments/localStorage)
    const [busySlotsByForm, setBusySlotsByForm] = useState<{
        exam: string[];
        single: string[];
        package: string[];
    }>({ exam: [], single: [], package: [] });

    if (!user || user.role !== "customer") {
        return <Navigate to="/login" />;
    }

    useEffect(() => {
        loadData();
    }, [user]);

    // ---------- Helpers for time slots & busy slots ----------
    const generateTimeSlots = (): string[] => {
        const slots: string[] = [];
        const add = (h: number) => slots.push(`${String(h).padStart(2, "0")}:00`);
        for (let h = 8; h <= 10; h++) add(h); // 08,09,10
        for (let h = 13; h <= 16; h++) add(h); // 13,14,15,16
        return slots;
    };

    const extractDateFromAppointment = (a: any): string | null => {
        if (!a) return null;
        if (a.appointment_time) {
            try {
                return new Date(a.appointment_time).toISOString().split("T")[0];
            } catch {
                return null;
            }
        }
        if (a.appointmentDate) return a.appointmentDate;
        return null;
    };

    const extractTimeFromAppointment = (a: any): string | null => {
        if (!a) return null;
        if (a.appointment_time) {
            try {
                const d = new Date(a.appointment_time);
                return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
            } catch {
                return null;
            }
        }
        if (a.appointmentTime) return a.appointmentTime;
        return null;
    };

    const computeBusySlots = (doctorId: string, date: string, branchId?: string) => {
        if (!doctorId || !date) return [] as string[];
        const allAppointments = JSON.parse(localStorage.getItem("petcare_appointments") || "[]");
        const slots: string[] = [];
        allAppointments.forEach((a: any) => {
            const sameDoctor = (a.doctorId && a.doctorId === doctorId) || (a.veterinarianId && a.veterinarianId === doctorId);
            const sameBranch = !branchId || a.branchId === branchId;
            const aDate = extractDateFromAppointment(a);
            if (sameDoctor && sameBranch && aDate === date) {
                const t = extractTimeFromAppointment(a);
                if (t) slots.push(t);
            }
        });
        return Array.from(new Set(slots));
    };

    const isSlotBusy = (slot: string, busySlots: string[]) => busySlots.includes(slot);

    // compute busy slots for each form when doctor/date/branch change
    useEffect(() => {
        const slots = computeBusySlots(examForm.doctorId, examForm.date, user.branchId);
        setBusySlotsByForm((s) => ({ ...s, exam: slots }));
        if (examForm.time && slots.includes(examForm.time)) {
            setExamForm((f) => ({ ...f, time: "" }));
        }
    }, [examForm.doctorId, examForm.date, user.branchId]);

    useEffect(() => {
        const slots = computeBusySlots(singleDoseForm.doctorId, singleDoseForm.date, user.branchId);
        setBusySlotsByForm((s) => ({ ...s, single: slots }));
        if (singleDoseForm.time && slots.includes(singleDoseForm.time)) {
            setSingleDoseForm((f) => ({ ...f, time: "" }));
        }
    }, [singleDoseForm.doctorId, singleDoseForm.date, user.branchId]);

    useEffect(() => {
        const slots = computeBusySlots(packageForm.doctorId, packageForm.date, user.branchId);
        setBusySlotsByForm((s) => ({ ...s, package: slots }));
        if (packageForm.time && slots.includes(packageForm.time)) {
            setPackageForm((f) => ({ ...f, time: "" }));
        }
    }, [packageForm.doctorId, packageForm.date, user.branchId]);

    const loadData = () => {
        try {
            // Load customer's pets
            const allPets = JSON.parse(localStorage.getItem("petcare_pets") || "[]");
            const customerPets = allPets.filter((p: Pet) => p.customerId === user.id);
            setPets(customerPets);

            // Load veterinarians from customer's branch
            const allUsers = JSON.parse(localStorage.getItem("petcare_users") || "[]");
            const isDoctorRole = (u: any) =>
                u.role === "veterinarian" || u.role === "Bác sĩ thú y" || u.employee_role === "Bác sĩ thú y";

            let branchVets = allUsers.filter((u: UserType) => isDoctorRole(u) && u.branchId === user.branchId);

            // Fallback: if no vets in customer's branch or customer has no branch, show all vets
            if (branchVets.length === 0 || !user.branchId) {
                branchVets = allUsers.filter((u: UserType) => isDoctorRole(u));
            }

            // Sort vets by specialization (specialist first, then general)
            branchVets.sort((a: UserType, b: UserType) => {
                const aSpec = a.specialization || "General";
                const bSpec = b.specialization || "General";
                if (aSpec === "General" && bSpec !== "General") return 1;
                if (aSpec !== "General" && bSpec === "General") return -1;
                return aSpec.localeCompare(bSpec);
            });

            setVets(branchVets);

            // Load vaccines
            const allVaccines = JSON.parse(localStorage.getItem("petcare_vaccines") || "[]");
            setVaccines(allVaccines);

            // Load vaccine packages
            const allPackages = JSON.parse(localStorage.getItem("petcare_vaccine_packages") || "[]");
            setPackages(allPackages);

            // Load customer's appointments
            const allAppointments = JSON.parse(localStorage.getItem("petcare_appointments") || "[]");
            const customerAppointments = allAppointments.filter((a: Appointment) => a.customerId === user.id);
            // Sort by appointment datetime (new format appointment_time preferred)
            customerAppointments.sort((a: any, b: any) => {
                const aTime = a.appointment_time
                    ? new Date(a.appointment_time).getTime()
                    : a.appointmentDate && a.appointmentTime
                        ? new Date(`${a.appointmentDate}T${a.appointmentTime}:00`).getTime()
                        : 0;
                const bTime = b.appointment_time
                    ? new Date(b.appointment_time).getTime()
                    : b.appointmentDate && b.appointmentTime
                        ? new Date(`${b.appointmentDate}T${b.appointmentTime}:00`).getTime()
                        : 0;
                return bTime - aTime;
            });
            setAppointments(customerAppointments);
        } catch (error) {
            console.error("Error loading data:", error);
        }
    };

    const generateAppointmentId = () => {
        return `APT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    };

    const handleExamSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!examForm.petId || !examForm.doctorId || !examForm.date || !examForm.time) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        try {
            const pet = pets.find((p) => p.id === examForm.petId);
            const vet = vets.find((v) => String(v.id) === String(examForm.doctorId));

            // combine date + selected time into ISO datetime for appointment_time
            const local = new Date(`${examForm.date}T${examForm.time}:00`);
            const appointment_time = local.toISOString();

            const newAppointment: any = {
                id: generateAppointmentId(),
                petId: examForm.petId,
                customerId: user.id,
                branchId: user.branchId || "branch-1",
                doctorId: examForm.doctorId,
                serviceType: "medical-exam",
                appointment_time,
                reason: "Medical Examination",
                status: "checked-in",
                notes: examForm.notes,
                createdAt: new Date().toISOString(),
            };

            const allAppointments = JSON.parse(localStorage.getItem("petcare_appointments") || "[]");
            allAppointments.push(newAppointment);
            localStorage.setItem("petcare_appointments", JSON.stringify(allAppointments));

            toast({
                title: "Appointment booked successfully!",
                description: `Medical exam for ${pet?.name} scheduled with ${vet?.fullName}`,
            });

            // Reset form
            setExamForm({ petId: "", doctorId: "", date: "", time: "", notes: "" });

            loadData();
        } catch (error) {
            console.error("Error booking appointment:", error);
            toast({
                title: "Error",
                description: "Failed to book appointment. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleSingleDoseSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !singleDoseForm.petId ||
            !singleDoseForm.vaccineId ||
            !singleDoseForm.doctorId ||
            !singleDoseForm.date ||
            !singleDoseForm.time
        ) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        try {
            const pet = pets.find((p) => p.id === singleDoseForm.petId);
            const vaccine = vaccines.find((v) => v.id === singleDoseForm.vaccineId);
            const vet = vets.find((v) => String(v.id) === String(singleDoseForm.doctorId));

            const local = new Date(`${singleDoseForm.date}T${singleDoseForm.time}:00`);
            const appointment_time = local.toISOString();

            const newAppointment: any = {
                id: generateAppointmentId(),
                petId: singleDoseForm.petId,
                customerId: user.id,
                branchId: user.branchId || "branch-1",
                doctorId: singleDoseForm.doctorId,
                serviceType: "single-vaccine",
                appointment_time,
                reason: `Single-Dose Injection: ${vaccine?.name}`,
                status: "checked-in",
                notes: singleDoseForm.notes,
                createdAt: new Date().toISOString(),
            };

            const allAppointments = JSON.parse(localStorage.getItem("petcare_appointments") || "[]");
            allAppointments.push(newAppointment);
            localStorage.setItem("petcare_appointments", JSON.stringify(allAppointments));

            toast({
                title: "Appointment booked successfully!",
                description: `${vaccine?.name} injection for ${pet?.name} scheduled with ${vet?.fullName}`,
            });

            // Reset form
            setSingleDoseForm({ petId: "", vaccineId: "", doctorId: "", date: "", time: "", notes: "" });

            loadData();
        } catch (error) {
            console.error("Error booking appointment:", error);
            toast({
                title: "Error",
                description: "Failed to book appointment. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handlePackageSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (
            !packageForm.petId ||
            !packageForm.packageId ||
            !packageForm.doctorId ||
            !packageForm.date ||
            !packageForm.time
        ) {
            toast({
                title: "Missing Information",
                description: "Please fill in all required fields.",
                variant: "destructive",
            });
            return;
        }

        try {
            const pet = pets.find((p) => p.id === packageForm.petId);
            const pkg = packages.find((p) => p.id === packageForm.packageId);
            const vet = vets.find((v) => String(v.id) === String(packageForm.doctorId));

            const local = new Date(`${packageForm.date}T${packageForm.time}:00`);
            const appointment_time = local.toISOString();

            const newAppointment: any = {
                id: generateAppointmentId(),
                petId: packageForm.petId,
                customerId: user.id,
                branchId: user.branchId || "branch-1",
                doctorId: packageForm.doctorId,
                serviceType: "vaccine-package",
                appointment_time,
                reason: `Package Injection: ${pkg?.name}`,
                status: "checked-in",
                notes: packageForm.notes,
                createdAt: new Date().toISOString(),
            };

            const allAppointments = JSON.parse(localStorage.getItem("petcare_appointments") || "[]");
            allAppointments.push(newAppointment);
            localStorage.setItem("petcare_appointments", JSON.stringify(allAppointments));

            toast({
                title: "Appointment booked successfully!",
                description: `${pkg?.name} for ${pet?.name} scheduled with ${vet?.fullName}`,
            });

            // Reset form
            setPackageForm({ petId: "", packageId: "", doctorId: "", date: "", time: "", notes: "" });
            setSelectedPackage(null);
            setShowPackageDetails(false);

            loadData();
        } catch (error) {
            console.error("Error booking appointment:", error);
            toast({
                title: "Error",
                description: "Failed to book appointment. Please try again.",
                variant: "destructive",
            });
        }
    };

    const handleCancelAppointment = (appointmentId: string) => {
        if (!confirm("Are you sure you want to cancel this appointment?")) {
            return;
        }

        try {
            const allAppointments = JSON.parse(localStorage.getItem("petcare_appointments") || "[]");
            const updatedAppointments = allAppointments.map((a: Appointment) => {
                if (a.id === appointmentId) {
                    return { ...a, status: "Cancelled" as const };
                }
                return a;
            });
            localStorage.setItem("petcare_appointments", JSON.stringify(updatedAppointments));

            toast({
                title: "Appointment cancelled",
                description: "Your appointment has been cancelled successfully.",
            });

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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "checked-in":
                return <Badge className="bg-blue-100 text-blue-700">Checked-In</Badge>;
            case "pending":
                return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
            case "completed":
                return <Badge className="bg-green-100 text-green-700">Completed</Badge>;
            case "cancelled":
                return <Badge className="bg-red-100 text-red-700">Cancelled</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const getServiceTypeDisplay = (type: string) => {
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

    const getPetName = (petId: string) => {
        const pet = pets.find((p) => p.id === petId);
        return pet?.name || "Unknown";
    };

    const getVetName = (vetId?: string) => {
        if (!vetId) return "Not assigned";
        const vet = vets.find((v) => String(v.id) === String(vetId));
        return vet?.fullName || "Unknown";
    };

    const handlePackageChange = (packageId: string) => {
        setPackageForm({ ...packageForm, packageId });
        const pkg = packages.find((p) => p.id === packageId);
        setSelectedPackage(pkg || null);
        if (pkg) {
            setShowPackageDetails(true);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8">
                {/* Page Header */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg p-8 mb-8">
                    <h1 className="text-4xl font-bold mb-2">Service Booking</h1>
                    <p className="text-blue-100 text-lg">
                        Book medical exams, vaccinations, and wellness packages for your pets
                    </p>
                </div>

                {/* Tabs */}
                <Tabs defaultValue="exam" className="space-y-6">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="exam" className="flex items-center gap-2">
                            <Stethoscope className="h-4 w-4" />
                            Medical Exam
                        </TabsTrigger>
                        <TabsTrigger value="single" className="flex items-center gap-2">
                            <Syringe className="h-4 w-4" />
                            Single-Dose Injection
                        </TabsTrigger>
                        <TabsTrigger value="package" className="flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            Package Injection
                        </TabsTrigger>
                    </TabsList>

                    {/* Medical Exam Tab */}
                    <TabsContent value="exam">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Stethoscope className="h-5 w-5" />
                                    Book Medical Examination
                                </CardTitle>
                                <CardDescription>
                                    Schedule a comprehensive health check-up for your pet
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleExamSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="exam-pet">
                                                Pet <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={examForm.petId}
                                                onValueChange={(value) => setExamForm({ ...examForm, petId: value })}
                                            >
                                                <SelectTrigger id="exam-pet">
                                                    <SelectValue placeholder="Select your pet" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {pets.length === 0 ? (
                                                        <SelectItem value="none" disabled>
                                                            No pets found
                                                        </SelectItem>
                                                    ) : (
                                                        pets.map((pet) => (
                                                            <SelectItem key={pet.id} value={pet.id}>
                                                                {pet.name} ({pet.type})
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="exam-vet">
                                                Doctor <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={examForm.doctorId}
                                                onValueChange={(value) => setExamForm({ ...examForm, doctorId: value })}
                                            >
                                                <SelectTrigger id="exam-vet">
                                                    <SelectValue placeholder="Select doctor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {vets.length === 0 ? (
                                                        <SelectItem value="none" disabled>
                                                            No doctors available. Please contact support.
                                                        </SelectItem>
                                                    ) : (
                                                        vets.map((vet) => (
                                                            <SelectItem key={vet.id} value={vet.id}>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{vet.fullName}</span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {vet.specialization || "General Veterinarian"}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="exam-date">
                                                Preferred Date <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="exam-date"
                                                type="date"
                                                value={examForm.date}
                                                onChange={(e) => setExamForm({ ...examForm, date: e.target.value })}
                                                min={new Date().toISOString().split("T")[0]}
                                            />
                                        </div>

                                        <div>
                                            <Label>Preferred Time <span className="text-red-500">*</span></Label>
                                            {!examForm.doctorId ? (
                                                <p className="text-sm text-muted-foreground mt-2">Please select a doctor first</p>
                                            ) : !examForm.date ? (
                                                <p className="text-sm text-muted-foreground mt-2">Please select a date</p>
                                            ) : (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {generateTimeSlots().map((slot) => {
                                                        const busy = isSlotBusy(slot, busySlotsByForm.exam);
                                                        const selected = examForm.time === slot;
                                                        return (
                                                            <button
                                                                key={slot}
                                                                type="button"
                                                                onClick={() => {
                                                                    if (busy) return;
                                                                    setExamForm((f) => ({ ...f, time: slot }));
                                                                }}
                                                                disabled={busy}
                                                                className={`px-3 py-1 rounded border ${selected ? "bg-blue-600 text-white" : "bg-white"} ${busy ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                                            >
                                                                {slot}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="exam-notes">Notes (Optional)</Label>
                                        <Textarea
                                            id="exam-notes"
                                            placeholder="Any specific concerns or symptoms..."
                                            value={examForm.notes}
                                            onChange={(e) => setExamForm({ ...examForm, notes: e.target.value })}
                                            rows={3}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Book Medical Exam
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Single-Dose Injection Tab */}
                    <TabsContent value="single">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Syringe className="h-5 w-5" />
                                    Book Single-Dose Injection
                                </CardTitle>
                                <CardDescription>
                                    Schedule a single vaccine injection for your pet
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSingleDoseSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="single-pet">
                                                Pet <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={singleDoseForm.petId}
                                                onValueChange={(value) =>
                                                    setSingleDoseForm({ ...singleDoseForm, petId: value })
                                                }
                                            >
                                                <SelectTrigger id="single-pet">
                                                    <SelectValue placeholder="Select your pet" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {pets.length === 0 ? (
                                                        <SelectItem value="none" disabled>
                                                            No pets found
                                                        </SelectItem>
                                                    ) : (
                                                        pets.map((pet) => (
                                                            <SelectItem key={pet.id} value={pet.id}>
                                                                {pet.name} ({pet.type})
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="single-vaccine">
                                                Vaccine <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={singleDoseForm.vaccineId}
                                                onValueChange={(value) =>
                                                    setSingleDoseForm({ ...singleDoseForm, vaccineId: value })
                                                }
                                            >
                                                <SelectTrigger id="single-vaccine">
                                                    <SelectValue placeholder="Select vaccine" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {vaccines.length === 0 ? (
                                                        <SelectItem value="none" disabled>
                                                            No vaccines available
                                                        </SelectItem>
                                                    ) : (
                                                        vaccines.map((vaccine) => (
                                                            <SelectItem key={vaccine.id} value={vaccine.id}>
                                                                {vaccine.name} - {formatPrice(vaccine.price)}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="single-vet">
                                                Doctor <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={singleDoseForm.doctorId}
                                                onValueChange={(value) => setSingleDoseForm({ ...singleDoseForm, doctorId: value })}
                                            >
                                                <SelectTrigger id="single-vet">
                                                    <SelectValue placeholder="Select doctor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {vets.length === 0 ? (
                                                        <SelectItem value="none" disabled>
                                                            No doctors available. Please contact support.
                                                        </SelectItem>
                                                    ) : (
                                                        vets.map((vet) => (
                                                            <SelectItem key={vet.id} value={vet.id}>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{vet.fullName}</span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {vet.specialization || "General Veterinarian"}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="single-date">
                                                Preferred Date <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="single-date"
                                                type="date"
                                                value={singleDoseForm.date}
                                                onChange={(e) =>
                                                    setSingleDoseForm({ ...singleDoseForm, date: e.target.value })
                                                }
                                                min={new Date().toISOString().split("T")[0]}
                                            />
                                        </div>

                                        <div>
                                            <Label>Preferred Time <span className="text-red-500">*</span></Label>
                                            {!singleDoseForm.doctorId ? (
                                                <p className="text-sm text-muted-foreground mt-2">Please select a doctor first</p>
                                            ) : !singleDoseForm.date ? (
                                                <p className="text-sm text-muted-foreground mt-2">Please select a date</p>
                                            ) : (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {generateTimeSlots().map((slot) => {
                                                        const busy = isSlotBusy(slot, busySlotsByForm.single);
                                                        const selected = singleDoseForm.time === slot;
                                                        return (
                                                            <button
                                                                key={slot}
                                                                type="button"
                                                                onClick={() => {
                                                                    if (busy) return;
                                                                    setSingleDoseForm((f) => ({ ...f, time: slot }));
                                                                }}
                                                                disabled={busy}
                                                                className={`px-3 py-1 rounded border ${selected ? "bg-blue-600 text-white" : "bg-white"} ${busy ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                                            >
                                                                {slot}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <Label htmlFor="single-notes">Notes (Optional)</Label>
                                        <Textarea
                                            id="single-notes"
                                            placeholder="Any special instructions or concerns..."
                                            value={singleDoseForm.notes}
                                            onChange={(e) =>
                                                setSingleDoseForm({ ...singleDoseForm, notes: e.target.value })
                                            }
                                            rows={3}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Book Single-Dose Injection
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Package Injection Tab */}
                    <TabsContent value="package">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Package className="h-5 w-5" />
                                    Book Package Injection
                                </CardTitle>
                                <CardDescription>
                                    Schedule a comprehensive vaccination package for your pet
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handlePackageSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <Label htmlFor="package-pet">
                                                Pet <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={packageForm.petId}
                                                onValueChange={(value) =>
                                                    setPackageForm({ ...packageForm, petId: value })
                                                }
                                            >
                                                <SelectTrigger id="package-pet">
                                                    <SelectValue placeholder="Select your pet" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {pets.length === 0 ? (
                                                        <SelectItem value="none" disabled>
                                                            No pets found
                                                        </SelectItem>
                                                    ) : (
                                                        pets.map((pet) => (
                                                            <SelectItem key={pet.id} value={pet.id}>
                                                                {pet.name} ({pet.type})
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="package-package">
                                                Vaccine Package <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={packageForm.packageId}
                                                onValueChange={handlePackageChange}
                                            >
                                                <SelectTrigger id="package-package">
                                                    <SelectValue placeholder="Select package" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {packages.length === 0 ? (
                                                        <SelectItem value="none" disabled>
                                                            No packages available
                                                        </SelectItem>
                                                    ) : (
                                                        packages.map((pkg) => (
                                                            <SelectItem key={pkg.id} value={pkg.id}>
                                                                {pkg.name} - {formatPrice(pkg.price)}
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="package-vet">
                                                Doctor <span className="text-red-500">*</span>
                                            </Label>
                                            <Select
                                                value={packageForm.doctorId}
                                                onValueChange={(value) => setPackageForm({ ...packageForm, doctorId: value })}
                                            >
                                                <SelectTrigger id="package-vet">
                                                    <SelectValue placeholder="Select doctor" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {vets.length === 0 ? (
                                                        <SelectItem value="none" disabled>
                                                            No doctors available. Please contact support.
                                                        </SelectItem>
                                                    ) : (
                                                        vets.map((vet) => (
                                                            <SelectItem key={vet.id} value={vet.id}>
                                                                <div className="flex flex-col">
                                                                    <span className="font-medium">{vet.fullName}</span>
                                                                    <span className="text-xs text-muted-foreground">
                                                                        {vet.specialization || "General Veterinarian"}
                                                                    </span>
                                                                </div>
                                                            </SelectItem>
                                                        ))
                                                    )}
                                                </SelectContent>
                                            </Select>
                                        </div>

                                        <div>
                                            <Label htmlFor="package-date">
                                                Preferred Date <span className="text-red-500">*</span>
                                            </Label>
                                            <Input
                                                id="package-date"
                                                type="date"
                                                value={packageForm.date}
                                                onChange={(e) =>
                                                    setPackageForm({ ...packageForm, date: e.target.value })
                                                }
                                                min={new Date().toISOString().split("T")[0]}
                                            />
                                        </div>

                                        <div>
                                            <Label>Preferred Time <span className="text-red-500">*</span></Label>
                                            {!packageForm.doctorId ? (
                                                <p className="text-sm text-muted-foreground mt-2">Please select a doctor first</p>
                                            ) : !packageForm.date ? (
                                                <p className="text-sm text-muted-foreground mt-2">Please select a date</p>
                                            ) : (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                    {generateTimeSlots().map((slot) => {
                                                        const busy = isSlotBusy(slot, busySlotsByForm.package);
                                                        const selected = packageForm.time === slot;
                                                        return (
                                                            <button
                                                                key={slot}
                                                                type="button"
                                                                onClick={() => {
                                                                    if (busy) return;
                                                                    setPackageForm((f) => ({ ...f, time: slot }));
                                                                }}
                                                                disabled={busy}
                                                                className={`px-3 py-1 rounded border ${selected ? "bg-blue-600 text-white" : "bg-white"} ${busy ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                                            >
                                                                {slot}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Package Details */}
                                    {selectedPackage && (
                                        <Card className="border-blue-200 bg-blue-50">
                                            <CardHeader>
                                                <div className="flex items-center justify-between">
                                                    <CardTitle className="text-lg text-blue-900">
                                                        Package Details
                                                    </CardTitle>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => setShowPackageDetails(!showPackageDetails)}
                                                    >
                                                        {showPackageDetails ? (
                                                            <ChevronUp className="h-4 w-4" />
                                                        ) : (
                                                            <ChevronDown className="h-4 w-4" />
                                                        )}
                                                    </Button>
                                                </div>
                                            </CardHeader>
                                            {showPackageDetails && (
                                                <CardContent className="space-y-3">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <p className="text-sm text-blue-700">Package Name</p>
                                                            <p className="font-medium text-blue-900">{selectedPackage.name}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-blue-700">Price</p>
                                                            <p className="font-medium text-blue-900">
                                                                {formatPrice(selectedPackage.price)}
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-blue-700">Month Cycle</p>
                                                            <p className="font-medium text-blue-900">
                                                                {selectedPackage.monthMark} months
                                                            </p>
                                                        </div>
                                                        <div>
                                                            <p className="text-sm text-blue-700">Cycles</p>
                                                            <p className="font-medium text-blue-900">
                                                                {selectedPackage.cycle} cycle(s)
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm text-blue-700 mb-2">Vaccines Included</p>
                                                        <div className="space-y-2">
                                                            {selectedPackage.vaccines.map((v, index) => {
                                                                const vaccine = vaccines.find(vac => vac.id === v.vaccineId);
                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className="p-2 bg-white rounded border border-blue-200"
                                                                    >
                                                                        <p className="font-medium text-sm">{vaccine?.name || 'Unknown Vaccine'}</p>
                                                                        <p className="text-xs text-muted-foreground">
                                                                            Dosage: {v.dosage} ml
                                                                        </p>
                                                                    </div>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                    {selectedPackage.description && (
                                                        <div>
                                                            <p className="text-sm text-blue-700">Description</p>
                                                            <p className="text-sm text-blue-900">
                                                                {selectedPackage.description}
                                                            </p>
                                                        </div>
                                                    )}
                                                </CardContent>
                                            )}
                                        </Card>
                                    )}

                                    <div>
                                        <Label htmlFor="package-notes">Notes (Optional)</Label>
                                        <Textarea
                                            id="package-notes"
                                            placeholder="Any special instructions or concerns..."
                                            value={packageForm.notes}
                                            onChange={(e) =>
                                                setPackageForm({ ...packageForm, notes: e.target.value })
                                            }
                                            rows={3}
                                        />
                                    </div>

                                    <Button type="submit" className="w-full">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        Book Package Injection
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Upcoming Appointments */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle>My Upcoming Appointments</CardTitle>
                        <CardDescription>View and manage your scheduled appointments</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {appointments.length === 0 ? (
                            <div className="text-center py-12">
                                <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                <p className="text-muted-foreground text-lg mb-2">No appointments yet</p>
                                <p className="text-sm text-muted-foreground">
                                    Book your first appointment using the forms above
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead>Time</TableHead>
                                            <TableHead>Service Type</TableHead>
                                            <TableHead>Pet</TableHead>
                                            <TableHead>Veterinarian</TableHead>
                                            <TableHead>Status</TableHead>
                                            <TableHead className="text-right">Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {appointments.map((appointment) => (
                                            <TableRow key={appointment.id}>
                                                <TableCell>{formatDate(extractDateFromAppointment(appointment) ?? appointment.appointmentDate)}</TableCell>
                                                <TableCell>{extractTimeFromAppointment(appointment) ?? appointment.appointmentTime ?? "-"}</TableCell>
                                                <TableCell className="font-medium">
                                                    {getServiceTypeDisplay(appointment.serviceType)}
                                                </TableCell>
                                                <TableCell>{getPetName(appointment.petId)}</TableCell>
                                                <TableCell>{getVetName((appointment as any).doctorId ?? (appointment as any).veterinarianId)}</TableCell>
                                                <TableCell>{getStatusBadge(appointment.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <Link to={`/customer/booking/${appointment.id}`}>
                                                            <Button size="sm" variant="outline">
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                View
                                                            </Button>
                                                        </Link>
                                                        {appointment.status === "checked-in" && (
                                                            <Button
                                                                size="sm"
                                                                variant="destructive"
                                                                onClick={() => handleCancelAppointment(appointment.id)}
                                                            >
                                                                <X className="h-4 w-4 mr-1" />
                                                                Cancel
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
            </main>
        </div>
    );
}
