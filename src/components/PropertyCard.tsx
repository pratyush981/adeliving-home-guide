
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Car, MapPin } from "lucide-react";

interface PropertyCardProps {
  image: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  carSpaces: number;
  type: "rent" | "buy";
}

const PropertyCard = ({
  image,
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  carSpaces,
  type
}: PropertyCardProps) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 bg-white/70 backdrop-blur-sm border border-gray-200">
      <div className="relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover"
        />
        <Badge 
          className={`absolute top-3 right-3 ${
            type === "rent" 
              ? "bg-emerald-600 hover:bg-emerald-700" 
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          For {type === "rent" ? "Rent" : "Sale"}
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-gray-900">{title}</h3>
        
        <div className="flex items-center gap-1 mb-3 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{location}</span>
        </div>
        
        <div className="text-2xl font-bold text-gray-900 mb-4">
          {price}
        </div>
        
        <div className="flex items-center gap-4 text-gray-600 text-sm">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{bedrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{bathrooms}</span>
          </div>
          <div className="flex items-center gap-1">
            <Car className="h-4 w-4" />
            <span>{carSpaces}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;
