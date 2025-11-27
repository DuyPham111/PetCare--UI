import { User, Branch, Pet, Appointment, Medication, Service, PetItem, Invoice, Order, LoyaltyAccount } from "@shared/types";

export const mockUsers: User[] = [
  {
    id: "user-admin",
    email: "admin@petcare.com",
    password: "admin123",
    fullName: "Admin User",
    role: "admin",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-vet-1",
    email: "dr.smith@petcare.com",
    password: "vet123",
    fullName: "Dr. Smith",
    role: "veterinarian",
    branchId: "branch-1",
    specialization: "General Practice",
    licenseNumber: "VET001",
    phone: "(555) 111-0001",
    availability: [
      { day: "monday", startTime: "08:00", endTime: "17:00", isAvailable: true },
      { day: "tuesday", startTime: "08:00", endTime: "17:00", isAvailable: true },
      { day: "wednesday", startTime: "08:00", endTime: "17:00", isAvailable: true },
      { day: "thursday", startTime: "08:00", endTime: "17:00", isAvailable: true },
      { day: "friday", startTime: "08:00", endTime: "17:00", isAvailable: true },
      { day: "saturday", startTime: "09:00", endTime: "14:00", isAvailable: true },
      { day: "sunday", startTime: "", endTime: "", isAvailable: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-vet-2",
    email: "dr.johnson@petcare.com",
    password: "vet123",
    fullName: "Dr. Johnson",
    role: "veterinarian",
    branchId: "branch-1",
    specialization: "Surgery & Orthopedics",
    licenseNumber: "VET002",
    phone: "(555) 111-0002",
    availability: [
      { day: "monday", startTime: "09:00", endTime: "18:00", isAvailable: true },
      { day: "tuesday", startTime: "09:00", endTime: "18:00", isAvailable: true },
      { day: "wednesday", startTime: "09:00", endTime: "18:00", isAvailable: true },
      { day: "thursday", startTime: "", endTime: "", isAvailable: false },
      { day: "friday", startTime: "09:00", endTime: "18:00", isAvailable: true },
      { day: "saturday", startTime: "", endTime: "", isAvailable: false },
      { day: "sunday", startTime: "", endTime: "", isAvailable: false },
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-receptionist",
    email: "reception@petcare.com",
    password: "rec123",
    fullName: "Sarah Reception",
    role: "receptionist",
    branchId: "branch-1",
    phone: "(555) 111-0003",
    createdAt: new Date().toISOString(),
  },
  {
    id: "user-pharmacist",
    email: "pharmacy@petcare.com",
    password: "pharm123",
    fullName: "Mike Pharmacist",
    role: "pharmacist",
    branchId: "branch-1",
    phone: "(555) 111-0004",
    createdAt: new Date().toISOString(),
  },
  {
    id: "customer-1",
    email: "john@example.com",
    password: "customer123",
    fullName: "John Doe",
    role: "customer",
    phone: "(555) 123-4567",
    createdAt: new Date().toISOString(),
  },
  {
    id: "customer-2",
    email: "jane@example.com",
    password: "customer123",
    fullName: "Jane Smith",
    role: "customer",
    phone: "(555) 123-4568",
    createdAt: new Date().toISOString(),
  },
];

export const mockBranches: Branch[] = [
  {
    id: "branch-1",
    name: "Downtown Pet Hospital",
    address: "123 Main Street",
    city: "Springfield",
    state: "IL",
    zipCode: "62701",
    phone: "(555) 123-0001",
    email: "downtown@petcarepro.com",
    managerId: "user-admin",
    services: ["checkup", "vaccination", "surgery"],
    workingHours: {
      monday: { start: "08:00", end: "18:00" },
      tuesday: { start: "08:00", end: "18:00" },
      wednesday: { start: "08:00", end: "18:00" },
      thursday: { start: "08:00", end: "18:00" },
      friday: { start: "08:00", end: "18:00" },
      saturday: { start: "09:00", end: "14:00" },
      sunday: { start: "", end: "" },
    },
    createdAt: new Date().toISOString(),
  },
  {
    id: "branch-2",
    name: "North Side Veterinary Clinic",
    address: "456 North Avenue",
    city: "Springfield",
    state: "IL",
    zipCode: "62702",
    phone: "(555) 123-0002",
    email: "northside@petcarepro.com",
    managerId: "user-admin",
    services: ["checkup", "vaccination", "grooming"],
    workingHours: {
      monday: { start: "08:00", end: "17:00" },
      tuesday: { start: "08:00", end: "17:00" },
      wednesday: { start: "08:00", end: "17:00" },
      thursday: { start: "08:00", end: "17:00" },
      friday: { start: "08:00", end: "17:00" },
      saturday: { start: "", end: "" },
      sunday: { start: "", end: "" },
    },
    createdAt: new Date().toISOString(),
  },
];

export const mockPets: Pet[] = [
  {
    id: "pet-1",
    customerId: "customer-1",
    name: "Max",
    type: "dog",
    breed: "Golden Retriever",
    age: 3,
    weight: 65,
    color: "Golden",
    medicalHistory: [],
    vaccinations: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "pet-2",
    customerId: "customer-1",
    name: "Bella",
    type: "cat",
    breed: "Persian",
    age: 2,
    weight: 8,
    color: "White",
    medicalHistory: [],
    vaccinations: [],
    createdAt: new Date().toISOString(),
  },
  {
    id: "pet-3",
    customerId: "customer-2",
    name: "Charlie",
    type: "dog",
    breed: "Labrador",
    age: 5,
    weight: 70,
    color: "Black",
    medicalHistory: [],
    vaccinations: [],
    createdAt: new Date().toISOString(),
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "apt-1",
    petId: "pet-1",
    customerId: "customer-1",
    branchId: "branch-1",
    appointmentDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    appointmentTime: "10:00 AM",
    serviceType: "checkup",
    veterinarianId: "user-vet-1",
    reasonForVisit: "Regular check-up",
    status: "confirmed",
    createdAt: new Date().toISOString(),
  },
];

export const mockMedications: Medication[] = [
  {
    id: "med-1",
    name: "Amoxicillin",
    description: "Antibiotic for bacterial infections",
    strength: "250mg",
    unit: "tablet",
    manufacturer: "Generic Pharma",
    batchNumber: "BATCH001",
    expiryDate: new Date(Date.now() + 31536000000).toISOString().split("T")[0],
    quantity: 100,
    reorderLevel: 20,
    price: 0.50,
    branchId: "branch-1",
  },
  {
    id: "med-2",
    name: "Carprofen",
    description: "Pain relief and anti-inflammatory",
    strength: "100mg",
    unit: "tablet",
    manufacturer: "Generic Pharma",
    batchNumber: "BATCH002",
    expiryDate: new Date(Date.now() + 31536000000).toISOString().split("T")[0],
    quantity: 50,
    reorderLevel: 15,
    price: 1.25,
    branchId: "branch-1",
  },
  {
    id: "med-3",
    name: "Doxycycline",
    description: "Antibiotic for infections",
    strength: "100mg",
    unit: "tablet",
    manufacturer: "Generic Pharma",
    batchNumber: "BATCH003",
    expiryDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
    quantity: 5,
    reorderLevel: 10,
    price: 0.75,
    branchId: "branch-1",
  },
];

export const mockServices: Service[] = [
  {
    id: "svc-1",
    name: "General Health Check-up",
    description: "Comprehensive physical examination",
    category: "checkup",
    price: 75,
    duration: 30,
    branchId: "branch-1",
    availableVeterinarians: ["user-vet-1", "user-vet-2"],
    rating: 4.8,
    reviews: [],
  },
  {
    id: "svc-2",
    name: "Vaccination",
    description: "Core and non-core vaccinations",
    category: "vaccination",
    price: 50,
    duration: 20,
    branchId: "branch-1",
    availableVeterinarians: ["user-vet-1"],
    rating: 4.9,
    reviews: [],
  },
  {
    id: "svc-3",
    name: "Surgical Procedure",
    description: "General and orthopedic surgery",
    category: "surgery",
    price: 500,
    duration: 120,
    branchId: "branch-1",
    availableVeterinarians: ["user-vet-2"],
    rating: 4.7,
    reviews: [],
  },
];

export const mockPetItems: PetItem[] = [
  {
    id: "item-1",
    productCode: "FOOD001",
    name: "Premium Dog Food",
    description: "High-quality dog kibble with chicken and vegetables",
    category: "food",
    price: 450000,
    stock: 50,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-2",
    productCode: "TOY001",
    name: "Interactive Dog Toy",
    description: "Durable rubber fetch toy for active dogs",
    category: "toy",
    price: 199000,
    stock: 30,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-3",
    productCode: "ACC001",
    name: "Pet Collar with ID",
    description: "Adjustable collar with personalized ID tag",
    category: "accessory",
    price: 249000,
    stock: 40,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-4",
    productCode: "FOOD002",
    name: "Cat Dry Food",
    description: "Nutritious dry food for adult cats",
    category: "food",
    price: 320000,
    stock: 45,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-5",
    productCode: "FOOD003",
    name: "Puppy Wet Food",
    description: "Soft and easy-to-digest food for puppies",
    category: "food",
    price: 380000,
    stock: 25,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-6",
    productCode: "TOY002",
    name: "Feather Cat Toy",
    description: "Interactive feather toy for cats",
    category: "toy",
    price: 89000,
    stock: 60,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-7",
    productCode: "TOY003",
    name: "Squeaky Ball Set",
    description: "Set of 3 colorful squeaky balls",
    category: "toy",
    price: 159000,
    stock: 35,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-8",
    productCode: "ACC002",
    name: "Dog Leash",
    description: "Strong nylon leash with comfortable grip",
    category: "accessory",
    price: 189000,
    stock: 55,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-9",
    productCode: "ACC003",
    name: "Pet Bed",
    description: "Comfortable orthopedic pet bed",
    category: "accessory",
    price: 899000,
    stock: 15,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-10",
    productCode: "MED001",
    name: "Pet Vitamins",
    description: "Multivitamin supplement for pets",
    category: "medication",
    price: 279000,
    stock: 40,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-11",
    productCode: "MED002",
    name: "Omega-3 Supplement",
    description: "Fish oil supplement for healthy coat",
    category: "medication",
    price: 349000,
    stock: 30,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-12",
    productCode: "TOY004",
    name: "Chew Stick Toy",
    description: "Long-lasting chew toy for dogs",
    category: "toy",
    price: 129000,
    stock: 50,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-13",
    productCode: "ACC004",
    name: "Pet Brush",
    description: "Grooming brush for dogs and cats",
    category: "accessory",
    price: 149000,
    stock: 70,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-14",
    productCode: "FOOD004",
    name: "Senior Dog Food",
    description: "Specially formulated for senior dogs",
    category: "food",
    price: 520000,
    stock: 20,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
  {
    id: "item-15",
    productCode: "TOY005",
    name: "Kong Rubber Toy",
    description: "Durable rubber toy with treat pocket",
    category: "toy",
    price: 249000,
    stock: 25,
    branchId: "branch-1",
    createdAt: new Date().toISOString(),
  },
];

export const mockInvoices: Invoice[] = [
  {
    id: "inv-1",
    appointmentId: "apt-1",
    customerId: "customer-1",
    branchId: "branch-1",
    items: [
      {
        id: "item-1",
        description: "General Health Check-up",
        quantity: 1,
        unitPrice: 75,
        total: 75,
      },
    ],
    subtotal: 75,
    tax: 7.5,
    total: 82.5,
    status: "pending",
    dueDate: new Date(Date.now() + 604800000).toISOString().split("T")[0],
    createdAt: new Date().toISOString(),
  },
];

export const mockOrders: Order[] = [
  {
    id: "order-1",
    customerId: "customer-1",
    items: [
      {
        id: "oi-1",
        itemId: "item-1",
        itemName: "Premium Dog Food",
        quantity: 2,
        unitPrice: 450000,
        total: 900000,
      },
      {
        id: "oi-2",
        itemId: "item-3",
        itemName: "Pet Collar with ID",
        quantity: 1,
        unitPrice: 249000,
        total: 249000,
      },
    ],
    subtotal: 1149000,
    tax: 114900,
    loyaltyPointsApplied: 0,
    loyaltyDiscount: 0,
    total: 1263900,
    status: "delivered",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "order-2",
    customerId: "customer-1",
    items: [
      {
        id: "oi-3",
        itemId: "item-4",
        itemName: "Cat Dry Food",
        quantity: 3,
        unitPrice: 320000,
        total: 960000,
      },
    ],
    subtotal: 960000,
    tax: 96000,
    loyaltyPointsApplied: 0,
    loyaltyDiscount: 0,
    total: 1056000,
    status: "delivered",
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "order-3",
    customerId: "customer-1",
    items: [
      {
        id: "oi-4",
        itemId: "item-10",
        itemName: "Pet Vitamins",
        quantity: 2,
        unitPrice: 279000,
        total: 558000,
      },
      {
        id: "oi-5",
        itemId: "item-6",
        itemName: "Feather Cat Toy",
        quantity: 1,
        unitPrice: 89000,
        total: 89000,
      },
    ],
    subtotal: 647000,
    tax: 64700,
    loyaltyPointsApplied: 0,
    loyaltyDiscount: 0,
    total: 711700,
    status: "delivered",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "order-4",
    customerId: "customer-2",
    items: [
      {
        id: "oi-6",
        itemId: "item-9",
        itemName: "Pet Bed",
        quantity: 1,
        unitPrice: 899000,
        total: 899000,
      },
    ],
    subtotal: 899000,
    tax: 89900,
    loyaltyPointsApplied: 0,
    loyaltyDiscount: 0,
    total: 988900,
    status: "delivered",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    deliveryDate: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export const mockLoyaltyAccounts: LoyaltyAccount[] = [
  {
    id: "loyalty-1",
    customerId: "customer-1",
    points: 52,
    tier: "silver",
    totalSpent: 3031600,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "loyalty-2",
    customerId: "customer-2",
    points: 18,
    tier: "bronze",
    totalSpent: 988900,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function initializeMockData() {
  const existingUsers = localStorage.getItem("petcare_users");
  if (!existingUsers) {
    localStorage.setItem("petcare_users", JSON.stringify(mockUsers));
  }

  const existingBranches = localStorage.getItem("petcare_branches");
  if (!existingBranches) {
    localStorage.setItem("petcare_branches", JSON.stringify(mockBranches));
  }

  const existingPets = localStorage.getItem("petcare_pets");
  if (!existingPets) {
    localStorage.setItem("petcare_pets", JSON.stringify(mockPets));
  }

  const existingAppointments = localStorage.getItem("petcare_appointments");
  if (!existingAppointments) {
    localStorage.setItem("petcare_appointments", JSON.stringify(mockAppointments));
  }

  const existingMedications = localStorage.getItem("petcare_medications");
  if (!existingMedications) {
    localStorage.setItem("petcare_medications", JSON.stringify(mockMedications));
  }

  const existingServices = localStorage.getItem("petcare_services");
  if (!existingServices) {
    localStorage.setItem("petcare_services", JSON.stringify(mockServices));
  }

  const existingPetItems = localStorage.getItem("petcare_pet_items");
  if (!existingPetItems) {
    localStorage.setItem("petcare_pet_items", JSON.stringify(mockPetItems));
  }

  const existingInvoices = localStorage.getItem("petcare_invoices");
  if (!existingInvoices) {
    localStorage.setItem("petcare_invoices", JSON.stringify(mockInvoices));
  }

  const existingOrders = localStorage.getItem("petcare_orders");
  if (!existingOrders) {
    localStorage.setItem("petcare_orders", JSON.stringify(mockOrders));
  }

  const existingLoyalty = localStorage.getItem("petcare_loyalty");
  if (!existingLoyalty) {
    localStorage.setItem("petcare_loyalty", JSON.stringify(mockLoyaltyAccounts));
  }
}
