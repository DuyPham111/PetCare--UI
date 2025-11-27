import ReceptionHeader from "@/components/ReceptionHeader";
import { Card } from "@/components/ui/card";
import ReceptionSummaryCard from "@/components/receptionist/ReceptionSummaryCard";
import sampleReceptionData from "@/data/sampleReceptionData";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";

export default function ReceptionDashboard() {
    const { user } = useAuth();
    if (!user || user.role !== "receptionist") return <Navigate to="/login" />;

    return (
        <div className="min-h-screen bg-white">
            <ReceptionHeader />

            {/* Hero */}
            <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 overflow-hidden pt-14 pb-12">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">Receptionist Workspace</h1>
                                <p className="text-lg text-muted-foreground">Fast bookings, smooth check-ins, and simple billing — all from one place.</p>
                            </div>

                            <div className="flex gap-4 flex-wrap">
                                <Link to="/receptionist/booking"><button className="bg-primary text-white px-4 py-2 rounded-md">New Booking</button></Link>
                                <Link to="/receptionist/checkin"><button className="border px-4 py-2 rounded-md">Check-in Desk</button></Link>
                                <Link to="/receptionist/billing"><button className="border px-4 py-2 rounded-md">Create Invoice</button></Link>
                            </div>

                            <div className="flex gap-8 pt-4">
                                <div>
                                    <p className="text-3xl font-bold text-primary">{(() => { const aps = JSON.parse(localStorage.getItem('petcare_appointments') || '[]'); return aps.filter((a: any) => a.date === new Date().toISOString().split('T')[0]).length })()}</p>
                                    <p className="text-sm text-muted-foreground">Today’s Appointments</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-primary">{(() => { const aps = JSON.parse(localStorage.getItem('petcare_appointments') || '[]'); return aps.filter((a: any) => a.status === 'Scheduled').length })()}</p>
                                    <p className="text-sm text-muted-foreground">Pending</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-primary">{(sampleReceptionData.sampleReceptionCustomers || []).length}</p>
                                    <p className="text-sm text-muted-foreground">Customers</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 md:p-12">
                                <div className="bg-white rounded-xl p-8 text-center space-y-4">
                                    <div className="text-6xl">🎫</div>
                                    <h3 className="text-2xl font-bold text-foreground">Quick Desk</h3>
                                    <p className="text-muted-foreground">Book, check-in and bill customers quickly while keeping a clear waiting list.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-2">Reception Tools</h2>
                <p className="text-muted-foreground mb-6">Common tasks and shortcuts for front-desk operations</p>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Summary cards - counts come from persisted localStorage or sample data */}
                    {(() => {
                        const apsRaw = localStorage.getItem('petcare_appointments');
                        const appointments = apsRaw ? JSON.parse(apsRaw) : sampleReceptionData.sampleReceptionAppointments || [];
                        const todays = appointments.filter((a: any) => a.date === new Date().toISOString().split('T')[0]).length;
                        const pending = appointments.filter((a: any) => a.status === 'Scheduled' || a.status === 'Pending').length;
                        const customers = (sampleReceptionData.sampleReceptionCustomers || []).length;
                        const invoices = (JSON.parse(localStorage.getItem('petcare_invoices') || '[]') || []).length || (sampleReceptionData.sampleReceptionInvoices || []).length;

                        return (
                            <>
                                <ReceptionSummaryCard count={todays} label={"Today's Appointments"} to={'/receptionist/booking'} />
                                <ReceptionSummaryCard count={pending} label={'Pending Check-ins'} to={'/receptionist/checkin'} />
                                <ReceptionSummaryCard count={customers} label={'Active Customers'} to={'/receptionist/pet-lookup'} />

                                <Card className="p-6 border border-border lg:col-span-2">
                                    <h3 className="text-lg font-bold">Billing Support</h3>
                                    <p className="text-sm text-muted-foreground mt-2">Quick invoice creation UI and payment handling.</p>
                                </Card>

                                <Card className="p-6 border border-border">
                                    <h3 className="text-lg font-bold">Invoices</h3>
                                    <p className="text-sm text-muted-foreground mt-2">{invoices} total invoices</p>
                                    <div className="mt-3"> <Link to="/receptionist/billing" className="text-primary">Open Billing</Link></div>
                                </Card>
                            </>
                        );
                    })()}
                </div>
            </div>
        </div>
    );
}
