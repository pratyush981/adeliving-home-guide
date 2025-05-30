
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Home, MessageCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  isUser: boolean;
  timestamp: Date;
  hasPropertyCards?: boolean;
  properties?: Property[];
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

interface ChatInterfaceProps {
  onBackToHome: () => void;
}

interface ConversationState {
  step: 'initial' | 'location' | 'budget' | 'showing_properties' | 'property_selected';
  intent: 'buy' | 'rent' | null;
  location: string;
  budget: string;
  selectedProperty?: Property;
}

const ChatInterface = ({ onBackToHome }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "G'day! I'm AdeLiving, your friendly AI real estate assistant! 😊 I'm here to help you navigate the Australian property market with confidence.\n\nTo get started, are you looking to:\n🏠 **Buy** a property\n🏘️ **Rent** a property\n\nJust type 'buy' or 'rent' to begin!",
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

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

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
          text: "Perfect! I'll help you find a property to buy! 🏠\n\nWhich Australian city or area are you interested in? Here are some popular options:\n\n🌆 **Major Cities:**\n• Sydney\n• Melbourne\n• Brisbane\n• Perth\n• Adelaide\n\n🏖️ **Coastal Areas:**\n• Gold Coast\n• Newcastle\n• Central Coast\n\n🏛️ **Other Cities:**\n• Canberra\n• Hobart\n• Darwin\n\nJust type the city name you're interested in!"
        };
      } else if (input.includes('rent') || input.includes('rental')) {
        setConversationState(prev => ({ ...prev, step: 'location', intent: 'rent' }));
        return {
          text: "Great choice! I'll help you find the perfect rental property! 🏘️\n\nWhich Australian city or area would you like to rent in? Here are some popular options:\n\n🌆 **Major Cities:**\n• Sydney\n• Melbourne\n• Brisbane\n• Perth\n• Adelaide\n\n🏖️ **Coastal Areas:**\n• Gold Coast\n• Newcastle\n• Central Coast\n\n🏛️ **Other Cities:**\n• Canberra\n• Hobart\n• Darwin\n\nJust type the city name you're interested in!"
        };
      } else {
        return {
          text: "I'd love to help! To get started, please let me know if you're looking to:\n\n🏠 **Buy** a property\n🏘️ **Rent** a property\n\nJust type 'buy' or 'rent' and we'll begin finding your perfect match!"
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
          text: `Excellent choice! ${matchedCity} is a fantastic place for ${action}! 🎯\n\nNow, what's your budget range?\n\n${conversationState.intent === 'buy' ? 
            '💰 **Buying Budget:**\n• Under $500k\n• $500k - $700k\n• $700k - $1M\n• $1M - $1.5M\n• Over $1.5M' :
            '💸 **Weekly Rental Budget:**\n• Under $300/week\n• $300 - $500/week\n• $500 - $700/week\n• $700 - $1000/week\n• Over $1000/week'
          }\n\nJust type your budget range (e.g., "${conversationState.intent === 'buy' ? '$500k-$700k' : '$400-$600/week'}")!`
        };
      } else {
        return {
          text: "I don't recognize that location. Could you please choose from one of these Australian cities?\n\n🌆 Sydney, Melbourne, Brisbane, Perth, Adelaide\n🏖️ Gold Coast, Newcastle, Central Coast\n🏛️ Canberra, Hobart, Darwin\n\nJust type the city name!"
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
      text: "I'd be happy to help with that! To provide you with the most relevant information, could you please let me know:\n\n1. Are you looking to **buy** or **rent**?\n2. Which **city** interests you?\n3. What's your **budget** range?\n\nOnce I have these details, I can provide personalized recommendations! 😊"
    };
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 p-4 flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBackToHome}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl">
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
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.isUser
                      ? "bg-gradient-to-r from-blue-600 to-emerald-600 text-white"
                      : "bg-white/70 backdrop-blur-sm border border-gray-200 text-gray-900"
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

              {/* Property Cards */}
              {message.hasPropertyCards && message.properties && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4 mb-6">
                  {message.properties.map((property) => (
                    <div key={property.id} className="bg-white/70 backdrop-blur-sm border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300">
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
                          <p className="text-xs font-medium text-gray-700 mb-1">Payment Options:</p>
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
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your response here..."
            className="flex-1 rounded-full border-gray-300 focus:border-blue-500"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white rounded-full px-6"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
