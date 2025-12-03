import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/Header";
import { Calendar, Syringe, Heart, Clock, Users, Award, ShoppingBag, Stethoscope } from "lucide-react";

export default function Index() {
  const services = [
    {
      icon: Calendar,
      title: "Health Check-ups",
      description: "Regular veterinary examinations to keep your pets in perfect health",
      color: "text-blue-600",
      link: "/appointments"
    },
    {
      icon: Syringe,
      title: "Vaccinations",
      description: "Essential vaccines to protect your pets from diseases",
      color: "text-green-600",
      link: "/vaccinations"
    },
    {
      icon: Stethoscope,
      title: "Medical Treatment",
      description: "Expert care and treatment for all your pet's medical needs",
      color: "text-purple-600",
      link: "/appointments"
    },
    {
      icon: ShoppingBag,
      title: "Pet Products",
      description: "Quality food, toys, and supplies for your beloved companions",
      color: "text-orange-600",
      link: "/shop"
    }
  ];

  const features = [
    {
      icon: Clock,
      title: "24/7 Emergency Care",
      description: "Round-the-clock emergency services for urgent pet care needs"
    },
    {
      icon: Users,
      title: "Expert Veterinarians",
      description: "Experienced and caring professionals dedicated to pet health"
    },
    {
      icon: Award,
      title: "Quality Service",
      description: "Award-winning care with 98% customer satisfaction rating"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section - Sales Style */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to PetCare Pro
            </h1>
            <p className="text-xl text-blue-100 mb-8">
              Your trusted partner in pet healthcare. Expert veterinary care with
              compassion and dedication for your beloved companions.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <button className="px-6 py-3 bg-white text-blue-600 font-medium rounded-md hover:bg-blue-50 transition">
                  Get Started
                </button>
              </Link>
              <Link to="/shop">
                <button className="px-6 py-3 border border-white text-white rounded-md hover:bg-white/10 transition">
                  Browse Products
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2">500+</div>
              <div className="text-muted-foreground">Happy Pets Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">98%</div>
              <div className="text-muted-foreground">Customer Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Emergency Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Sales Style Cards */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Our Services</h2>
            <p className="text-muted-foreground text-lg">
              Comprehensive pet healthcare solutions for your beloved companions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{service.title}</CardTitle>
                    <Icon className={`h-5 w-5 ${service.color}`} />
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">
                      {service.description}
                    </p>
                    <Link to={service.link}>
                      <Button variant="outline" size="sm" className="w-full">
                        Learn More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/appointments" className="block">
              <button className="w-full bg-primary text-white px-4 py-3 rounded-md hover:bg-primary/90 transition">
                Schedule Appointment
              </button>
            </Link>
            <Link to="/shop" className="block">
              <button className="w-full border border-border px-4 py-3 rounded-md hover:bg-accent transition">
                Shop Products
              </button>
            </Link>
            <Link to="/vaccinations" className="block">
              <button className="w-full border border-border px-4 py-3 rounded-md hover:bg-accent transition">
                View Vaccinations
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-secondary/5">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">Why Choose Us</h2>
            <p className="text-muted-foreground text-lg">
              We're committed to providing the best care for your pets
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <Icon className="h-10 w-10 text-primary mb-3" />
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Give Your Pet the Best Care?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of happy pet owners who trust us with their companions' health
          </p>
          <Link to="/register">
            <button className="px-8 py-4 bg-white text-primary font-medium rounded-md hover:bg-gray-100 transition text-lg">
              Get Started Today
            </button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>&copy; 2024 PetCare Pro. All rights reserved.</p>
          <p className="mt-2 text-sm">Your trusted partner in pet healthcare</p>
        </div>
      </footer>
    </div>
  );
}
