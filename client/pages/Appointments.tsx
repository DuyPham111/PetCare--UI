import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Clock, User, Mail, Phone, AlertCircle, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

interface Appointment {
  id: string;
  petName: string;
  petType: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  date: string;
  time: string;
  reason: string;
  status: "pending" | "confirmed" | "completed";
}

export default function Appointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: "1",
      petName: "Max",
      petType: "Dog",
      ownerName: "John Doe",
      ownerEmail: "john@example.com",
      ownerPhone: "(555) 123-4567",
      date: "2024-02-15",
      time: "10:00 AM",
      reason: "Regular Check-up",
      status: "confirmed",
    },
  ]);

  const [formData, setFormData] = useState({
    petName: "",
    petType: "Dog",
    ownerName: "",
    ownerEmail: "",
    ownerPhone: "",
    date: "",
    time: "",
    reason: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.petName || !formData.ownerName || !formData.date || !formData.time) {
      alert("Please fill in all required fields");
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      ...formData,
      status: "pending",
    };

    setAppointments((prev) => [newAppointment, ...prev]);
    setFormData({
      petName: "",
      petType: "Dog",
      ownerName: "",
      ownerEmail: "",
      ownerPhone: "",
      date: "",
      time: "",
      reason: "",
    });
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-50 border-green-200 text-green-700";
      case "pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-700";
      case "completed":
        return "bg-blue-50 border-blue-200 text-blue-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">Schedule an Appointment</h1>
            <p className="text-lg text-muted-foreground">
              Book a check-up for your pet with our experienced veterinarians
            </p>
          </div>

          {/* Success Message */}
          {submitted && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900">Appointment Requested</h3>
                <p className="text-green-700 text-sm mt-1">
                  Your appointment request has been submitted. We'll confirm shortly.
                </p>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2">
              <Card className="p-8 border border-border">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Pet Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Pet Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Pet Name *
                        </label>
                        <input
                          type="text"
                          name="petName"
                          value={formData.petName}
                          onChange={handleInputChange}
                          placeholder="e.g., Max, Bella, Charlie"
                          className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Pet Type *
                        </label>
                        <select
                          name="petType"
                          value={formData.petType}
                          onChange={handleInputChange}
                          className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="Dog">Dog</option>
                          <option value="Cat">Cat</option>
                          <option value="Rabbit">Rabbit</option>
                          <option value="Bird">Bird</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Reason for Visit
                        </label>
                        <textarea
                          name="reason"
                          value={formData.reason}
                          onChange={handleInputChange}
                          placeholder="e.g., Regular check-up, vaccination, treatment"
                          rows={3}
                          className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Owner Information */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Your Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="ownerName"
                          value={formData.ownerName}
                          onChange={handleInputChange}
                          placeholder="Your full name"
                          className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          required
                        />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Email
                          </label>
                          <input
                            type="email"
                            name="ownerEmail"
                            value={formData.ownerEmail}
                            onChange={handleInputChange}
                            placeholder="your@email.com"
                            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Phone
                          </label>
                          <input
                            type="tel"
                            name="ownerPhone"
                            value={formData.ownerPhone}
                            onChange={handleInputChange}
                            placeholder="(555) 123-4567"
                            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-4">Appointment Details</h3>
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Preferred Date *
                          </label>
                          <input
                            type="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-foreground mb-2">
                            Preferred Time *
                          </label>
                          <input
                            type="time"
                            name="time"
                            value={formData.time}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-white">
                    Book Appointment
                  </Button>
                </form>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Info Card */}
              <Card className="p-6 border border-border bg-primary/5">
                <h3 className="font-semibold text-foreground mb-4">Hours of Operation</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Monday - Friday:</span>
                    <span className="font-medium">8:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-medium">9:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </Card>

              {/* Contact Card */}
              <Card className="p-6 border border-border">
                <h3 className="font-semibold text-foreground mb-4">Need Help?</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">(555) 123-4567</p>
                      <p className="text-muted-foreground">Call us anytime</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium text-foreground">support@petcarepro.com</p>
                      <p className="text-muted-foreground">Email us</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Appointments List */}
          {appointments.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-foreground mb-6">Your Appointments</h2>
              <div className="space-y-4">
                {appointments.map((apt) => (
                  <Card
                    key={apt.id}
                    className={`p-6 border ${getStatusColor(apt.status)}`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start gap-3">
                        {getStatusIcon(apt.status)}
                        <div>
                          <h3 className="font-semibold text-foreground capitalize">
                            {apt.petName} - {apt.petType}
                          </h3>
                          <p className="text-sm opacity-75">{apt.reason || "Check-up"}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold uppercase opacity-75">
                        {apt.status}
                      </span>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 opacity-60" />
                        <span>{new Date(apt.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 opacity-60" />
                        <span>{apt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 opacity-60" />
                        <span>{apt.ownerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 opacity-60" />
                        <span>{apt.ownerPhone}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
