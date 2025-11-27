import AdminHeader from "@/components/AdminHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  useAppointments,
  usePets,
  useUsers,
  useBranches,
} from "@/hooks/useHospitalData";
import { Calendar, Clock, User, AlertCircle, CheckCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import { Navigate } from "react-router-dom";

export default function AppointmentsPage() {
  const { user } = useAuth();
  const { appointments, updateAppointment, assignVeterinarian } = useAppointments();
  const { getPet } = usePets();
  const { getUser } = useUsers();
  const { getBranch, branches } = useBranches();
  const [selectedBranch, setSelectedBranch] = useState("all");

  if (!user) {
    return <Navigate to="/login" />;
  }

  const filteredAppointments =
    selectedBranch === "all"
      ? appointments
      : appointments.filter((a) => a.branchId === selectedBranch);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: "bg-yellow-100 text-yellow-700",
      confirmed: "bg-green-100 text-green-700",
      completed: "bg-blue-100 text-blue-700",
      cancelled: "bg-red-100 text-red-700",
    };
    return styles[status] || styles.pending;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />

      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">Appointments</h1>
            <p className="text-muted-foreground">Manage and assign veterinarians to appointments</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6 border border-border">
          <div className="flex flex-wrap gap-4 items-center">
            <div>
              <label className="text-sm font-medium text-foreground block mb-2">
                Filter by Branch
              </label>
              <select
                value={selectedBranch}
                onChange={(e) => setSelectedBranch(e.target.value)}
                className="px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="all">All Branches</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        {/* Appointments List */}
        <div className="space-y-4">
          {filteredAppointments.length === 0 ? (
            <Card className="p-12 text-center border border-border">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Appointments</h3>
              <p className="text-muted-foreground">
                No appointments found for the selected filters.
              </p>
            </Card>
          ) : (
            filteredAppointments.map((apt) => {
              const pet = getPet(apt.petId);
              const vet = apt.veterinarianId ? getUser(apt.veterinarianId) : null;
              const branch = getBranch(apt.branchId);

              return (
                <Card key={apt.id} className="p-6 border border-border hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">
                            {pet?.name} - {pet?.type}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {apt.reasonForVisit}
                          </p>

                          <div className="flex flex-wrap gap-4 mt-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>{new Date(apt.appointmentDate).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-muted-foreground" />
                              <span>{apt.appointmentTime}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <User className="w-4 h-4 text-muted-foreground" />
                              <span>{branch?.name}</span>
                            </div>
                          </div>

                          {vet && (
                            <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                              <p className="text-blue-900">
                                <strong>Assigned to:</strong> {vet.fullName}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-max">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusBadge(apt.status)}`}
                      >
                        {apt.status}
                      </span>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const newStatus =
                            apt.status === "pending"
                              ? "confirmed"
                              : apt.status === "confirmed"
                                ? "completed"
                                : "pending";
                          updateAppointment(apt.id, { status: newStatus });
                        }}
                        className="text-xs"
                      >
                        Update Status
                      </Button>

                      {!apt.veterinarianId && (
                        <Button
                          size="sm"
                          className="bg-primary hover:bg-primary/90 text-white text-xs"
                          onClick={() => {
                            const vetId = "user-vet-1";
                            assignVeterinarian(apt.id, vetId);
                          }}
                        >
                          Assign Vet
                        </Button>
                      )}
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
