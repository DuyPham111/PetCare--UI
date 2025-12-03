import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/hooks/useCart";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { getTotalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsUserMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 font-bold text-xl text-primary">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-white font-bold">
              🐾
            </div>
            <span className="hidden sm:inline">PetCare Pro</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Home
              </Button>
            </Link>
            <Link to="/shop">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Shop
              </Button>
            </Link>
            {user && user.role === "customer" && (
              <Link to="/customer/booking">
                <Button variant="ghost" className="text-foreground hover:text-primary">
                  Service Booking
                </Button>
              </Link>
            )}
            <Link to="/appointments">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Appointments
              </Button>
            </Link>
            <Link to="/vaccinations">
              <Button variant="ghost" className="text-foreground hover:text-primary">
                Vaccinations
              </Button>
            </Link>
          </nav>

          {/* Right Section */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {/* Cart Icon */}
                {user.role === "customer" && (
                  <Link to="/cart">
                    <Button variant="ghost" size="sm" className="relative text-foreground hover:text-primary">
                      <ShoppingCart className="w-5 h-5" />
                      {getTotalItems() > 0 && (
                        <span className="absolute -top-2 -right-2 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {getTotalItems()}
                        </span>
                      )}
                    </Button>
                  </Link>
                )}

                {/* User Menu */}
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
                  >
                    <User className="w-5 h-5 text-foreground" />
                    <span className="text-sm font-medium text-foreground hidden sm:inline">
                      {user.fullName.split(" ")[0]}
                    </span>
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg border border-border shadow-lg py-2 z-50">
                      {user.role === "customer" && (
                        <>
                          <Link to="/dashboard" onClick={() => setIsUserMenuOpen(false)}>
                            <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-100 flex items-center gap-2">
                              <LayoutDashboard className="w-4 h-4" />
                              Dashboard
                            </button>
                          </Link>
                          <Link to="/profile" onClick={() => setIsUserMenuOpen(false)}>
                            <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-100 flex items-center gap-2">
                              <User className="w-4 h-4" />
                              My Profile
                            </button>
                          </Link>
                          <Link to="/orders" onClick={() => setIsUserMenuOpen(false)}>
                            <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-100 flex items-center gap-2">
                              <ShoppingCart className="w-4 h-4" />
                              My Orders
                            </button>
                          </Link>
                          <Link to="/customer/services" onClick={() => setIsUserMenuOpen(false)}>
                            <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-100 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                              </svg>
                              My Services
                            </button>
                          </Link>
                          <Link to="/customer/appointments" onClick={() => setIsUserMenuOpen(false)}>
                            <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-100 flex items-center gap-2">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              My Appointments
                            </button>
                          </Link>
                        </>
                      )}
                      {user.role !== "customer" && (
                        <Link to={user.role === 'admin' ? '/admin/dashboard' : user.role === 'veterinarian' ? '/vet/dashboard' : user.role === 'receptionist' ? '/receptionist/dashboard' : user.role === 'sales' ? '/sales/dashboard' : '/admin/dashboard'} onClick={() => setIsUserMenuOpen(false)}>
                          <button className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-gray-100 flex items-center gap-2">
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                          </button>
                        </Link>
                      )}
                      <div className="border-t border-border my-1" />
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="ghost" className="text-foreground hover:text-primary">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="outline" className="text-foreground hover:text-primary">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/appointments">
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Schedule Now
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-foreground" />
            ) : (
              <Menu className="w-6 h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden border-t border-border py-4 space-y-2">
            <Link to="/" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-foreground">
                Home
              </Button>
            </Link>

            <Link to="/shop" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-foreground">
                Shop
              </Button>
            </Link>

            {user && user.role === "customer" && (
              <>
                <Link to="/customer/booking" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-foreground">
                    Service Booking
                  </Button>
                </Link>
                <Link to="/customer/appointments" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-foreground">
                    My Appointments
                  </Button>
                </Link>
                <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-foreground">
                    Dashboard
                  </Button>
                </Link>
                <Link to="/cart" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-foreground flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Cart {getTotalItems() > 0 && `(${getTotalItems()})`}
                  </Button>
                </Link>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-foreground">
                    My Profile
                  </Button>
                </Link>
              </>
            )}

            <Link to="/appointments" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-foreground">
                Appointments
              </Button>
            </Link>
            <Link to="/vaccinations" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" className="w-full justify-start text-foreground">
                Vaccinations
              </Button>
            </Link>

            {!user ? (
              <>
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-foreground">
                    Login
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-foreground">
                    Sign Up
                  </Button>
                </Link>
                <Link to="/appointments" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                    Schedule Now
                  </Button>
                </Link>
              </>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2 rounded"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
