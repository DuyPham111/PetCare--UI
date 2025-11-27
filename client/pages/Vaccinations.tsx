import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Syringe, AlertCircle, CheckCircle, Plus, Trash2 } from "lucide-react";

interface Vaccination {
  id: string;
  petName: string;
  vaccineName: string;
  administeredDate: string;
  nextBoosterDate: string;
  veterinarian: string;
  status: "completed" | "upcoming" | "overdue";
}

export default function Vaccinations() {
  const [vaccinations, setVaccinations] = useState<Vaccination[]>([
    {
      id: "1",
      petName: "Max",
      vaccineName: "Rabies",
      administeredDate: "2023-12-01",
      nextBoosterDate: "2025-12-01",
      veterinarian: "Dr. Smith",
      status: "completed",
    },
    {
      id: "2",
      petName: "Max",
      vaccineName: "DHPP",
      administeredDate: "2023-12-01",
      nextBoosterDate: "2024-12-01",
      veterinarian: "Dr. Smith",
      status: "upcoming",
    },
    {
      id: "3",
      petName: "Bella",
      vaccineName: "FVRCP",
      administeredDate: "2023-10-15",
      nextBoosterDate: "2024-01-15",
      veterinarian: "Dr. Johnson",
      status: "overdue",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    petName: "",
    vaccineName: "",
    administeredDate: "",
    nextBoosterDate: "",
    veterinarian: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddVaccination = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.petName || !formData.vaccineName || !formData.administeredDate) {
      alert("Please fill in all required fields");
      return;
    }

    const newVaccination: Vaccination = {
      id: Date.now().toString(),
      ...formData,
      status: "completed",
    };

    setVaccinations((prev) => [newVaccination, ...prev]);
    setFormData({
      petName: "",
      vaccineName: "",
      administeredDate: "",
      nextBoosterDate: "",
      veterinarian: "",
    });
    setShowForm(false);
  };

  const handleDeleteVaccination = (id: string) => {
    setVaccinations((prev) => prev.filter((v) => v.id !== id));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-50 border-green-200";
      case "upcoming":
        return "bg-blue-50 border-blue-200";
      case "overdue":
        return "bg-red-50 border-red-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
        );
      case "upcoming":
        return (
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
            <Syringe className="w-6 h-6 text-blue-600" />
          </div>
        );
      case "overdue":
        return (
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
        );
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return { text: "Completed", class: "text-green-700" };
      case "upcoming":
        return { text: "Upcoming", class: "text-blue-700" };
      case "overdue":
        return { text: "Overdue", class: "text-red-700" };
      default:
        return { text: "Unknown", class: "text-gray-700" };
    }
  };

  const upcomingCount = vaccinations.filter((v) => v.status === "upcoming").length;
  const overdueCount = vaccinations.filter((v) => v.status === "overdue").length;
  const completedCount = vaccinations.filter((v) => v.status === "completed").length;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-start justify-between mb-12 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Vaccination Records</h1>
              <p className="text-lg text-muted-foreground">
                Track and manage your pet's vaccination schedule
              </p>
            </div>
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-primary hover:bg-primary/90 text-white mt-2"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add Vaccination
            </Button>
          </div>

          {/* Stats */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            <Card className="p-6 border border-border bg-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Completed</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{completedCount}</p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-600 opacity-30" />
              </div>
            </Card>
            <Card className="p-6 border border-border bg-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Upcoming</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{upcomingCount}</p>
                </div>
                <Syringe className="w-12 h-12 text-blue-600 opacity-30" />
              </div>
            </Card>
            <Card className="p-6 border border-border bg-red-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-medium">Overdue</p>
                  <p className="text-3xl font-bold text-foreground mt-1">{overdueCount}</p>
                </div>
                <AlertCircle className="w-12 h-12 text-red-600 opacity-30" />
              </div>
            </Card>
          </div>

          {/* Add Vaccination Form */}
          {showForm && (
            <Card className="p-8 border border-border mb-12 bg-primary/5">
              <h2 className="text-2xl font-bold text-foreground mb-6">Add New Vaccination Record</h2>
              <form onSubmit={handleAddVaccination} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Pet Name *
                    </label>
                    <input
                      type="text"
                      name="petName"
                      value={formData.petName}
                      onChange={handleInputChange}
                      placeholder="e.g., Max, Bella"
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Vaccine Name *
                    </label>
                    <input
                      type="text"
                      name="vaccineName"
                      value={formData.vaccineName}
                      onChange={handleInputChange}
                      placeholder="e.g., Rabies, DHPP, FVRCP"
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Administered Date *
                    </label>
                    <input
                      type="date"
                      name="administeredDate"
                      value={formData.administeredDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Next Booster Date
                    </label>
                    <input
                      type="date"
                      name="nextBoosterDate"
                      value={formData.nextBoosterDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Veterinarian Name
                    </label>
                    <input
                      type="text"
                      name="veterinarian"
                      value={formData.veterinarian}
                      onChange={handleInputChange}
                      placeholder="e.g., Dr. Smith"
                      className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
                    Save Vaccination
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

          {/* Vaccinations List */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-6">All Vaccinations</h2>
            {vaccinations.length === 0 ? (
              <Card className="p-12 text-center border border-border">
                <Syringe className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Vaccinations Yet</h3>
                <p className="text-muted-foreground">
                  Add your pet's vaccination records to track them here.
                </p>
              </Card>
            ) : (
              <div className="space-y-4">
                {vaccinations.map((vac) => {
                  const statusInfo = getStatusText(vac.status);
                  return (
                    <Card
                      key={vac.id}
                      className={`p-6 border ${getStatusColor(vac.status)} transition-all hover:shadow-md`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4 flex-1">
                          {getStatusIcon(vac.status)}
                          <div className="flex-1">
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <h3 className="text-lg font-semibold text-foreground">
                                  {vac.vaccineName}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">{vac.petName}</p>
                              </div>
                              <span className={`text-xs font-bold uppercase px-3 py-1 rounded-full ${statusInfo.class}`}>
                                {statusInfo.text}
                              </span>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4 mt-4 text-sm">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 opacity-60 flex-shrink-0" />
                                <div>
                                  <p className="text-xs opacity-75">Administered</p>
                                  <p className="font-medium">
                                    {new Date(vac.administeredDate).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              {vac.nextBoosterDate && (
                                <div className="flex items-center gap-2">
                                  <Syringe className="w-4 h-4 opacity-60 flex-shrink-0" />
                                  <div>
                                    <p className="text-xs opacity-75">Next Booster</p>
                                    <p className="font-medium">
                                      {new Date(vac.nextBoosterDate).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              )}
                              <div className="text-sm">
                                <p className="text-xs opacity-75">Veterinarian</p>
                                <p className="font-medium">{vac.veterinarian || "—"}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleDeleteVaccination(vac.id)}
                          className="p-2 hover:bg-black/5 rounded-lg transition-colors text-muted-foreground hover:text-destructive flex-shrink-0"
                          aria-label="Delete vaccination"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-2 gap-8">
            <Card className="p-6 border border-border bg-blue-50">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Vaccination Tips
              </h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• Keep vaccination records organized and easily accessible</li>
                <li>• Follow recommended booster schedules by your veterinarian</li>
                <li>• Update records immediately after each visit</li>
                <li>• Schedule booster shots ahead of their expiration dates</li>
              </ul>
            </Card>

            <Card className="p-6 border border-border bg-green-50">
              <h3 className="text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Common Vaccines
              </h3>
              <ul className="space-y-2 text-sm text-foreground">
                <li>• <strong>Dogs:</strong> Rabies, DHPP (Distemper, Hepatitis, Parvo, Parainfluenza)</li>
                <li>• <strong>Cats:</strong> Rabies, FVRCP (Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia)</li>
                <li>• <strong>Rabbits:</strong> Myxoma, Viral Hemorrhagic Disease</li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
