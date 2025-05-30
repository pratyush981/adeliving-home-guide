
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
}

interface ChatInterfaceProps {
  onBackToHome: () => void;
}

const ChatInterface = ({ onBackToHome }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "G'day! I'm AdeLiving, your friendly AI real estate assistant! 😊 I'm here to help you navigate the Australian property market with confidence. Are you looking to buy, rent, or just exploring your options?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AdeLiving's response
    setTimeout(() => {
      const responses = getAdeLivingResponse(inputValue);
      const aiMessage: Message = {
        id: messages.length + 2,
        text: responses,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputValue("");
  };

  const getAdeLivingResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes("buy") || input.includes("purchase")) {
      return "That's exciting! Buying your first home (or investment property) is a big step! 🏡 To help you find the perfect property, I'd love to know more about what you're looking for:\n\n• What's your budget range?\n• Which cities or suburbs interest you?\n• How many bedrooms do you need?\n• Any specific lifestyle preferences (near schools, transport, cafes)?\n\nI can also explain the buying process, help with mortgage basics, or recommend great suburbs within your budget!";
    }
    
    if (input.includes("rent") || input.includes("rental")) {
      return "Perfect! Renting can be a great option, and I'm here to make the process smooth for you! 🗝️ Let me help you find the ideal rental:\n\n• What's your weekly rent budget?\n• Which areas are you considering?\n• Do you need a specific number of bedrooms?\n• Any must-haves (parking, pet-friendly, furnished)?\n\nI can also share tips for rental inspections, understanding lease agreements, and what to expect during the application process. What would be most helpful?";
    }
    
    if (input.includes("melbourne") || input.includes("sydney") || input.includes("brisbane") || input.includes("adelaide") || input.includes("perth")) {
      return "Great choice of city! Each Australian capital has its own unique character and property market dynamics. 🌟\n\nI'd love to help you explore the best suburbs and understand local market trends. What's drawing you to this city? Are you looking for:\n\n• Family-friendly suburbs with good schools?\n• Trendy inner-city areas with nightlife and cafes?\n• Affordable options with good transport links?\n• Investment opportunities?\n\nTell me about your lifestyle and budget, and I'll recommend some fantastic areas to consider!";
    }
    
    if (input.includes("budget") || input.includes("price") || input.includes("cost")) {
      return "Smart thinking - budget is absolutely key to finding the right property! 💰\n\nDepending on whether you're buying or renting, I can help you:\n\n**For Buying:**\n• Calculate what you can afford based on income\n• Explain deposit requirements and stamp duty\n• Show suburbs within your price range\n\n**For Renting:**\n• Find areas within your weekly budget\n• Explain the 30% income rule\n• Factor in bond and moving costs\n\nWhat's your situation? Are you buying or renting, and what budget range are you working with?";
    }
    
    if (input.includes("suburb") || input.includes("area") || input.includes("neighborhood")) {
      return "Choosing the right suburb is so important - it's about finding your perfect lifestyle match! 🏘️\n\nI can help you compare suburbs based on:\n\n• Property prices and market trends\n• Schools and family amenities\n• Transport links and commute times\n• Local cafes, shopping, and entertainment\n• Safety and community feel\n\nWhich city are you focusing on, and what matters most to you in a suburb? Family life, nightlife, nature, or something else?";
    }

    if (input.includes("inspection") || input.includes("viewing")) {
      return "Property inspections are so important - they're your chance to really get a feel for the place! 🔍\n\nHere are my top inspection tips:\n\n**What to Check:**\n• Water pressure and all taps/appliances\n• Phone reception and internet availability\n• Natural light throughout the day\n• Storage space and room sizes\n• Parking and outdoor areas\n\n**Questions to Ask:**\n• Council rates and strata fees\n• Recent renovations or issues\n• Neighbours and local noise\n\nWould you like specific advice for rental inspections vs buying inspections? They have slightly different focuses!";
    }
    
    // Default friendly response
    return "That's a great question! 😊 I'm here to help with all things property-related in Australia. Whether you're curious about:\n\n• Finding the perfect suburb\n• Understanding the buying/renting process\n• Mortgage and finance basics\n• Property inspection tips\n• Market trends and pricing\n\nI'm happy to chat about any of these topics! What would you like to explore? Feel free to ask me anything - I love helping people make confident property decisions! 🏡";
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
            <div
              key={message.id}
              className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}
            >
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
          ))}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="bg-white/80 backdrop-blur-sm border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex gap-4">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me about properties, suburbs, or anything real estate related..."
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
