import Header from "@/components/Header";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getMembershipDisplay, DEFAULT_MEMBERSHIP_LEVEL } from "@/lib/membershipUtils";
import { Star } from "lucide-react";

export default function CustomerProfileEdit() {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();

    if (!user || user.role !== "customer") return <Navigate to="/login" />;

    const [formData, setFormData] = useState({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone || "(555) 123-4567",
        gender: "Male",
        dateOfBirth: "1990-03-15",
        address: "123 Pet Street, Animal City",
    });

    const handleChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
    };

    const handleSave = () => {
        // Update user data (in real app, this would update database)
        const updatedUser = {
            ...user,
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
        };

        // Update localStorage directly
        localStorage.setItem("petcare_user", JSON.stringify(updatedUser));

        // Update auth context by re-logging in
        login(updatedUser.email, user.password || "customer123");

        toast({
            title: "Profile Updated",
            description: "Your profile has been updated successfully.",
        });

        navigate("/profile");
    };

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <main className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="mb-6">
                    <h1 className="text-3xl font-bold mb-2">Edit Profile</h1>
                    <p className="text-muted-foreground">Update your profile information</p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Make changes to your profile details</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="fullName">Full Name</Label>
                                <Input
                                    id="fullName"
                                    value={formData.fullName}
                                    onChange={(e) => handleChange("fullName", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => handleChange("email", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => handleChange("phone", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="gender">Gender</Label>
                                <Input
                                    id="gender"
                                    value={formData.gender}
                                    onChange={(e) => handleChange("gender", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                                <Input
                                    id="dateOfBirth"
                                    type="date"
                                    value={formData.dateOfBirth}
                                    onChange={(e) => handleChange("dateOfBirth", e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="address">Address</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => handleChange("address", e.target.value)}
                                />
                            </div>

                            {/* Read-only Membership Display */}
                            <div className="bg-muted/50 rounded-lg p-4 border border-border">
                                <div className="flex items-center gap-3">
                                    <Star className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                        <Label className="text-sm text-muted-foreground">Membership Level (Read-only)</Label>
                                        <p className="font-medium text-lg mt-1">
                                            {getMembershipDisplay(user.membershipLevel || DEFAULT_MEMBERSHIP_LEVEL)}
                                        </p>
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Membership is automatically upgraded based on your yearly spending
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 pt-4">
                                <Button onClick={handleSave}>Save Changes</Button>
                                <Button variant="outline" onClick={() => navigate("/profile")}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
