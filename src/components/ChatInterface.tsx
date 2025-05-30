
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

    // Generate AdeLiving's response using NLP
    setTimeout(() => {
      const response = generateSmartResponse(inputValue);
      const aiMessage: Message = {
        id: messages.length + 2,
        text: response,
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);
    }, 1000);

    setInputValue("");
  };

  const generateSmartResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Location-specific queries
    if (input.includes("adelaide")) {
      if (input.includes("under") && (input.includes("700") || input.includes("$700"))) {
        return "Great choice focusing on Adelaide! 🏡 For houses under $700k, I'd recommend looking at these fantastic suburbs:\n\n• **Woodville West & Seaton** ($450k-$580k) - Great value, close to beach\n• **Salisbury & Parafield Gardens** ($500k-$650k) - Family-friendly with good schools\n• **Morphett Vale & Hackham** ($520k-$680k) - Growing areas with new developments\n• **Munno Para & Angle Vale** ($480k-$650k) - Newer housing estates\n\nWould you like me to tell you more about any of these areas, or do you have specific requirements like number of bedrooms or proximity to work/schools?";
      }
      if (input.includes("glenelg")) {
        return "Glenelg is absolutely beautiful! 🌊 It's one of Adelaide's premium beachside suburbs. Here's what living there is like:\n\n**Lifestyle:** Beach living at its finest - morning walks on the sand, great cafes, and the famous Glenelg Jetty. Very touristy in summer but quieter in winter.\n\n**Property Prices:** Houses $800k-$1.5M+, apartments $400k-$800k\n\n**Transport:** Excellent - direct tram to Adelaide CBD (30 mins)\n\n**Dining & Entertainment:** Jetty Road has amazing restaurants, pubs, and the historic Stamford Grand hotel\n\nAre you looking to buy or rent in Glenelg? And what's your budget range?";
      }
      return "Adelaide is a fantastic city for property! 🏡 Known for affordable housing compared to Sydney/Melbourne, great lifestyle, and excellent wine regions nearby. Which specific area of Adelaide interests you, and are you looking to buy or rent?";
    }

    if (input.includes("melbourne")) {
      if (input.includes("families") || input.includes("family")) {
        return "Melbourne has some absolutely brilliant family suburbs! 👨‍👩‍👧‍👦 Here are my top recommendations:\n\n**Inner East (Premium):**\n• Camberwell, Hawthorn, Kew - Top schools, parks, $1M+\n\n**Outer East (Value):**\n• Ringwood, Croydon, Lilydale - Great schools, $600k-$900k\n\n**North:**\n• Eltham, Diamond Creek - Bushland feel, good schools, $700k-$1.2M\n\n**West:**\n• Williamstown, Yarraville - Character homes, cafes, $800k-$1.5M\n\n**South East:**\n• Berwick, Pakenham - New estates, family-friendly, $500k-$800k\n\nWhat's your budget range and do you prefer established suburbs or new developments?";
      }
      if (input.includes("student") || input.includes("students")) {
        return "Perfect! Melbourne is Australia's student capital! 🎓 Here are the best rental suburbs for students:\n\n**Near Universities:**\n• **Carlton/Parkville** - Near UniMelb, $180-$250/week rooms\n• **Clayton** - Near Monash, $150-$220/week\n• **Footscray** - Near VU, affordable $140-$200/week\n• **Brunswick/Fitzroy** - Hip areas, $200-$280/week\n\n**Budget-Friendly Options:**\n• **Sunshine, St Albans** - $120-$180/week\n• **Reservoir, Preston** - $160-$220/week\n\n**Transport Tips:** Get a student myki card for discounted public transport!\n\nWhich university will you be attending? I can give more specific suburb recommendations!";
      }
      return "Melbourne's property market is diverse and exciting! 🏙️ From trendy inner-city apartments to family homes in leafy suburbs. Are you looking for a specific area, budget range, or lifestyle (student, family, professional)?";
    }

    if (input.includes("sydney")) {
      if (input.includes("good time") || input.includes("right now") || input.includes("market")) {
        return "Sydney's market is complex right now! 📈 Here's my honest assessment:\n\n**Current Conditions:**\n• Prices have stabilized after recent declines\n• Interest rates are affecting borrowing capacity\n• Good selection of properties available\n• Less competition than 2020-2021 peak\n\n**Pros of buying now:**\n• More negotiating power\n• Less rushed decisions\n• Better choice of properties\n\n**Considerations:**\n• Interest rates may change\n• Some areas still expensive\n• Economic uncertainty\n\n**My advice:** If you've found the right property, can comfortably afford repayments, and plan to stay 5+ years, it could be a good time. Avoid FOMO - buy when it suits YOUR situation.\n\nWhat's your budget and preferred areas? I can give more specific market insights!";
      }
      return "Sydney's property market is premium but offers incredible lifestyle! 🌉 Prices are high but you get world-class beaches, harbor, and career opportunities. Are you looking at specific areas or price ranges?";
    }

    if (input.includes("brisbane")) {
      if (input.includes("gold coast") && input.includes("apartment")) {
        return "Great comparison! Both cities offer fantastic apartment living! 🏢\n\n**Brisbane 2BR Apartments:**\n• **South Bank/CBD:** $500k-$800k, city lifestyle, river views\n• **New Farm/Teneriffe:** $600k-$900k, trendy, close to everything\n• **Kangaroo Point:** $450k-$700k, great value, city views\n\n**Gold Coast 2BR Apartments:**\n• **Surfers Paradise:** $400k-$700k, beach lifestyle, tourism-focused\n• **Broadbeach:** $500k-$900k, sophisticated dining, quieter than Surfers\n• **Burleigh Heads:** $600k-$1M+, trendy, best beaches\n\n**Key Differences:**\n• Brisbane: Better job market, cultural scene, river lifestyle\n• Gold Coast: Beach living, tourism-based, more relaxed\n\nAre you looking for investment or owner-occupier? That changes the equation significantly!";
      }
      if (input.includes("west end")) {
        return "West End is brilliant for young professionals! 🎯 Here's the real scoop:\n\n**Safety:** Generally very safe, well-lit streets, good foot traffic. Like any inner-city area, stay aware at night but it's quite secure.\n\n**Lifestyle for Young Professionals:**\n• **Amazing cafes:** Blackstar Coffee, Gunshop Cafe\n• **Great bars:** Archive Beer Boutique, Catchment Brewing\n• **Easy commute:** 10 mins to CBD by bus/CityCycle\n• **Cultural scene:** GOMA, markets, live music\n• **Foodie paradise:** Boundary Street restaurants\n\n**Rental Prices:** $400-$600/week for 1BR, $500-$800/week for 2BR\n\n**Community:** Very diverse, artsy, progressive vibe - perfect for young professionals wanting culture and convenience!\n\nAre you looking to rent or buy in West End?";
      }
      return "Brisbane is booming! 🌴 Great lifestyle, more affordable than Sydney/Melbourne, and excellent growth potential. Which areas interest you most?";
    }

    if (input.includes("perth")) {
      if (input.includes("under") && input.includes("500")) {
        return "Perth has great rental value! 🏡 Under $500/week gives you excellent options:\n\n**Inner Suburbs ($400-$500/week):**\n• **Inglewood, Mount Lawley** - Character homes, close to city\n• **Victoria Park, Burswood** - Great cafes, river proximity\n\n**Coastal Areas ($350-$480/week):**\n• **Fremantle** - Historic port city, weekend markets\n• **Cockburn, Hamilton Hill** - Beach access, more affordable\n\n**Northern Suburbs ($300-$450/week):**\n• **Joondalup, Wanneroo** - Family-friendly, newer developments\n• **Madeley, Landsdale** - Great value, growing areas\n\n**What you get for $500/week:** Usually 3BR house or quality 2BR apartment\n\nAny specific requirements like proximity to work, schools, or lifestyle preferences?";
      }
      return "Perth offers fantastic value! 🌅 Great beaches, relaxed lifestyle, and very affordable compared to east coast. What type of property are you seeking?";
    }

    // Property type comparisons
    if (input.includes("townhouse") && input.includes("house")) {
      return "Excellent question! Let me break down the key differences: 🏘️\n\n**Standalone House Pros:**\n• More privacy and space\n• Usually larger backyard\n• No body corporate fees\n• Complete control over renovations\n• Generally better capital growth\n\n**Townhouse Pros:**\n• Lower maintenance (shared costs)\n• Often newer with modern features\n• Usually more affordable entry price\n• Security of gated communities\n• Shared amenities (pools, gyms)\n\n**Consider This:**\n• **Maintenance:** Houses = you fix everything; Townhouses = shared costs\n• **Lifestyle:** Do you want a big garden or low maintenance?\n• **Budget:** Townhouses often $100k-$200k less\n• **Future:** Planning for family growth?\n\nWhat's your lifestyle priority - space and privacy, or convenience and lower maintenance?";
    }

    // First home buyer advice
    if (input.includes("first home") || (input.includes("first") && input.includes("buy"))) {
      return "Exciting times ahead! 🎉 Here's your first home buyer roadmap:\n\n**1. Financial Preparation:**\n• Save 5-20% deposit (less with First Home Loan Deposit Scheme)\n• Budget for stamp duty, legal fees, inspections ($15k-$30k+)\n• Get pre-approval to know your borrowing limit\n\n**2. Government Help Available:**\n• First Home Owner Grant ($10k-$25k depending on state)\n• First Home Loan Deposit Scheme (5% deposit)\n• Stamp duty concessions\n\n**3. Essential Steps:**\n• Research suburbs thoroughly\n• Get building/pest inspections\n• Use a buyer's agent if overwhelmed\n• Don't rush - the right property will come\n\n**4. Common Mistakes to Avoid:**\n• Borrowing maximum amount\n• Skipping inspections\n• Emotional decisions\n• Not factoring in ongoing costs\n\nWhat's your current situation - do you have savings ready, or still in planning stage?";
    }

    // Mortgage and finance queries
    if (input.includes("deposit") && (input.includes("need") || input.includes("much"))) {
      return "Great question! Here's the deposit breakdown: 💰\n\n**Standard Options:**\n• **20% deposit:** Avoid LMI (Lenders Mortgage Insurance), best rates\n• **10-19% deposit:** Pay LMI but still get good rates\n• **5-9% deposit:** Higher LMI, some lender restrictions\n\n**First Home Buyer Schemes:**\n• **FHLDS:** Just 5% deposit, government guarantees rest\n• **Guarantor loans:** Parents help, potentially 0% deposit\n\n**Example on $600k property:**\n• 20% = $120k deposit + $15k costs = $135k needed\n• 10% = $60k deposit + $25k (LMI + costs) = $85k needed\n• 5% = $30k deposit + $30k (LMI + costs) = $60k needed\n\n**My advice:** Aim for 10-20% if possible, but don't wait years if you can service a loan with 5-10%. Market timing matters too!\n\nWhat's your target property price range?";
    }

    if (input.includes("mortgage") && (input.includes("explain") || input.includes("work"))) {
      return "I'll explain mortgages in simple terms! 🏦\n\n**What's a Mortgage?**\nA loan secured by the property you're buying. The bank lends you money, you pay it back over 25-30 years with interest.\n\n**Key Components:**\n• **Principal:** The actual loan amount\n• **Interest:** What the bank charges (currently 5-7%)\n• **Repayments:** Usually monthly, covers principal + interest\n\n**Example:** $500k loan at 6% over 30 years = ~$3,000/month\n\n**Types Available:**\n• **Variable rate:** Changes with market (flexibility to pay extra)\n• **Fixed rate:** Locked rate for 1-5 years (certainty)\n• **Split loan:** Part fixed, part variable\n\n**Approval Process:**\n1. Application with income/expense details\n2. Bank values property\n3. Final approval and settlement\n\n**Key Point:** Banks assess if you can afford repayments based on income, expenses, and a buffer for rate rises.\n\nDo you want me to explain any specific part in more detail?";
    }

    // Legal and process questions
    if (input.includes("off the plan")) {
      return "Off the plan means buying before construction is complete! 🏗️\n\n**How it Works:**\n• You buy from plans/display suite\n• Pay 10% deposit, settle when built (12-24 months)\n• Price locked in at today's rates\n\n**Advantages:**\n• Get in before price rises\n• Choose your preferred location/floor\n• Everything brand new with warranties\n• Stamp duty often on land value only\n\n**Risks to Consider:**\n• Delays in construction\n• Final product may vary slightly\n• Market could drop before completion\n• Can't inspect actual property\n\n**Protection Available:**\n• Sunset clauses (can exit if major delays)\n• Building warranties\n• Legal contracts with specifications\n\n**My Advice:** Only buy off reputable developers, understand all contract terms, and ensure you can still afford at completion. Great for investors and buyers who want new properties!\n\nAre you considering a specific development?";
    }

    if (input.includes("under contract")) {
      return "'Under contract' means someone has made an offer that's been accepted! 📝\n\n**What This Means:**\n• The property is sold (pending settlement)\n• No more offers are being considered\n• Buyer has cooling-off period (usually 5 business days)\n• Still possible it could fall through\n\n**Common Reasons Contracts Fall Through:**\n• Buyer can't get finance approval\n• Building inspection reveals major issues\n• Buyer changes mind during cooling-off\n• Legal/title issues discovered\n\n**If You're Interested:**\n• Ask agent to put you on backup list\n• Keep looking at other properties\n• Don't wait around - most proceed successfully\n\n**Timeline:**\n• Contract signed → Settlement (usually 30-90 days)\n• Property officially sold at settlement\n\n**For Buyers:** Once under contract, focus on finance approval, inspections, and legal review during your cooling-off period!\n\nWere you interested in a specific property that's gone under contract?";
    }

    // Rental-specific queries
    if (input.includes("documents") && input.includes("rent")) {
      return "Here's everything you need for rental applications! 📋\n\n**Essential Documents:**\n• **Photo ID:** Driver's license or passport\n• **Proof of Income:** Last 3 payslips or employment letter\n• **Bank statements:** Last 3 months\n• **References:** Previous landlord + character references\n• **Rental history:** If you've rented before\n\n**Additional Items:**\n• **Rental resume:** Summary of your rental history\n• **Pet references:** If you have pets\n• **Guarantor information:** If required\n\n**Pro Tips for Strong Applications:**\n• Apply immediately after inspections\n• Include a cover letter introducing yourself\n• Dress well for inspections\n• Have all documents ready to submit instantly\n• Offer to pay bond immediately\n\n**What Landlords Want:**\n• Reliable income (rent ≤ 30% of income)\n• Good rental history\n• Clean, responsible tenants\n• Long-term stability\n\nAre you preparing for applications now, or just getting ready?";
    }

    if (input.includes("lease") && (input.includes("check") || input.includes("signing"))) {
      return "Smart to check before signing! Here are the key lease terms to review: ⚖️\n\n**Critical Clauses:**\n• **Rent amount & payment dates:** Confirm weekly/monthly amounts\n• **Lease length:** 6/12 months typical\n• **Bond amount:** Usually 4 weeks rent\n• **Pet policy:** Allowed pets and any fees\n• **Maintenance responsibilities:** Who fixes what\n\n**Red Flags to Avoid:**\n• Excessive rent increase clauses\n• Unreasonable maintenance charges to tenant\n• Restrictions on visitors/guests\n• Breaking lease penalties that seem unfair\n• Missing property condition report\n\n**Before Signing:**\n• Do thorough property inspection\n• Test all appliances, taps, lights\n• Document any existing damage\n• Understand your state's tenant rights\n• Get everything in writing\n\n**Key Rights (vary by state):**\n• Reasonable notice for inspections\n• Right to quiet enjoyment\n• Bond protection through government schemes\n\nWhich state are you renting in? Laws vary between states!";
    }

    // Negotiation and costs
    if (input.includes("negotiate") && input.includes("price")) {
      return "Absolutely! Negotiation is normal in Australian property! 💬\n\n**When You Can Negotiate:**\n• Property been on market 30+ days\n• Motivated sellers (relocating, upgrading)\n• Quiet market periods\n• Properties needing work\n• Your offer has strong conditions (quick settlement, cash)\n\n**How Much to Offer:**\n• Start 5-10% below asking (more if overpriced)\n• Research recent comparable sales\n• Consider property condition and market\n\n**Negotiation Tips:**\n• Make written offers through agent\n• Be respectful but firm\n• Justify your price with evidence\n• Be prepared to walk away\n• Consider other terms (settlement date, inclusions)\n\n**What Else You Can Negotiate:**\n• Include furniture/appliances\n• Earlier/later settlement\n• Repairs before settlement\n• Agent commission (if buying direct)\n\n**Market Reality:** In hot markets, expect to pay closer to asking. In slower markets, 5-15% discounts possible.\n\nWhat type of property are you looking to negotiate on?";
    }

    if (input.includes("hidden costs") || input.includes("extra costs")) {
      return "Great question! Here are the costs many buyers forget: 💸\n\n**Upfront Costs (2-5% of price):**\n• **Stamp duty:** $15k-$50k+ depending on state/price\n• **Legal/conveyancing:** $1,200-$2,500\n• **Building inspection:** $400-$800\n• **Pest inspection:** $300-$500\n• **Loan application fees:** $300-$600\n\n**If Borrowing 80%+:**\n• **Lenders Mortgage Insurance:** $2k-$30k+\n\n**Ongoing Costs (Often Forgotten):**\n• **Council rates:** $1,500-$4,000/year\n• **Water rates:** $800-$1,500/year\n• **Strata fees:** $2,000-$8,000/year (apartments/townhouses)\n• **Insurance:** $1,000-$3,000/year\n• **Maintenance:** 1-3% of property value annually\n\n**First Year Extras:**\n• Moving costs, utility connections\n• Immediate repairs/improvements\n• Garden/maintenance equipment\n\n**Budget Rule:** Add 20-25% to your purchase price for all costs in year one!\n\nWhat's your target purchase price? I can estimate your total costs!";
    }

    // Default helpful response
    return "I'd love to help you with that! 😊 Could you tell me a bit more about what specifically you're looking for? For example:\n\n• Are you looking to buy or rent?\n• Which city or area interests you?\n• What's your budget range?\n• Any specific requirements (bedrooms, lifestyle needs)?\n\nThe more details you share, the better I can tailor my advice to your situation! What's your main property goal right now? 🏡";
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
