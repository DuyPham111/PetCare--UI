import AdminLayout from "@/components/AdminLayout";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Calendar, DollarSign, Users, TrendingUp } from "lucide-react";
import { Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiGet } from "@/api/api";

export default function Dashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Fetch appointments and invoices on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        // TODO: confirm backend endpoints and response envelopes. We expect
        // GET /api/appointments -> array or { data: [] }
        // GET /api/invoices -> array or { data: [] }
        const [apptsResp, invResp] = await Promise.all([apiGet('/appointments'), apiGet('/invoices')]);
        const appts = apptsResp?.data ?? apptsResp ?? [];
        const invs = invResp?.data ?? invResp ?? [];
        if (!mounted) return;
        setAppointments(Array.isArray(appts) ? appts : []);
        setInvoices(Array.isArray(invs) ? invs : []);
      } catch (e: any) {
        console.error('Failed to load admin data', e);
        if (!mounted) return;
        setError(e?.message || 'Failed to load data');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Helper to normalize appointment date (accept appointmentDate or date or createdAt)
  const getAptDate = (a: any) => {
    return a.appointmentDate || a.date || a.createdAt || null;
  };

  const todayStr = new Date().toISOString().split('T')[0];

  const totalAppointments = appointments.length;
  const totalInvoices = invoices.length;
  // Sum paid invoices (status check tolerant to casing)
  const totalRevenue = invoices
    .filter((inv: any) => String(inv.status || '').toLowerCase() === 'paid')
    .reduce((sum: number, inv: any) => sum + (Number(inv.total) || 0), 0);

  const todayAppointments = appointments.filter((a) => {
    const d = getAptDate(a);
    if (!d) return false;
    return d.split('T')[0] === todayStr;
  }).length;

  // Simple per-day appointments for last 7 days
  const perDayAppointments = (() => {
    const days = Array.from({ length: 7 }).map((_, i) => {
      const dt = new Date();
      dt.setDate(dt.getDate() - (6 - i));
      return dt.toISOString().split('T')[0];
    });
    const counts: Record<string, number> = {};
    days.forEach(d => counts[d] = 0);
    appointments.forEach(a => {
      const d = (getAptDate(a) || '').split('T')[0];
      if (counts[d] !== undefined) counts[d]++;
    });
    return days.map(d => ({ date: d, count: counts[d] || 0 }));
  })();

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user.fullName}! Here's your hospital overview.
          </p>
        </div>

        {/* Branch filter removed — dashboard shows global stats by default */}

        {/* Inventory alerts removed (not available in this refactor) */}

        {/* Key Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Today's Appointments</p>
                <p className="text-3xl font-bold text-foreground mt-2">{loading ? '—' : todayAppointments}</p>
              </div>
              <Calendar className="w-12 h-12 text-primary/20" />
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Appointments</p>
                <p className="text-3xl font-bold text-foreground mt-2">{loading ? '—' : totalAppointments}</p>
              </div>
              <Users className="w-12 h-12 text-secondary/20" />
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Invoices</p>
                <p className="text-3xl font-bold text-foreground mt-2">{loading ? '—' : totalInvoices}</p>
              </div>
              <DollarSign className="w-12 h-12 text-destructive/20" />
            </div>
          </Card>

          <Card className="p-6 border border-border">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-medium">Total Revenue</p>
                <p className="text-3xl font-bold text-foreground mt-2">{loading ? '—' : `$${totalRevenue.toFixed(2)}`}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500/20" />
            </div>
          </Card>
        </div>

        {/* Small per-day appointments chart (last 7 days) */}
        <div className="mb-8">
          <Card className="p-6 border border-border">
            <h2 className="text-xl font-bold text-foreground mb-4">Appointments (last 7 days)</h2>
            {loading ? (
              <div className="text-center py-8">Loading chart...</div>
            ) : error ? (
              <div className="text-destructive py-4">{error}</div>
            ) : (
              <div className="flex items-end gap-2 h-32">
                {perDayAppointments.map((d) => {
                  const max = Math.max(...perDayAppointments.map(p => p.count), 1);
                  const height = Math.round((d.count / max) * 100);
                  return (
                    <div key={d.date} className="flex-1 text-center">
                      <div className="mx-auto bg-primary/60 rounded-b" style={{ height: `${height}%`, width: '100%' }} />
                      <div className="text-xs mt-2">{new Date(d.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</div>
                      <div className="text-xs text-muted-foreground">{d.count}</div>
                    </div>
                  );
                })}
              </div>
            )}
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
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${apt.status === "checked-in"
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
    </AdminLayout>
  );
}
