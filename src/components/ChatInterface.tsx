import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Home, MessageCircle, MapPin, DollarSign, Calculator, Clock, Shield } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  hasPropertyCards?: boolean;
  properties?: Property[];
  hasPropertyDetail?: boolean;
  propertyDetail?: PropertyDetail;
}

interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  carSpaces: number;
  type: "rent" | "buy";
  image: string;
  description: string;
  paymentOptions?: string[];
}

interface PropertyDetail {
  id: number;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  carSpaces: number;
  type: "rent" | "buy";
  image: string;
  description: string;
  detailedDescription: string;
  features: string[];
  nearbyAmenities: string[];
  transportOptions: string[];
  financingOptions: FinancingOption[];
  locationDetails: LocationDetails;
  propertySpecs: PropertySpecs;
}

interface FinancingOption {
  type: string;
  description: string;
  details: string[];
  monthlyPayment?: string;
  interestRate?: string;
  loanTerm?: string;
}

interface LocationDetails {
  suburb: string;
  city: string;
  postcode: string;
  walkScore: number;
  crimeRating: string;
  schoolRating: string;
  publicTransport: string[];
  nearbyShops: string[];
  medicalFacilities: string[];
}

interface PropertySpecs {
  landSize: string;
  buildingSize: string;
  yearBuilt: string;
  propertyType: string;
  councilRates: string;
  waterRates: string;
  energyRating: string;
  inspection: string;
}

interface ChatInterfaceProps {
  onBackToHome: () => void;
}

interface ConversationState {
  step: 'initial' | 'location' | 'budget' | 'showing_properties' | 'property_selected';
  intent: 'buy' | 'rent' | null;
  location: string;
  budget: string;
}

