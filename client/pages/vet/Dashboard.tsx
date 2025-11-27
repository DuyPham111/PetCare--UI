import VetHeader from "@/components/VetHeader";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import VetSummaryCard from "@/components/vet/VetSummaryCard";
import VetNotificationsList from "@/components/vet/VetNotificationsList";
import { sampleAppointments, sampleRecords, sampleNotifications } from "@/data/sampleVetData";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

export default function VetDashboard() {
    const { user } = useAuth();

    if (!user || user.role !== "veterinarian") {
        return <Navigate to="/login" />;
    }

    // using sample data for counts
    const todaysCount = sampleAppointments.length;
    const pendingRecords = sampleRecords.filter((r) => !r.diagnosis).length;
    const unread = sampleNotifications.filter((n) => !n.read).length;
    return (
        <div className="min-h-screen bg-white">
            <VetHeader />

            {/* Hero Section (follows homepage style) */}
            <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 overflow-hidden pt-14 pb-12">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">Welcome, Dr. {user.fullName}</h1>
                                <p className="text-lg text-muted-foreground">Quick snapshot of your day and clinical tools for efficient workflows.</p>
                            </div>

                            <div className="flex gap-4 flex-wrap">
                                <Link to="/vet/appointments-today"><Button size="lg" className="bg-primary text-white">Today's Appointments</Button></Link>
                                <Link to="/vet/medical-records"><Button size="lg" variant="outline" className="border-primary text-primary">Open Records</Button></Link>
                            </div>

                            <div className="flex gap-8 pt-4">
                                <div>
                                    <p className="text-3xl font-bold text-primary">{todaysCount}</p>
                                    <p className="text-sm text-muted-foreground">Appointments today</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-primary">{pendingRecords}</p>
                                    <p className="text-sm text-muted-foreground">Pending records</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-primary">{unread}</p>
                                    <p className="text-sm text-muted-foreground">Unread notifications</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 md:p-12">
                                <div className="bg-white rounded-xl p-8 text-center space-y-4">
                                    <div className="text-6xl">🩺</div>
                                    <h3 className="text-2xl font-bold text-foreground">Clinical Dashboard</h3>
                                    <p className="text-muted-foreground">Patient charts, recent labs, and follow-ups in one place.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Core content: summary cards & activity */}
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h2 className="text-2xl font-bold">Overview</h2>
                    <p className="text-muted-foreground">Key shortcuts and recent items</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    <VetSummaryCard count={todaysCount} label={"Today's Appointments"} to={'/vet/appointments-today'} />
                    <VetSummaryCard count={pendingRecords} label={'Pending Medical Records'} to={'/vet/medical-records'} />
                    <VetSummaryCard count={unread} label={'Unread Notifications'} to={'/vet/notifications'} />

                    <Card className="p-6 border border-border lg:col-span-2">
                        <h3 className="text-lg font-bold mb-3">Recent Activity</h3>
                        <div className="space-y-3 text-sm text-muted-foreground">
                            <div>New booking: Bella at 09:30</div>
                            <div>Record updated: rec-201</div>
                            <div>Medication low stock notice: Amoxicillin</div>
                            <div>Customer feedback received for rec-202</div>
                            <div>System maintenance scheduled tonight</div>
                        </div>
                        <div className="pt-4 flex gap-2">
                            <Link to="/vet/appointments-today"><button className="bg-primary text-white px-3 py-2 rounded-md">Open Today's Appointments</button></Link>
                            <Link to="/vet/medical-records"><button className="border px-3 py-2 rounded-md">Open Medical Records</button></Link>
                            <Link to="/vet/assigned-pets"><button className="border px-3 py-2 rounded-md">Open Assigned Pets</button></Link>
                            <Link to="/vet/profile"><button className="border px-3 py-2 rounded-md">Open Profile</button></Link>
                        </div>
                    </Card>

                    <div className="lg:col-span-1">
                        <h3 className="text-lg font-bold mb-3">Notifications</h3>
                        <VetNotificationsList notifications={sampleNotifications} />
                    </div>
                </div>
            </div>
        </div>
    );
}
