import { useState, useEffect } from "react";
import Header from "@/components/Header";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { PetItem } from "@shared/types";
import { Search, Filter } from "lucide-react";

export default function ProductStore() {
  const [products, setProducts] = useState<PetItem[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<PetItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  const categories = ["all", "food", "toy", "accessory", "medication"];

  useEffect(() => {
    const allProducts = JSON.parse(localStorage.getItem("petcare_pet_items") || "[]");
    setProducts(allProducts);
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm]);

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const categoryEmoji = {
    food: "🍖",
    toy: "🎾",
    accessory: "🛍️",
    medication: "💊",
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">Pet Shop</h1>
            <p className="text-lg text-muted-foreground">
              Browse our selection of quality pet products, food, toys, and accessories
            </p>
          </div>

          {/* Search & Filters */}
          <div className="mb-8 space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by product name or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 pr-4 py-2 w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border border-input rounded-lg hover:bg-primary/5 transition"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>

              {showFilters && (
                <div className="flex gap-2 flex-wrap items-center">
                  {categories.map((category) => (
                    <Button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      variant={selectedCategory === category ? "default" : "outline"}
                      className="capitalize"
                    >
                      {category === "all"
                        ? "All Products"
                        : `${categoryEmoji[category as keyof typeof categoryEmoji] || ""} ${getCategoryLabel(category)}`}
                    </Button>
                  ))}
                </div>
              )}
            </div>

            {/* Results Count */}
            <p className="text-sm text-muted-foreground">
              Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
              {selectedCategory !== "all" && ` in ${getCategoryLabel(selectedCategory)}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </p>
          </div>

          {/* Products Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center border border-border">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Products Found</h3>
              <p className="text-muted-foreground mb-6">
                {searchTerm
                  ? `We couldn't find any products matching "${searchTerm}"`
                  : "No products available in this category"}
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("all");
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            </Card>
          )}

          {/* Info Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <Card className="p-6 border border-border bg-blue-50">
              <h3 className="text-lg font-bold text-foreground mb-3">📦 Free Shipping</h3>
              <p className="text-muted-foreground text-sm">
                On orders over 2,000,000 VND. We deliver to your doorstep safely.
              </p>
            </Card>

            <Card className="p-6 border border-border bg-green-50">
              <h3 className="text-lg font-bold text-foreground mb-3">✓ Quality Guaranteed</h3>
              <p className="text-muted-foreground text-sm">
                All products are carefully selected to ensure the best quality for your pets.
              </p>
            </Card>

            <Card className="p-6 border border-border bg-purple-50">
              <h3 className="text-lg font-bold text-foreground mb-3">🎁 Loyalty Rewards</h3>
              <p className="text-muted-foreground text-sm">
                Earn points on every purchase. Get discounts based on your loyalty tier.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
