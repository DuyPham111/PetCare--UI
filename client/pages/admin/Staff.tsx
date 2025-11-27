import AdminHeader from "@/components/AdminHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useUsers, useBranches } from "@/hooks/useHospitalData";
import { Plus, Trash2, Edit, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { UserRole } from "@shared/types";

export default function StaffPage() {
  const { user } = useAuth();
  const { users, createUser, updateUser, deleteUser } = useUsers();
  const { branches } = useBranches();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "staff123",
    role: "receptionist" as UserRole,
    branchId: user?.branchId || "",
    specialization: "",
    licenseNumber: "",
    phone: "",
  });

  if (!user) {
    return <Navigate to="/login" />;
  }

  const staffMembers = users.filter((u) => u.role !== "customer");

  const handleAddStaff = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      alert("Name and email are required");
      return;
    }
    createUser({
      ...formData,
      password: formData.password,
    } as any);
    setFormData({
      fullName: "",
      email: "",
      password: "staff123",
      role: "receptionist",
      branchId: user.branchId || "",
      specialization: "",
      licenseNumber: "",
      phone: "",
    });
    setShowForm(false);
  };

  const getRoleColor = (role: string) => {
    const colors: Record<string, string> = {
      admin: "bg-purple-100 text-purple-700",
      veterinarian: "bg-blue-100 text-blue-700",
      receptionist: "bg-green-100 text-green-700",
      pharmacist: "bg-orange-100 text-orange-700",
    };
    return colors[role] || colors.receptionist;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Staff Management</h1>
            <p className="text-muted-foreground">Manage team members and their roles</p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Staff
          </Button>
        </div>

        {/* Add Staff Form */}
        {showForm && (
          <Card className="p-6 mb-8 border border-border bg-primary/5">
            <h2 className="text-2xl font-bold text-foreground mb-6">Add New Staff Member</h2>
            <form onSubmit={handleAddStaff} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="receptionist">Receptionist</option>
                    <option value="veterinarian">Veterinarian</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Branch</label>
                  <select
                    value={formData.branchId}
                    onChange={(e) => setFormData({ ...formData, branchId: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Select Branch</option>
                    {branches.map((branch) => (
                      <option key={branch.id} value={branch.id}>
                        {branch.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground block mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                {formData.role === "veterinarian" && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        Specialization
                      </label>
                      <input
                        type="text"
                        value={formData.specialization}
                        onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground block mb-2">
                        License Number
                      </label>
                      <input
                        type="text"
                        value={formData.licenseNumber}
                        onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                        className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="flex gap-4">
                <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                  Add Staff Member
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Staff List */}
        <div className="space-y-4">
          {staffMembers.length === 0 ? (
            <Card className="p-12 text-center border border-border">
              <p className="text-muted-foreground">No staff members yet</p>
            </Card>
          ) : (
            staffMembers.map((member) => {
              const branch = member.branchId ? branches.find((b) => b.id === member.branchId) : null;
              return (
                <Card key={member.id} className="p-6 border border-border hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-xl">
                          {member.role === "veterinarian" ? "👨‍⚕️" : member.role === "pharmacist" ? "💊" : "👤"}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-foreground">{member.fullName}</h3>
                          <div className="flex items-center gap-4 mt-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getRoleColor(member.role)}`}>
                              {member.role}
                            </span>
                            {branch && (
                              <span className="text-sm text-muted-foreground">📍 {branch.name}</span>
                            )}
                          </div>
                          <div className="flex gap-6 mt-3 text-sm text-muted-foreground">
                            {member.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                {member.email}
                              </div>
                            )}
                            {member.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4" />
                                {member.phone}
                              </div>
                            )}
                          </div>
                          {member.role === "veterinarian" && member.specialization && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                              Specialization: {member.specialization}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => alert("Edit functionality would go here")}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive hover:text-destructive"
                        onClick={() => {
                          if (confirm(`Delete ${member.fullName}?`)) {
                            deleteUser(member.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
