import AdminHeader from "@/components/AdminHeader";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useAppointments, useMedications, useInvoices, usePets } from "@/hooks/useHospitalData";
import { Calendar, AlertTriangle, DollarSign, Users, Pill, TrendingUp } from "lucide-react";
import { Navigate } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const { appointments } = useAppointments();
  const { medications } = useMedications();
  const { invoices } = useInvoices();
  const { pets } = usePets();

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Calculate metrics
  const todayAppointments = appointments.filter((apt) => {
    const aptDate = new Date(apt.appointmentDate).toDateString();
    const today = new Date().toDateString();
    return aptDate === today;
  });

  const pendingInvoices = invoices.filter((inv) => inv.status === "pending");
  const totalRevenue = invoices
    .filter((inv) => inv.status === "paid")
    .reduce((sum, inv) => sum + inv.total, 0);

  const expiredMedications = medications.filter((med) => {
    const expiryDate = new Date(med.expiryDate);
    return expiryDate < new Date();
  });

  const lowStockMedications = medications.filter((med) => med.quantity <= med.reorderLevel);

  const appointmentStatus = {
    pending: appointments.filter((a) => a.status === "pending").length,
    confirmed: appointments.filter((a) => a.status === "confirmed").length,
    completed: appointments.filter((a) => a.status === "completed").length,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.fullName}! Here's your hospital overview.
          </p>
        </div>

        {/* Critical Alerts */}
        {(expiredMedications.length > 0 || lowStockMedications.length > 0) && (
          <div className="mb-8 space-y-3">
            {expiredMedications.length > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-red-900">
                    {expiredMedications.length} medication(s) expired
                  </p>
                  <p className="text-sm text-red-700">Please remove these from inventory</p>
                </div>
              </div>
            )}
            {lowStockMedications.length > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-yellow-900">
                    {lowStockMedications.length} medication(s) low in stock
                  </p>
                  <p className="text-sm text-yellow-700">Consider reordering soon</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Today's Appointments</p>
                <p className="text-3xl font-bold text-foreground mt-2">{todayAppointments.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-primary/20" />
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Pets</p>
                <p className="text-3xl font-bold text-foreground mt-2">{pets.length}</p>
              </div>
              <Users className="w-12 h-12 text-secondary/20" />
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Pending Invoices</p>
                <p className="text-3xl font-bold text-foreground mt-2">${pendingInvoices.reduce((sum, inv) => sum + inv.total, 0).toFixed(2)}</p>
              </div>
              <DollarSign className="w-12 h-12 text-destructive/20" />
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground mt-2">${totalRevenue.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500/20" />
            </div>
          </Card>
        </div>

        {/* Appointment Status Overview */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <Card className="p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">Appointment Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-foreground">Pending</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{appointmentStatus.pending}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full" />
                  <span className="text-foreground">Confirmed</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{appointmentStatus.confirmed}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-foreground">Completed</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{appointmentStatus.completed}</span>
              </div>
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-6">Medication Status</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full" />
                  <span className="text-foreground">Total Medications</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{medications.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-foreground">Low Stock</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{lowStockMedications.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-500 rounded-full" />
                  <span className="text-foreground">Expired</span>
                </div>
                <span className="text-2xl font-bold text-foreground">{expiredMedications.length}</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 border border-border">
          <h2 className="text-xl font-bold text-foreground mb-6">Recent Appointments</h2>
          {appointments.length === 0 ? (
            <p className="text-muted-foreground">No appointments yet</p>
          ) : (
            <div className="space-y-4">
              {appointments.slice(-5).reverse().map((apt) => (
                <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-foreground">Appointment {apt.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(apt.appointmentDate).toLocaleDateString()} at {apt.appointmentTime}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${apt.status === "confirmed"
                    ? "bg-green-100 text-green-700"
                    : apt.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-blue-100 text-blue-700"
                    }`}>
                    {apt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
