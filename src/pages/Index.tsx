
import { useState } from "react";
import WelcomeSection from "@/components/WelcomeSection";
import ChatInterface from "@/components/ChatInterface";
import PropertyShowcase from "@/components/PropertyShowcase";

const Index = () => {
  const [isChatStarted, setIsChatStarted] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      {!isChatStarted ? (
        <div className="container mx-auto px-4 py-8">
          <WelcomeSection onStartChat={() => setIsChatStarted(true)} />
          <PropertyShowcase />
        </div>
      ) : (
        <ChatInterface onBackToHome={() => setIsChatStarted(false)} />
      )}
    </div>
  );
};

export default Index;
