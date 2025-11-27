import { PetItem } from "@shared/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShoppingCart, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/hooks/useCart";

interface ProductCardProps {
  product: PetItem;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isOutOfStock = product.stock === 0;
  const isLowStock = product.stock > 0 && product.stock <= 10;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "food":
        return "bg-orange-100 text-orange-700";
      case "toy":
        return "bg-purple-100 text-purple-700";
      case "accessory":
        return "bg-blue-100 text-blue-700";
      case "medication":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <Card className="p-4 border border-border hover:shadow-lg transition-shadow duration-300 flex flex-col">
      {/* Product Image Placeholder */}
      <div className="w-full h-40 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg mb-4 flex items-center justify-center">
        <div className="text-4xl">
          {product.category === "food" ? "🍖" :
            product.category === "toy" ? "🎾" :
              product.category === "medication" ? "💊" :
                "🛍️"}
        </div>
      </div>

      {/* Product Code */}
      <p className="text-xs text-muted-foreground mb-2">Code: {product.productCode}</p>

      {/* Product Category */}
      <div className="mb-2">
        <span className={`inline-block px-2 py-1 rounded text-xs font-medium capitalize ${getCategoryColor(product.category)}`}>
          {product.category}
        </span>
      </div>

      {/* Product Name */}
      <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
        {product.name}
      </h3>

      {/* Product Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
        {product.description}
      </p>

      {/* Stock Status */}
      <div className="mb-3">
        {isOutOfStock ? (
          <div className="flex items-center gap-2 text-sm text-red-600">
            <AlertCircle className="w-4 h-4" />
            <span>Out of Stock</span>
          </div>
        ) : isLowStock ? (
          <div className="flex items-center gap-2 text-sm text-yellow-600">
            <AlertCircle className="w-4 h-4" />
            <span>Only {product.stock} left</span>
          </div>
        ) : (
          <p className="text-sm text-green-600 font-medium">In Stock ({product.stock})</p>
        )}
      </div>

      {/* Price */}
      <p className="text-2xl font-bold text-primary mb-4">
        {formatPrice(product.price)}
      </p>

      {/* Quantity and Add to Cart */}
      <div className="flex gap-2">
        {!isOutOfStock && (
          <div className="flex items-center border border-input rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity === 1}
              className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              −
            </button>
            <span className="px-3 py-1 text-sm font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              disabled={quantity >= product.stock}
              className="px-2 py-1 text-muted-foreground hover:text-foreground disabled:opacity-50"
            >
              +
            </button>
          </div>
        )}
        <Button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`flex-1 ${isAdded ? "bg-green-600 hover:bg-green-700" : "bg-primary hover:bg-primary/90"}`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isAdded ? "Added!" : "Add"}
        </Button>
      </div>
    </Card>
  );
}
