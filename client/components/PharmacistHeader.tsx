import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Menu, X, Box, FileText, AlertTriangle, LogOut } from "lucide-react";
import { useState } from "react";

export default function PharmacistHeader() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const isActive = (path: string) => location.pathname === path;

    const navItems = [
        { label: "Inventory", path: "/pharmacist/dashboard" },
        { label: "Prescriptions", path: "/pharmacist/prescriptions" },
        { label: "Low Stock", path: "/pharmacist/low-stock" },
        { label: "Import/Export", path: "/pharmacist/import-export" },
        { label: "My Profile", path: "/pharmacist/profile" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-border">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <Link to="/pharmacist/dashboard" className="flex items-center gap-2 font-bold text-xl text-primary">
                        <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-700 rounded-lg flex items-center justify-center text-white font-bold">
                            💊
                        </div>
                        <span className="hidden sm:inline">Pharmacy</span>
                    </Link>

                    <nav className="hidden lg:flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link key={item.path} to={item.path}>
                                <Button variant={isActive(item.path) ? "default" : "ghost"} className={`text-sm ${isActive(item.path) ? "bg-primary text-white" : "text-foreground hover:text-primary"}`}>
                                    {item.label}
                                </Button>
                            </Link>
                        ))}
                    </nav>

                    <div className="flex items-center gap-4">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-foreground">{user?.fullName}</p>
                            <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
                        </div>

                        <Button onClick={handleLogout} variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                            <LogOut className="w-4 h-4" />
                        </Button>

                        <button className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
                            {isMenuOpen ? <X className="w-6 h-6 text-foreground" /> : <Menu className="w-6 h-6 text-foreground" />}
                        </button>
                    </div>
                </div>

                {isMenuOpen && (
                    <nav className="lg:hidden border-t border-border py-4 space-y-2">
                        {navItems.map((item) => (
                            <Link key={item.path} to={item.path} onClick={() => setIsMenuOpen(false)}>
                                <Button variant={isActive(item.path) ? "default" : "ghost"} className={`w-full justify-start ${isActive(item.path) ? "bg-primary text-white" : "text-foreground hover:text-primary"}`}>
                                    {item.label}
                                </Button>
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </header>
    );
}
