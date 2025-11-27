import VetHeader from "@/components/VetHeader";
import { Card } from "@/components/ui/card";
import AssignedPetsList from "@/components/vet/AssignedPetsList";
import { sampleAssignedPets } from "@/data/sampleVetData";
import { /* Table, TableHeader, TableRow, TableHead, TableBody, TableCell */ } from "@/components/ui/table";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";

const samplePets = [
    { id: 'pet-100', name: 'Bella', species: 'Dog', owner: 'John Doe', lastVisit: '2025-10-15' },
    { id: 'pet-101', name: 'Max', species: 'Cat', owner: 'Mary Smith', lastVisit: '2025-09-07' },
];

export default function AssignedPets() {
    const { user } = useAuth();
    if (!user || user.role !== 'veterinarian') return <Navigate to="/login" />;

    return (
        <div className="min-h-screen bg-gray-50">
            <VetHeader />
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold">Assigned Pets</h1>
                    <p className="text-muted-foreground">Pets assigned to you for ongoing care</p>
                </div>

                <Card className="p-6 border border-border">
                    <AssignedPetsList pets={sampleAssignedPets} />
                </Card>
            </div>
        </div>
    );
}
