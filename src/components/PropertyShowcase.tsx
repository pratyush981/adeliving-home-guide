
import PropertyCard from "@/components/PropertyCard";

const PropertyShowcase = () => {
  const sampleProperties = [
    {
      image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400&h=300&fit=crop",
      title: "Modern 3BR Townhouse",
      location: "Paddington, Brisbane",
      price: "$750/week",
      bedrooms: 3,
      bathrooms: 2,
      carSpaces: 1,
      type: "rent"
    },
    {
      image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop",
      title: "Contemporary Apartment",
      location: "South Yarra, Melbourne",
      price: "$850,000",
      bedrooms: 2,
      bathrooms: 2,
      carSpaces: 1,
      type: "buy"
    },
    {
      image: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400&h=300&fit=crop",
      title: "Family Home with Garden",
      location: "Norwood, Adelaide",
      price: "$650,000",
      bedrooms: 4,
      bathrooms: 2,
      carSpaces: 2,
      type: "buy"
    }
  ];

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Sample Properties I Can Help You With
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          These are just examples of the type of properties I can help you find and evaluate. 
          Let's chat about what you're really looking for! 💬
        </p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {sampleProperties.map((property, index) => (
          <PropertyCard key={index} {...property} />
        ))}
      </div>
    </div>
  );
};

export default PropertyShowcase;
