import { Navigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Heart, Calendar, Gift, Package, User, Star } from "lucide-react";
import { useState, useEffect } from "react";
import { getMembershipDisplay, DEFAULT_MEMBERSHIP_LEVEL } from "@/lib/membershipUtils";

export default function CustomerDashboard() {
  const { user } = useAuth();

  if (!user || user.role !== "customer") {
    return <Navigate to="/login" />;
  }

  // Mock data - in real app, fetch from API
  const [stats, setStats] = useState({
    totalOrders: 12,
    totalPets: 2,
    upcomingAppointments: 3,
    loyaltyPoints: 450
  });

  const [loyaltyTier, setLoyaltyTier] = useState({
    tier: user.membershipLevel || DEFAULT_MEMBERSHIP_LEVEL,
    points: 450,
    nextTier: "VIP",
    pointsToNext: 50,
    discount: 10
  });

  const summaryCards = [
    { title: "Total Orders", value: stats.totalOrders, icon: ShoppingBag, color: "text-blue-600" },
    { title: "My Pets", value: stats.totalPets, icon: Heart, color: "text-pink-600" },
    { title: "Upcoming Appointments", value: stats.upcomingAppointments, icon: Calendar, color: "text-green-600" },
    { title: "Loyalty Points", value: stats.loyaltyPoints, icon: Gift, color: "text-purple-600" },
  ];

  const recentOrders = [
    { id: "ORD-1234", date: "2024-01-15", items: "Premium Dog Food, Vitamin Supplements", total: "$85.50", status: "Delivered" },
    { id: "ORD-1233", date: "2024-01-10", items: "Cat Toys, Scratching Post", total: "$42.00", status: "Delivered" },
    { id: "ORD-1232", date: "2024-01-05", items: "Dog Shampoo, Grooming Kit", total: "$38.75", status: "Delivered" },
  ];

  const upcomingAppointments = [
    { id: 1, pet: "Max", service: "Annual Check-up", date: "2024-01-20", time: "10:00 AM", vet: "Dr. Smith" },
    { id: 2, pet: "Luna", service: "Vaccination", date: "2024-01-22", time: "2:00 PM", vet: "Dr. Johnson" },
    { id: 3, pet: "Max", service: "Dental Cleaning", date: "2024-01-25", time: "11:00 AM", vet: "Dr. Smith" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - Sales Style */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user.fullName}!</h1>
          <p className="text-blue-100 text-lg">Manage your pets, appointments, and orders all in one place</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {summaryCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <Card key={index}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{card.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Loyalty Status Card */}
        <Card className="mb-8 border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-3 rounded-full">
                  <Star className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-xl">Membership: {getMembershipDisplay(loyaltyTier.tier)}</CardTitle>
                  <CardDescription>
                    Upgraded automatically based on yearly spending
                  </CardDescription>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-primary">{loyaltyTier.points}</div>
                <div className="text-sm text-muted-foreground">Points</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${(loyaltyTier.points / 500) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-sm font-medium text-primary">{loyaltyTier.discount}% discount</div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/appointments">
              <button className="w-full bg-primary text-white px-4 py-3 rounded-md hover:bg-primary/90 transition">
                Book Appointment
              </button>
            </Link>
            <Link to="/shop">
              <button className="w-full border border-border px-4 py-3 rounded-md hover:bg-accent transition">
                Browse Products
              </button>
            </Link>
            <Link to="/medical-history">
              <button className="w-full border border-border px-4 py-3 rounded-md hover:bg-accent transition">
                Medical History
              </button>
            </Link>
            <Link to="/profile">
              <button className="w-full border border-border px-4 py-3 rounded-md hover:bg-accent transition">
                Manage Pets
              </button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Appointments</CardTitle>
              <CardDescription>Your scheduled veterinary visits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingAppointments.map((appointment) => (
                  <div key={appointment.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                    <div>
                      <p className="font-medium">{appointment.service} - {appointment.pet}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                      </p>
                      <p className="text-sm text-muted-foreground">with {appointment.vet}</p>
                    </div>
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>Your latest purchases</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between border-b pb-3 last:border-b-0">
                    <div>
                      <p className="font-medium">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.items}</p>
                      <p className="text-sm text-green-600">{order.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{order.total}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(order.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
