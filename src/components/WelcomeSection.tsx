
import { Button } from "@/components/ui/button";
import { MessageCircle, Home, MapPin, Calculator } from "lucide-react";

interface WelcomeSectionProps {
  onStartChat: () => void;
}

const WelcomeSection = ({ onStartChat }: WelcomeSectionProps) => {
  return (
    <div className="text-center max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="inline-flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-2xl">
            <Home className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
            AdeLiving
          </h1>
        </div>
        <p className="text-xl text-gray-600 mb-2">
          Your warm, intelligent AI real estate assistant
        </p>
        <p className="text-lg text-gray-500 max-w-2xl mx-auto">
          Making Australian property decisions simple and approachable. Whether you're buying, renting, or just exploring, I'm here to help 24/7! 🏡
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
          <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Find Your Perfect Location</h3>
          <p className="text-gray-600">Get personalized suburb recommendations based on your lifestyle and budget</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
          <Calculator className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Smart Property Guidance</h3>
          <p className="text-gray-600">Learn about mortgages, inspections, and get expert property advice</p>
        </div>
        
        <div className="bg-white/70 backdrop-blur-sm p-6 rounded-2xl border border-gray-200 hover:shadow-lg transition-all duration-300">
          <MessageCircle className="h-12 w-12 text-purple-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">24/7 Conversational Support</h3>
          <p className="text-gray-600">Chat naturally about your property needs and get instant, helpful responses</p>
        </div>
      </div>

      <Button 
        onClick={onStartChat}
        size="lg" 
        className="bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
      >
        <MessageCircle className="mr-2 h-5 w-5" />
        Start Chatting with AdeLiving
      </Button>
    </div>
  );
};

export default WelcomeSection;
