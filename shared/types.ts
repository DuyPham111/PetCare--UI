// User and Authentication
export type UserRole = "customer" | "receptionist" | "veterinarian" | "pharmacist" | "admin";

export interface User {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  role: UserRole;
  branchId?: string;
  profileImage?: string;
  phone?: string;
  specialization?: string;
  licenseNumber?: string;
  availability?: DoctorAvailability[];
  createdAt: string;
}

export interface DoctorAvailability {
  day: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

// Hospital Branches
export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  zipCode: string;
  managerId: string;
  services: string[];
  workingHours: {
    monday: { start: string; end: string };
    tuesday: { start: string; end: string };
    wednesday: { start: string; end: string };
    thursday: { start: string; end: string };
    friday: { start: string; end: string };
    saturday: { start: string; end: string };
    sunday: { start: string; end: string };
  };
  createdAt: string;
}

// Pets
export interface Pet {
  id: string;
  customerId: string;
  name: string;
  type: "dog" | "cat" | "rabbit" | "bird" | "other";
  breed: string;
  age: number;
  weight: number;
  color?: string;
  microchipId?: string;
  medicalHistory: MedicalRecord[];
  vaccinations: Vaccination[];
  createdAt: string;
}

// Medical Records
export interface MedicalRecord {
  id: string;
  petId: string;
  appointmentId: string;
  veterinarianId: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  prescriptions: Prescription[];
  weight?: number;
  temperature?: number;
  bloodPressure?: string;
  dateRecorded: string;
}

// Prescriptions
export interface Prescription {
  id: string;
  medicationId: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

// Vaccinations
export interface Vaccination {
  id: string;
  petId: string;
  vaccineName: string;
  administeredDate: string;
  nextBoosterDate?: string;
  veterinarianId: string;
  branchId: string;
  notes?: string;
}

// Appointments
export type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

export interface Appointment {
  id: string;
  petId: string;
  customerId: string;
  branchId: string;
  appointmentDate: string;
  appointmentTime: string;
  serviceType: string;
  veterinarianId?: string;
  reasonForVisit: string;
  status: AppointmentStatus;
  invoiceId?: string;
  notes?: string;
  createdAt: string;
}

// Medications/Inventory
export interface Medication {
  id: string;
  name: string;
  description: string;
  strength: string;
  unit: string;
  manufacturer: string;
  batchNumber: string;
  expiryDate: string;
  quantity: number;
  reorderLevel: number;
  price: number;
  branchId?: string;
}

export interface MedicationUsage {
  id: string;
  medicationId: string;
  appointmentId: string;
  quantityUsed: number;
  usedDate: string;
  usedBy: string;
  notes?: string;
}

// Services
export interface Service {
  id: string;
  name: string;
  description: string;
  category: "checkup" | "vaccination" | "surgery" | "grooming" | "dental" | "other";
  price: number;
  duration: number;
  branchId: string;
  availableVeterinarians: string[];
  rating: number;
  reviews: ServiceReview[];
}

export interface ServiceReview {
  id: string;
  serviceId: string;
  customerId: string;
  rating: number;
  comment: string;
  dateCreated: string;
}

// Pet Products/Items
export interface PetItem {
  id: string;
  productCode: string;
  name: string;
  description: string;
  category: "food" | "toy" | "accessory" | "medication" | "other";
  price: number;
  stock: number;
  image?: string;
  branchId?: string;
  createdAt?: string;
}

export interface CartItem {
  itemId: string;
  quantity: number;
  price: number;
}

// Orders
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  loyaltyPointsApplied: number;
  loyaltyDiscount: number;
  total: number;
  status: OrderStatus;
  createdAt: string;
  deliveryDate?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Loyalty Program
export type LoyaltyTier = "bronze" | "silver" | "gold";

export interface LoyaltyAccount {
  id: string;
  customerId: string;
  points: number;
  tier: LoyaltyTier;
  totalSpent: number;
  createdAt: string;
  updatedAt: string;
}

export const LOYALTY_CONFIG = {
  pointsPerVND: 1 / 50000, // 1 point per 50K VND
  tiers: {
    bronze: { minSpent: 0, discount: 0.05 },
    silver: { minSpent: 5000000, discount: 0.1 },
    gold: { minSpent: 12000000, discount: 0.15 },
  },
} as const;

// Invoices
export type InvoiceStatus = "draft" | "pending" | "paid" | "overdue" | "cancelled";

export interface Invoice {
  id: string;
  appointmentId?: string;
  customerId: string;
  branchId: string;
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: InvoiceStatus;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

// Customer (extends User)
export interface Customer extends User {
  role: "customer";
  pets: string[];
  invoices: string[];
  appointments: string[];
}
