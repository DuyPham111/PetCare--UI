import PharmacistHeader from "@/components/PharmacistHeader";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, Link } from "react-router-dom";

export default function PharmacistDashboard() {
    const { user } = useAuth();
    if (!user || user.role !== "pharmacist") return <Navigate to="/login" />;

    return (
        <div className="min-h-screen bg-white">
            <PharmacistHeader />

            <section className="relative bg-gradient-to-br from-primary/5 via-white to-secondary/5 overflow-hidden pt-14 pb-12">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-10 right-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 left-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
                </div>

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">Pharmacy Dashboard</h1>
                                <p className="text-lg text-muted-foreground">Inventory, prescriptions, and dispensary workflows at a glance.</p>
                            </div>

                            <div className="flex gap-4 flex-wrap">
                                <Link to="/pharmacist/inventory"><button className="bg-primary text-white px-4 py-2 rounded-md">Inventory</button></Link>
                                <Link to="/pharmacist/prescriptions"><button className="border px-4 py-2 rounded-md">Prescriptions</button></Link>
                                <Link to="/pharmacist/import-export"><button className="border px-4 py-2 rounded-md">Import/Export</button></Link>
                            </div>

                            <div className="flex gap-8 pt-4">
                                <div>
                                    <p className="text-3xl font-bold text-primary">{localStorage.getItem('petcare_medications') ? JSON.parse(localStorage.getItem('petcare_medications') || '[]').length : 0}</p>
                                    <p className="text-sm text-muted-foreground">Medications</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-primary">{localStorage.getItem('petcare_medications') ? JSON.parse(localStorage.getItem('petcare_medications') || '[]').filter((m: any) => m.quantity < 20).length : 0}</p>
                                    <p className="text-sm text-muted-foreground">Low stock</p>
                                </div>
                                <div>
                                    <p className="text-3xl font-bold text-primary">{localStorage.getItem('petcare_invoices') ? JSON.parse(localStorage.getItem('petcare_invoices') || '[]').length : 0}</p>
                                    <p className="text-sm text-muted-foreground">Pending Orders</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-2xl p-8 md:p-12">
                                <div className="bg-white rounded-xl p-8 text-center space-y-4">
                                    <div className="text-6xl">💊</div>
                                    <h3 className="text-2xl font-bold text-foreground">Dispensary</h3>
                                    <p className="text-muted-foreground">Process prescriptions quickly and keep stock healthy.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="container mx-auto px-4 py-8">
                <h2 className="text-2xl font-bold mb-2">Pharmacy Tools</h2>
                <p className="text-muted-foreground mb-6">Fast access to inventory and prescription workflows</p>

                <div className="grid lg:grid-cols-3 gap-6">
                    <Card className="p-6 border border-border">
                        <h3 className="text-lg font-bold">Medication Inventory</h3>
                        <p className="text-sm text-muted-foreground mt-2">View and manage current stock levels.</p>
                    </Card>

                    <Card className="p-6 border border-border">
                        <h3 className="text-lg font-bold">Prescription Processing</h3>
                        <p className="text-sm text-muted-foreground mt-2">Confirm and prepare prescriptions from vets.</p>
                    </Card>

                    <Card className="p-6 border border-border">
                        <h3 className="text-lg font-bold">Low Stock Alerts</h3>
                        <p className="text-sm text-muted-foreground mt-2">Alerts for medications with low quantities.</p>
                    </Card>

                    <Card className="p-6 border border-border lg:col-span-2">
                        <h3 className="text-lg font-bold">Export / Import</h3>
                        <p className="text-sm text-muted-foreground mt-2">Bulk import or export medication and prescription data.</p>
                    </Card>

                    <Card className="p-6 border border-border">
                        <h3 className="text-lg font-bold">My Profile</h3>
                        <p className="text-sm text-muted-foreground mt-2">View and edit your staff profile.</p>
                        <div className="mt-3"> <Link to="/pharmacist/profile" className="text-primary">Open Profile</Link></div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