const ChatInterface = ({ onBackToHome }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "G'day! I'm AdeLiving, your friendly AI real estate assistant! 😊 I'm here to help you navigate the Australian property market with confidence.\n\nTo get started, what are you looking to do?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [conversationState, setConversationState] = useState<ConversationState>({
    step: 'initial',
    intent: null,
    location: '',
    budget: ''
  });
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const australianCities = [
    'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Gold Coast',
    'Newcastle', 'Canberra', 'Central Coast', 'Wollongong', 'Logan City',
    'Geelong', 'Hobart', 'Townsville', 'Cairns', 'Darwin', 'Toowoomba',
    'Ballarat', 'Bendigo', 'Albury', 'Launceston', 'Mackay', 'Rockhampton'
  ];

  const generatePropertyDetail = (propertyId: number, location: string, intent: 'buy' | 'rent'): PropertyDetail => {
    const baseProperty = generateProperties(location, "", intent).find(p => p.id === propertyId);
    if (!baseProperty) return {} as PropertyDetail;

    const financingOptions: FinancingOption[] = intent === 'buy' ? [
      {
        type: "Standard Home Loan",
        description: "Traditional mortgage with competitive rates",
        details: [
          "Minimum 10% deposit required",
          "Principal and interest payments",
          "Choice of fixed or variable rates",
          "Pre-approval available"
        ],
        monthlyPayment: "$2,840",
        interestRate: "6.2% p.a.",
        loanTerm: "30 years"
      },
      {
        type: "First Home Buyer Package",
        description: "Special rates and grants for first-time buyers",
        details: [
          "5% deposit with LMI waiver options",
          "Government grants up to $25,000",
          "Reduced stamp duty",
          "Free property valuation"
        ],
        monthlyPayment: "$2,650",
        interestRate: "5.8% p.a.",
        loanTerm: "30 years"
      },
      {
        type: "Investment Loan",
        description: "Tailored for property investors",
        details: [
          "Interest-only payment options",
          "Tax deductible interest",
          "20% deposit typically required",
          "Rental income assessment"
        ],
        monthlyPayment: "$2,100 (IO)",
        interestRate: "6.5% p.a.",
        loanTerm: "30 years"
      }
    ] : [
      {
        type: "Standard Rental",
        description: "Traditional rental agreement",
        details: [
          "4 weeks bond required",
          "Weekly rent in advance",
          "6-12 month lease terms",
          "Tenant insurance recommended"
        ],
        monthlyPayment: baseProperty.price.replace('/week', '/month'),
        interestRate: "N/A",
        loanTerm: "Lease term"
      },
      {
        type: "Rent-to-Own Option",
        description: "Path to ownership through rental",
        details: [
          "Higher weekly rent with equity building",
          "Option to purchase after 2-5 years",
          "Portion of rent counts toward deposit",
          "Fixed purchase price"
        ],
        monthlyPayment: `${baseProperty.price} + $100/week`,
        interestRate: "N/A",
        loanTerm: "2-5 years"
      }
    ];

    const locationDetails: LocationDetails = {
      suburb: baseProperty.location.split(',')[0],
      city: location,
      postcode: Math.floor(Math.random() * 9000) + 1000 + "",
      walkScore: Math.floor(Math.random() * 40) + 60,
      crimeRating: ["Very Low", "Low", "Moderate"][Math.floor(Math.random() * 3)],
      schoolRating: ["Excellent", "Good", "Average"][Math.floor(Math.random() * 3)],
      publicTransport: ["Train station 800m", "Bus stop 200m", "Tram stop 1.2km"],
      nearbyShops: ["Westfield Shopping Center", "Local supermarket", "Specialty stores"],
      medicalFacilities: ["General Practitioner 500m", "Pharmacy 300m", "Hospital 5km"]
    };

    const propertySpecs: PropertySpecs = {
      landSize: Math.floor(Math.random() * 300) + 200 + "m²",
      buildingSize: Math.floor(Math.random() * 100) + 150 + "m²",
      yearBuilt: Math.floor(Math.random() * 30) + 1990 + "",
      propertyType: baseProperty.bedrooms > 3 ? "House" : baseProperty.bedrooms > 1 ? "Townhouse" : "Apartment",
      councilRates: "$" + (Math.floor(Math.random() * 1000) + 1500) + "/year",
      waterRates: "$" + (Math.floor(Math.random() * 300) + 400) + "/year",
      energyRating: Math.floor(Math.random() * 3) + 6 + " stars",
      inspection: intent === 'buy' ? "Building and pest inspection recommended" : "Routine inspections quarterly"
    };

    return {
      ...baseProperty,
      detailedDescription: `This ${propertySpecs.propertyType.toLowerCase()} offers exceptional ${intent === 'buy' ? 'investment potential' : 'rental living'} in the heart of ${locationDetails.suburb}. ${baseProperty.description} The property features modern finishes throughout and has been well-maintained.`,
      features: [
        "Modern kitchen with stone benchtops",
        "Split-system air conditioning",
        "Built-in wardrobes",
        "Secure parking",
        "Outdoor entertaining area",
        "Low maintenance gardens",
        "Storage throughout",
        "Quality fixtures and fittings"
      ],
      nearbyAmenities: [
        "Shopping centers within 2km",
        "Restaurants and cafes nearby",
        "Parks and recreational facilities",
        "Sports complexes",
        "Libraries and community centers",
        "Beaches/waterfront (if applicable)"
      ],
      transportOptions: [
        "Public transport nearby",
        "Major roads accessible",
        "Airport access within 45 minutes",
        "Bike paths available",
        "Walking distance to amenities"
      ],
      financingOptions,
      locationDetails,
      propertySpecs
    };
  };

  const handlePropertySelection = (propertyId: number) => {
    const propertyDetail = generatePropertyDetail(propertyId, conversationState.location, conversationState.intent!);
    
    const aiMessage: Message = {
      id: messages.length + 1,
      text: `Here are the complete details for **${propertyDetail.title}** in ${propertyDetail.location}! 🏡\n\nI've compiled all the information you need including financing options, location details, property specifications, and more. This gives you everything needed to make an informed decision!`,
      isUser: false,
      timestamp: new Date(),
      hasPropertyDetail: true,
      propertyDetail: propertyDetail
    };

    setMessages(prev => [...prev, aiMessage]);
  };

  const generateProperties = (location: string, budget: string, intent: 'buy' | 'rent'): Property[] => {
    const propertyData = {
      Sydney: [
        { title: "Modern 2BR Apartment", suburb: "Bondi", bedrooms: 2, bathrooms: 2, carSpaces: 1, image: "photo-1564013799919-ab600027ffc6", description: "Stunning ocean views, walk to beach" },
        { title: "Family Townhouse", suburb: "Parramatta", bedrooms: 3, bathrooms: 2, carSpaces: 2, image: "photo-1570129477492-45c003edd2be", description: "Modern kitchen, private courtyard" },
        { title: "Luxury Penthouse", suburb: "Circular Quay", bedrooms: 3, bathrooms: 3, carSpaces: 2, image: "photo-1487958449943-2429e8be8625", description: "Harbor views, premium finishes" },
        { title: "Cozy Studio", suburb: "Surry Hills", bedrooms: 1, bathrooms: 1, carSpaces: 0, image: "photo-1524230572899-a752b3835840", description: "Perfect for young professionals" },
        { title: "Spacious Family Home", suburb: "Epping", bedrooms: 4, bathrooms: 3, carSpaces: 2, image: "photo-1568605114967-8130f3a36994", description: "Large backyard, near schools" },
        { title: "Contemporary Unit", suburb: "Newtown", bedrooms: 2, bathrooms: 1, carSpaces: 1, image: "photo-1493397212122-2b85dda8106b", description: "Trendy location, cafes nearby" },
        { title: "Waterfront Apartment", suburb: "Manly", bedrooms: 2, bathrooms: 2, carSpaces: 1, image: "photo-1721322800607-8c38375eef04", description: "Beach lifestyle, ferry access" },
        { title: "Heritage Terrace", suburb: "Paddington", bedrooms: 3, bathrooms: 2, carSpaces: 1, image: "photo-1483058712412-4245e9b90334", description: "Character home, restored features" },
        { title: "High-rise Living", suburb: "Chatswood", bedrooms: 1, bathrooms: 1, carSpaces: 1, image: "photo-1564013799919-ab600027ffc6", description: "Shopping center access, train station" },
        { title: "Garden Apartment", suburb: "Lane Cove", bedrooms: 2, bathrooms: 2, carSpaces: 1, image: "photo-1570129477492-45c003edd2be", description: "Quiet area, leafy surrounds" }
      ],
      Melbourne: [
        { title: "CBD Apartment", suburb: "Southbank", bedrooms: 2, bathrooms: 2, carSpaces: 1, image: "photo-1487958449943-2429e8be8625", description: "City skyline views, tram access" },
        { title: "Victorian Terrace", suburb: "Fitzroy", bedrooms: 3, bathrooms: 2, carSpaces: 1, image: "photo-1524230572899-a752b3835840", description: "Original features, trendy location" },
        { title: "Modern Townhouse", suburb: "Docklands", bedrooms: 3, bathrooms: 2, carSpaces: 2, image: "photo-1568605114967-8130f3a36994", description: "Waterfront living, new development" },
        { title: "Family Home", suburb: "Camberwell", bedrooms: 4, bathrooms: 3, carSpaces: 2, image: "photo-1493397212122-2b85dda8106b", description: "Established neighborhood, good schools" },
        { title: "Loft Apartment", suburb: "Richmond", bedrooms: 2, bathrooms: 1, carSpaces: 1, image: "photo-1721322800607-8c38375eef04", description: "Industrial chic, warehouse conversion" },
        { title: "Beachside Unit", suburb: "St Kilda", bedrooms: 1, bathrooms: 1, carSpaces: 1, image: "photo-1483058712412-4245e9b90334", description: "Beach access, vibrant nightlife" },
        { title: "Suburban House", suburb: "Glen Waverley", bedrooms: 4, bathrooms: 2, carSpaces: 2, image: "photo-1564013799919-ab600027ffc6", description: "Family-friendly, Asian cuisine" },
        { title: "Inner City Living", suburb: "Carlton", bedrooms: 2, bathrooms: 2, carSpaces: 1, image: "photo-1570129477492-45c003edd2be", description: "University area, cafe culture" },
        { title: "Garden Home", suburb: "Brighton", bedrooms: 3, bathrooms: 2, carSpaces: 2, image: "photo-1487958449943-2429e8be8625", description: "Beach suburb, family lifestyle" },
        { title: "Modern Unit", suburb: "South Yarra", bedrooms: 2, bathrooms: 2, carSpaces: 1, image: "photo-1524230572899-a752b3835840", description: "Shopping precinct, dining options" }
      ],
      Brisbane: [
        { title: "River Views Apartment", suburb: "New Farm", bedrooms: 2, bathrooms: 2, carSpaces: 1, image: "photo-1568605114967-8130f3a36994", description: "Brisbane River views, trendy area" },
        { title: "Queenslander Home", suburb: "Paddington", bedrooms: 3, bathrooms: 2, carSpaces: 2, image: "photo-1493397212122-2b85dda8106b", description: "Traditional architecture, character" },
        { title: "High-rise Living", suburb: "South Bank", bedrooms: 1, bathrooms: 1, carSpaces: 1, image: "photo-1721322800607-8c38375eef04", description: "Cultural precinct, city views" },
        { title: "Family Townhouse", suburb: "Toowong", bedrooms: 3, bathrooms: 2, carSpaces: 2, image: "photo-1483058712412-4245e9b90334", description: "University area, train access" },
        { title: "Modern Apartment", suburb: "Fortitude Valley", bedrooms: 2, bathrooms: 2, carSpaces: 1, image: "photo-1564013799919-ab600027ffc6", description: "Entertainment district, nightlife" },
        { title: "Suburban Home", suburb: "Indooroopilly", bedrooms: 4, bathrooms: 3, carSpaces: 2, image: "photo-1570129477492-45c003edd2be", description: "Shopping center, family area" },
        { title: "Penthouse Living", suburb: "Kangaroo Point", bedrooms: 3, bathrooms: 3, carSpaces: 2, image: "photo-1487958449943-2429e8be8625", description: "Story Bridge views, luxury finishes" },
        { title: "Garden Unit", suburb: "West End", bedrooms: 2, bathrooms: 1, carSpaces: 1, image: "photo-1524230572899-a752b3835840", description: "Artistic community, markets" },
        { title: "Waterfront Home", suburb: "Bulimba", bedrooms: 3, bathrooms: 2, carSpaces: 2, image: "photo-1568605114967-8130f3a36994", description: "River access, established area" },
        { title: "City Fringe Living", suburb: "Spring Hill", bedrooms: 1, bathrooms: 1, carSpaces: 1, image: "photo-1493397212122-2b85dda8106b", description: "Close to CBD, historic area" }
      ],
      Perth: [
        { title: "Beachside Apartment", suburb: "Scarborough", bedrooms: 2, bathrooms: 2, carSpaces: 1, image: "photo-1721322800607-8c38375eef04", description: "Ocean views, beach lifestyle" },
        { title: "Family Home", suburb: "Subiaco", bedrooms: 4, bathrooms: 2, carSpaces: 2, image: "photo-1483058712412-4245e9b90334", description: "Central location, character home" },
        { title: "Modern Townhouse", suburb: "Joondalup", bedrooms: 3, bathrooms: 2, carSpaces: 2, image: "photo-1564013799919-ab600027ffc6", description: "New development, family-friendly" },
        { title: "CBD Living", suburb: "Perth CBD", bedrooms: 1, bathrooms: 1, carSpaces: 1, image: "photo-1570129477492-45c003edd2be", description: "City lifestyle, transport hub" },
        { title: "Riverside Unit", suburb: "South Perth", bedrooms: 2, bathrooms: 2, carSpaces: 1, image: "photo-1487958449943-2429e8be8625", description: "Swan River views, zoo nearby" },
        { title: "Coastal Home", suburb: "Fremantle", bedrooms: 3, bathrooms: 2, carSpaces: 2, image: "photo-1524230572899-a752b3835840", description: "Historic port, weekend markets" },
        { title: "Luxury Villa", suburb: "Cottesloe", bedrooms: 4, bathrooms: 3, carSpaces: 2, image: "photo-1568605114967-8130f3a36994", description: "Premium beachside, resort living" },
        { title: "Garden Apartment", suburb: "Mount Lawley", bedrooms: 2, bathrooms: 1, carSpaces: 1, image: "photo-1493397212122-2b85dda8106b", description: "Trendy area, cafes and bars" },
        { title: "Family Estate", suburb: "Karrinyup", bedrooms: 4, bathrooms: 3, carSpaces: 3, image: "photo-1721322800607-8c38375eef04", description: "Shopping center, schools nearby" },
        { title: "Modern Unit", suburb: "Leederville", bedrooms: 1, bathrooms: 1, carSpaces: 1, image: "photo-1483058712412-4245e9b90334", description: "Student area, close to city" }
      ],
      Adelaide: [
        { title: "Heritage Apartment", suburb: "North Adelaide", bedrooms: 2, bathrooms: 2, carSpaces: 1, image: "photo-1564013799919-ab600027ffc6", description: "Historic area, parklands nearby" },
        { title: "Modern Townhouse", suburb: "Mawson Lakes", bedrooms: 3, bathrooms: 2, carSpaces: 2, image: "photo-1570129477492-45c003edd2be", description: "New development, uni access" },
        { title: "City Living", suburb: "Adelaide CBD", bedrooms: 1, bathrooms: 1, carSpaces: 1, image: "photo-1487958449943-2429e8be8625", description: "Central location, tram access" },
        { title: "Family Home", suburb: "Burnside", bedrooms: 4, bathrooms: 3, carSpaces: 2, image: "photo-1524230572899-a752b3835840", description: "Established suburb, good schools" },
        { title: "Beachside Unit", suburb: "Glenelg", bedrooms: 2, bathrooms: 2, carSpaces: 1, image: "photo-1568605114967-8130f3a36994", description: "Jetty Road shopping, beach access" },
        { title: "Hills Living", suburb: "Stirling", bedrooms: 3, bathrooms: 2, carSpaces: 2, image: "photo-1493397212122-2b85dda8106b", description: "Adelaide Hills, scenic views" },
        { title: "Garden Home", suburb: "Unley", bedrooms: 3, bathrooms: 2, carSpaces: 1, image: "photo-1721322800607-8c38375eef04", description: "Character area, cafes nearby" },
        { title: "Modern Unit", suburb: "West Lakes", bedrooms: 2, bathrooms: 2, carSpaces: 1, image: "photo-1483058712412-4245e9b90334", description: "Waterfront living, golf course" },
        { title: "Family Estate", suburb: "Tea Tree Gully", bedrooms: 4, bathrooms: 2, carSpaces: 2, image: "photo-1564013799919-ab600027ffc6", description: "Family suburb, new housing" },
        { title: "Inner City Living", suburb: "Norwood", bedrooms: 2, bathrooms: 1, carSpaces: 1, image: "photo-1570129477492-45c003edd2be", description: "Parade shopping, food scene" }
      ]
    };

    const cityData = propertyData[location as keyof typeof propertyData] || propertyData.Sydney;
    
    return cityData.map((prop, index) => ({
      id: index + 1,
      title: prop.title,
      location: `${prop.suburb}, ${location}`,
      price: intent === 'rent' 
        ? `$${Math.floor(Math.random() * 400 + 200)}/week`
        : `$${Math.floor(Math.random() * 500000 + 400000).toLocaleString()}`,
      bedrooms: prop.bedrooms,
      bathrooms: prop.bathrooms,
      carSpaces: prop.carSpaces,
      type: intent,
      image: `https://images.unsplash.com/${prop.image}?w=400&h=300&fit=crop`,
      description: prop.description,
      paymentOptions: intent === 'rent' 
        ? ['Weekly payments', 'Monthly payments', 'Bond (4 weeks)', 'Direct debit available']
        : ['Home loan required', 'Deposit 10-20%', 'First home buyer grants available', 'Stamp duty calculator needed']
    }));
  };

  const handleOptionSelect = (option: string) => {
    const userMessage: Message = {
      id: messages.length + 1,
      text: option,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    setTimeout(() => {
      const response = generateResponse(option.toLowerCase().trim());
      const aiMessage: Message = {
        id: messages.length + 2,
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        hasPropertyCards: response.hasPropertyCards,
        properties: response.properties
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Check if user is selecting a property by name/number
    if (conversationState.step === 'showing_properties') {
      const propertyMatch = inputValue.match(/(\d+)|property\s*(\d+)|show\s*me\s*(.*)/i);
      if (propertyMatch) {
        const propertyId = propertyMatch[1] ? parseInt(propertyMatch[1]) : 1;
        setTimeout(() => {
          handlePropertySelection(propertyId);
        }, 1000);
        setInputValue("");
        return;
      }
    }

    // Process the message based on conversation state
    setTimeout(() => {
      const response = generateResponse(inputValue.toLowerCase().trim());
      const aiMessage: Message = {
        id: messages.length + 2,
        text: response.text,
        isUser: false,
        timestamp: new Date(),
        hasPropertyCards: response.hasPropertyCards,
        properties: response.properties
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputValue("");
  };

  const generateResponse = (input: string): { text: string; hasPropertyCards?: boolean; properties?: Property[] } => {
    // Step 1: Determine buy or rent intent
    if (conversationState.step === 'initial') {
      if (input.includes('buy') || input.includes('purchase')) {
        setConversationState(prev => ({ ...prev, step: 'location', intent: 'buy' }));
        return {
          text: "Perfect! I'll help you find a property to buy! 🏠\n\nWhich Australian city or area are you interested in? Choose from the options below:"
        };
      } else if (input.includes('rent') || input.includes('rental')) {
        setConversationState(prev => ({ ...prev, step: 'location', intent: 'rent' }));
        return {
          text: "Great choice! I'll help you find the perfect rental property! 🏘️\n\nWhich Australian city or area would you like to rent in? Choose from the options below:"
        };
      } else {
        return {
          text: "I'd love to help! To get started, please choose what you're looking for:"
        };
      }
    }

    // Step 2: Get location
    if (conversationState.step === 'location') {
      const matchedCity = australianCities.find(city => 
        input.includes(city.toLowerCase()) || city.toLowerCase().includes(input)
      );
      
      if (matchedCity) {
        setConversationState(prev => ({ ...prev, step: 'budget', location: matchedCity }));
        const action = conversationState.intent === 'buy' ? 'buying' : 'renting';
        return {
          text: `Excellent choice! ${matchedCity} is a fantastic place for ${action}! 🎯\n\nNow, what's your budget range? Choose from the options below:`
        };
      } else {
        return {
          text: "Please choose from one of the available Australian cities below:"
        };
      }
    }

    // Step 3: Get budget and show properties
    if (conversationState.step === 'budget') {
      setConversationState(prev => ({ ...prev, step: 'showing_properties', budget: input }));
      const properties = generateProperties(conversationState.location, input, conversationState.intent!);
      
      return {
        text: `Perfect! Here are the best ${conversationState.intent === 'buy' ? 'properties for sale' : 'rental properties'} in ${conversationState.location} within your budget! 🏡\n\nI've found ${properties.length} great options for you. Each property includes payment information and financing options. Click on any property card below to learn more!\n\n💡 **Pro tip:** All properties come with detailed payment plans and ${conversationState.intent === 'buy' ? 'mortgage pre-approval assistance' : 'rental application support'}!`,
        hasPropertyCards: true,
        properties: properties
      };
    }

    // Default response for other queries
    return {
      text: "I'd be happy to help with that! Please use the buttons above to navigate through the options, or feel free to ask me anything about Australian real estate! 😊"
    };
  };

  const renderActionButtons = () => {
    if (conversationState.step === 'initial') {
      return (
        <div className="flex flex-col gap-3 mt-4 mb-6">
          <Button
            onClick={() => handleOptionSelect('buy')}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <Home className="mr-3 h-6 w-6" />
            🏠 Buy a Property
          </Button>
          <Button
            onClick={() => handleOptionSelect('rent')}
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
            size="lg"
          >
            <Home className="mr-3 h-6 w-6" />
            🏘️ Rent a Property
          </Button>
        </div>
      );
    }

    if (conversationState.step === 'location') {
      const majorCities = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'];
      const coastalAreas = ['Gold Coast', 'Newcastle', 'Central Coast'];
      const otherCities = ['Canberra', 'Hobart', 'Darwin'];

      return (
        <div className="mt-4 mb-6">
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">🌆 Major Cities</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {majorCities.map((city) => (
                <Button
                  key={city}
                  onClick={() => handleOptionSelect(city)}
                  variant="outline"
                  className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">🏖️ Coastal Areas</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {coastalAreas.map((city) => (
                <Button
                  key={city}
                  onClick={() => handleOptionSelect(city)}
                  variant="outline"
                  className="hover:bg-emerald-50 hover:border-emerald-300 transition-all duration-200"
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-2">🏛️ Other Cities</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {otherCities.map((city) => (
                <Button
                  key={city}
                  onClick={() => handleOptionSelect(city)}
                  variant="outline"
                  className="hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                >
                  {city}
                </Button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    if (conversationState.step === 'budget') {
      const budgetOptions = conversationState.intent === 'buy' ? [
        'Under $500k',
        '$500k - $700k', 
        '$700k - $1M',
        '$1M - $1.5M',
        'Over $1.5M'
      ] : [
        'Under $300/week',
        '$300 - $500/week',
        '$500 - $700/week', 
        '$700 - $1000/week',
        'Over $1000/week'
      ];

      return (
        <div className="mt-4 mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            {conversationState.intent === 'buy' ? '💰 Buying Budget' : '💸 Weekly Rental Budget'}
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {budgetOptions.map((budget) => (
              <Button
                key={budget}
                onClick={() => handleOptionSelect(budget)}
                variant="outline"
                className="hover:bg-green-50 hover:border-green-300 transition-all duration-200 text-left justify-start"
              >
                <DollarSign className="mr-2 h-4 w-4" />
                {budget}
              </Button>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center gap-4 shadow-sm">
        <Button variant="ghost" size="sm" onClick={onBackToHome} className="hover:bg-gray-100">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl shadow-md">
            <Home className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900">AdeLiving</h2>
            <p className="text-sm text-gray-500">Your AI Real Estate Assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.map((message) => (
            <div key={message.id}>
              <div className={`flex ${message.isUser ? "justify-end" : "justify-start"} mb-4`}>
                <div
                  className={`max-w-[80%] p-4 rounded-2xl shadow-md ${
                    message.isUser
                      ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white"
                      : "bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-900"
                  }`}
                >
                  {!message.isUser && (
                    <div className="flex items-center gap-2 mb-2">
                      <MessageCircle className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">AdeLiving</span>
                    </div>
                  )}
                  <p className="whitespace-pre-line leading-relaxed">{message.text}</p>
                  <p className={`text-xs mt-2 ${message.isUser ? "text-blue-100" : "text-gray-500"}`}>
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              {!message.isUser && renderActionButtons()}

              {/* Property Cards */}
              {message.hasPropertyCards && message.properties && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mb-6">
                  {message.properties.map((property) => (
                    <div 
                      key={property.id} 
                      className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105"
                      onClick={() => handlePropertySelection(property.id)}
                    >
                      <img 
                        src={property.image} 
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            property.type === 'rent' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            For {property.type === 'rent' ? 'Rent' : 'Sale'}
                          </span>
                          <span className="text-xl font-bold text-gray-900">{property.price}</span>
                        </div>
                        <h3 className="font-semibold text-lg mb-1">{property.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{property.location}</p>
                        <p className="text-gray-600 text-sm mb-3">{property.description}</p>
                        
                        <div className="flex items-center gap-4 text-gray-600 text-sm mb-3">
                          <span>{property.bedrooms} bed</span>
                          <span>{property.bathrooms} bath</span>
                          <span>{property.carSpaces} car</span>
                        </div>

                        <div className="border-t pt-3">
                          <p className="text-xs font-medium text-gray-700 mb-1">Click for full details</p>
                          <div className="flex flex-wrap gap-1">
                            {property.paymentOptions?.slice(0, 2).map((option, index) => (
                              <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                {option}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Property Detail View */}
              {message.hasPropertyDetail && message.propertyDetail && (
                <div className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden mt-4 mb-6">
                  <img 
                    src={message.propertyDetail.image} 
                    alt={message.propertyDetail.title}
                    className="w-full h-64 object-cover"
                  />
                  
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">{message.propertyDetail.title}</h2>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{message.propertyDetail.location}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gray-900">{message.propertyDetail.price}</div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          message.propertyDetail.type === 'rent' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          For {message.propertyDetail.type === 'rent' ? 'Rent' : 'Sale'}
                        </span>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{message.propertyDetail.bedrooms}</div>
                        <div className="text-sm text-gray-600">Bedrooms</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{message.propertyDetail.bathrooms}</div>
                        <div className="text-sm text-gray-600">Bathrooms</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{message.propertyDetail.carSpaces}</div>
                        <div className="text-sm text-gray-600">Car Spaces</div>
                      </div>
                      <div className="text-center p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{message.propertyDetail.locationDetails.walkScore}</div>
                        <div className="text-sm text-gray-600">Walk Score</div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-gray-700 leading-relaxed">{message.propertyDetail.detailedDescription}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Home className="h-5 w-5 text-blue-600" />
                          Property Features
                        </h3>
                        <ul className="space-y-2">
                          {message.propertyDetail.features.map((feature, index) => (
                            <li key={index} className="flex items-center gap-2 text-gray-700">
                              <div className="w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <MapPin className="h-5 w-5 text-emerald-600" />
                          Location Details
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div><strong>Suburb:</strong> {message.propertyDetail.locationDetails.suburb}</div>
                          <div><strong>Postcode:</strong> {message.propertyDetail.locationDetails.postcode}</div>
                          <div><strong>Crime Rating:</strong> {message.propertyDetail.locationDetails.crimeRating}</div>
                          <div><strong>School Rating:</strong> {message.propertyDetail.locationDetails.schoolRating}</div>
                        </div>
                      </div>
                    </div>

                    <div className="mb-6">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <DollarSign className="h-5 w-5 text-green-600" />
                        Financing Options
                      </h3>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {message.propertyDetail.financingOptions.map((option, index) => (
                          <div key={index} className="p-4 border border-gray-200 rounded-lg">
                            <h4 className="font-semibold text-gray-900 mb-2">{option.type}</h4>
                            <p className="text-sm text-gray-600 mb-3">{option.description}</p>
                            <div className="space-y-1 text-xs">
                              {option.monthlyPayment && (
                                <div className="flex justify-between">
                                  <span>Monthly Payment:</span>
                                  <span className="font-medium">{option.monthlyPayment}</span>
                                </div>
                              )}
                              {option.interestRate && (
                                <div className="flex justify-between">
                                  <span>Interest Rate:</span>
                                  <span className="font-medium">{option.interestRate}</span>
                                </div>
                              )}
                              {option.loanTerm && (
                                <div className="flex justify-between">
                                  <span>Term:</span>
                                  <span className="font-medium">{option.loanTerm}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Calculator className="h-5 w-5 text-purple-600" />
                          Property Specifications
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Land Size:</span>
                            <span className="font-medium">{message.propertyDetail.propertySpecs.landSize}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Building Size:</span>
                            <span className="font-medium">{message.propertyDetail.propertySpecs.buildingSize}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Year Built:</span>
                            <span className="font-medium">{message.propertyDetail.propertySpecs.yearBuilt}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Energy Rating:</span>
                            <span className="font-medium">{message.propertyDetail.propertySpecs.energyRating}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Council Rates:</span>
                            <span className="font-medium">{message.propertyDetail.propertySpecs.councilRates}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                          <Clock className="h-5 w-5 text-orange-600" />
                          Nearby Amenities
                        </h3>
                        <ul className="space-y-2">
                          {message.propertyDetail.nearbyAmenities.slice(0, 6).map((amenity, index) => (
                            <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                              <div className="w-1.5 h-1.5 bg-orange-600 rounded-full"></div>
                              {amenity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="bg-white/90 backdrop-blur-sm border-t border-gray-200 p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              conversationState.step === 'showing_properties' 
                ? "Type a property number or name to see details..."
                : "Type your message here or use the buttons above..."
            }
            className="flex-1 rounded-full border-gray-300 focus:border-blue-500 shadow-sm"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-full px-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
