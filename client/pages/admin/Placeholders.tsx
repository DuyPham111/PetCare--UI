import AdminHeader from "@/components/AdminHeader";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

interface PlaceholderProps {
  title: string;
  description: string;
  icon: string;
}

function PlaceholderPage({ title, description, icon }: PlaceholderProps) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="container mx-auto px-4 py-8">
        <Card className="p-12 text-center border border-border">
          <div className="text-6xl mb-4">{icon}</div>
          <h1 className="text-4xl font-bold text-foreground mb-2">{title}</h1>
          <p className="text-xl text-muted-foreground mb-4">{description}</p>
          <p className="text-muted-foreground">This page is coming soon. Full functionality will be available in the next update.</p>
        </Card>
      </div>
    </div>
  );
}

export function BranchesPage() {
  return (
    <PlaceholderPage
      title="Branches"
      description="Manage hospital branches and their services"
      icon="🏥"
    />
  );
}

export function MedicalRecordsPage() {
  return (
    <PlaceholderPage
      title="Medical Records"
      description="View and manage pet medical records"
      icon="📋"
    />
  );
}

export function ServicesPage() {
  return (
    <PlaceholderPage
      title="Services"
      description="Manage services offered at each branch"
      icon="🔧"
    />
  );
}

export function ProductsPage() {
  return (
    <PlaceholderPage
      title="Pet Products"
      description="Manage pet items and products inventory"
      icon="🛒"
    />
  );
}

export function InvoicesPage() {
  return (
    <PlaceholderPage
      title="Invoices"
      description="Generate and track invoices for appointments and products"
      icon="📄"
    />
  );
}
