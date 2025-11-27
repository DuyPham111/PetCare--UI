import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import { useEffect } from "react";
import { initializeMockData } from "@/lib/mockData";

// Customer Pages
import Index from "./pages/Index";
import Appointments from "./pages/Appointments";
import Vaccinations from "./pages/Vaccinations";
import NotFound from "./pages/NotFound";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Customer Dashboard Pages
import CustomerDashboard from "./pages/CustomerDashboard";
import ProductStore from "./pages/ProductStore";
import Cart from "./pages/Cart";
import OrderHistory from "./pages/OrderHistory";
import CustomerProfile from "./pages/CustomerProfile";

// Admin Pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminAppointments from "./pages/admin/Appointments";
import AdminStaff from "./pages/admin/Staff";
import AdminMedications from "./pages/admin/Medications";
import {
  BranchesPage,
  MedicalRecordsPage,
  ServicesPage,
  ProductsPage,
  InvoicesPage,
} from "./pages/admin/Placeholders";

// Vet / Receptionist / Pharmacist pages
import VetDashboard from "./pages/vet/Dashboard";
import VetProfile from "./pages/vet/Profile";
import VetEditProfile from "./pages/vet/EditProfile";
import VetToday from "./pages/vet/TodayAppointments";
import VetRecords from "./pages/vet/MedicalRecords";
import VetAssignedPets from "./pages/vet/AssignedPets";
import VetNotifications from "./pages/vet/Notifications";

import ReceptionDashboard from "./pages/receptionist/Dashboard";
import ReceptionProfile from "./pages/receptionist/Profile";
import ReceptionEditProfile from "./pages/receptionist/EditProfile";
import ReceptionBooking from "./pages/receptionist/Booking";
import ReceptionCheckin from "./pages/receptionist/Checkin";
import ReceptionPetLookup from "./pages/receptionist/PetLookup";
import ReceptionBilling from "./pages/receptionist/Billing";

import PharmacistDashboard from "./pages/pharmacist/Dashboard";
import PharmacistProfile from "./pages/pharmacist/Profile";
import PharmacistEditProfile from "./pages/pharmacist/EditProfile";
import PharmacistInventory from "./pages/pharmacist/Inventory";
import PharmacistPrescriptions from "./pages/pharmacist/Prescriptions";
import PharmacistLowStock from "./pages/pharmacist/LowStock";
import PharmacistImportExport from "./pages/pharmacist/ImportExport";

const queryClient = new QueryClient();

const AppContent = () => {
  useEffect(() => {
    initializeMockData();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <CartProvider>
            <Routes>
              {/* Auth Routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Customer Routes */}
              <Route path="/" element={<Index />} />
              <Route path="/appointments" element={<Appointments />} />
              <Route path="/vaccinations" element={<Vaccinations />} />

              {/* Customer Dashboard Routes */}
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/store" element={<ProductStore />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/orders" element={<OrderHistory />} />
              <Route path="/profile" element={<CustomerProfile />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/appointments" element={<AdminAppointments />} />
              <Route path="/admin/staff" element={<AdminStaff />} />
              <Route path="/admin/medications" element={<AdminMedications />} />
              <Route path="/admin/branches" element={<BranchesPage />} />
              <Route path="/admin/medical-records" element={<MedicalRecordsPage />} />
              <Route path="/admin/services" element={<ServicesPage />} />
              <Route path="/admin/products" element={<ProductsPage />} />
              <Route path="/admin/invoices" element={<InvoicesPage />} />

              {/* Veterinarian Routes */}
              <Route path="/vet" element={<VetDashboard />} />
              <Route path="/vet/dashboard" element={<VetDashboard />} />
              <Route path="/vet/appointments-today" element={<VetToday />} />
              <Route path="/vet/medical-records" element={<VetRecords />} />
              <Route path="/vet/assigned-pets" element={<VetAssignedPets />} />
              <Route path="/vet/notifications" element={<VetNotifications />} />
              <Route path="/vet/profile" element={<VetProfile />} />
              <Route path="/vet/profile/edit" element={<VetEditProfile />} />

              {/* Receptionist Routes */}
              <Route path="/receptionist" element={<ReceptionDashboard />} />
              <Route path="/receptionist/dashboard" element={<ReceptionDashboard />} />
              <Route path="/receptionist/profile" element={<ReceptionProfile />} />
              <Route path="/receptionist/profile/edit" element={<ReceptionEditProfile />} />
              <Route path="/receptionist/booking" element={<ReceptionBooking />} />
              <Route path="/receptionist/checkin" element={<ReceptionCheckin />} />
              <Route path="/receptionist/pet-lookup" element={<ReceptionPetLookup />} />
              <Route path="/receptionist/billing" element={<ReceptionBilling />} />

              {/* Pharmacist Routes */}
              <Route path="/pharmacist" element={<PharmacistDashboard />} />
              <Route path="/pharmacist/dashboard" element={<PharmacistDashboard />} />
              <Route path="/pharmacist/profile" element={<PharmacistProfile />} />
              <Route path="/pharmacist/profile/edit" element={<PharmacistEditProfile />} />

              {/* Catch All */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </CartProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const App = () => (
  <AuthProvider>
    <AppContent />
  </AuthProvider>
);

export default App;
