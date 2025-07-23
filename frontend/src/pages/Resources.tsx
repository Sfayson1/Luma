import React, { useState } from 'react';
// Import lucide-react icons - if not available, you can replace with your preferred icon library
import { Phone, MessageCircle, Heart, Users, Search, Smartphone, AlertTriangle } from 'lucide-react';

// TypeScript interfaces
interface Resource {
  name: string;
  contact?: string;
  url?: string;
  description: string;
  primary?: boolean;
}

interface ResourceCardProps {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  resources: Resource[];
  isExternal?: boolean;
}

const MentalHealthResources = () => {
  const [showCrisisModal, setShowCrisisModal] = useState(false);

  const crisisResources: Resource[] = [
    {
      name: "988 Suicide & Crisis Lifeline",
      contact: "tel:988",
      description: "Available 24/7 - Call, text, or chat",
      primary: true
    },
    {
      name: "SAMHSA National Helpline",
      contact: "tel:1-800-662-4357",
      description: "1-800-662-HELP (4357) - Treatment referrals"
    },
    {
      name: "The Trevor Project",
      contact: "tel:1-866-488-7386",
      description: "1-866-488-7386 - LGBTQ+ youth crisis support"
    },
    {
      name: "Crisis Text Line",
      contact: "sms:741741",
      description: "Text HOME to 741741"
    }
  ];

  const mentalHealthServices: Resource[] = [
    {
      name: "SAMHSA Treatment Locator",
      url: "https://findtreatment.samhsa.gov/",
      description: "Find mental health and substance abuse treatment"
    },
    {
      name: "MentalHealth.gov",
      url: "https://www.mentalhealth.gov/get-help/immediate-help",
      description: "Government mental health resources"
    },
    {
      name: "NAMI (National Alliance on Mental Illness)",
      url: "https://www.nami.org/help",
      description: "Support groups and local resources"
    }
  ];

  const therapyServices: Resource[] = [
    {
      name: "Psychology Today",
      url: "https://www.psychologytoday.com/us/therapists",
      description: "Search therapists by location and specialty"
    },
    {
      name: "Open Path Psychotherapy",
      url: "https://openpathpsychotherapy.org/",
      description: "Affordable therapy options ($30-$80 per session)"
    },
    {
      name: "BetterHelp",
      url: "https://www.betterhelp.com/",
      description: "Online therapy platform"
    },
    {
      name: "Talkspace",
      url: "https://www.talkspace.com/",
      description: "Text-based therapy services"
    }
  ];

  const digitalTools: Resource[] = [
    {
      name: "Crisis Text Line",
      url: "https://www.crisistextline.org/",
      description: "Free 24/7 crisis support via text"
    },
    {
      name: "Calm",
      url: "https://apps.apple.com/us/app/calm/id571800810",
      description: "Meditation and sleep app"
    },
    {
      name: "Headspace",
      url: "https://www.headspace.com/",
      description: "Mindfulness and meditation"
    },
    {
      name: "TrevorLifeline",
      url: "https://www.thetrevorproject.org/get-help/",
      description: "LGBTQ+ youth support resources"
    }
  ];

  const handleCrisisClick = () => {
    // In a real app, you might want to track this interaction
    
    window.location.href = 'tel:988';
  };

  const ResourceCard: React.FC<ResourceCardProps> = ({ title, icon: Icon, resources, isExternal = false }) => (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <h3 className="text-xl font-light text-gray-800 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
          <Icon className="w-5 h-5 text-purple-500" />
        </div>
        {title}
      </h3>
      <div className="space-y-4">
        {resources.map((resource: Resource, index: number) => (
          <a
            key={index}
            href={resource.url || resource.contact}
            target={isExternal ? "_blank" : undefined}
            rel={isExternal ? "noopener noreferrer" : undefined}
            className="block p-4 bg-gray-50 hover:bg-purple-50 border border-gray-100 hover:border-purple-200 rounded-2xl transition-all duration-300 hover:translate-x-1 group"
          >
            <div className="font-medium text-gray-800 group-hover:text-purple-600 transition-colors">
              {resource.name}
            </div>
            <div className="text-sm text-gray-600 mt-2 font-light leading-relaxed">
              {resource.description}
            </div>
          </a>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-purple-200 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-light text-gray-800 mb-4" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>
            Mental Health <span className="text-purple-400">Resources</span>
          </h1>
          <p className="text-lg text-gray-600 font-light">
            A safe space for support and healing. You are not alone.
          </p>
        </div>

        {/* Crisis Section */}
        <div className="bg-red-50 border border-red-200 rounded-3xl p-8 mb-12 text-center shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <h2 className="text-2xl md:text-3xl font-light text-gray-800">
              Crisis Support
            </h2>
          </div>
          <p className="text-gray-600 text-lg mb-8 font-light leading-relaxed max-w-2xl mx-auto">
            If you're experiencing thoughts of self-harm or are in immediate danger,
            please reach out for help right now. Crisis support is available 24/7.
          </p>
          <button
            onClick={handleCrisisClick}
            className="bg-purple-400 text-white px-8 py-4 rounded-full font-light text-lg hover:bg-purple-500 transition-all duration-300 hover:scale-105 shadow-lg mb-8"
          >
            <Phone className="w-5 h-5 inline mr-2" />
            Call 988 - Crisis Lifeline
          </button>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {crisisResources.slice(1).map((resource: Resource, index: number) => (
              <a
                key={index}
                href={resource.contact}
                className="bg-white border border-gray-200 text-gray-700 p-6 rounded-2xl hover:border-purple-300 hover:shadow-sm transition-all duration-300 block"
              >
                <div className="font-medium text-gray-800 mb-2">{resource.name}</div>
                <div className="text-sm text-gray-600 font-light">{resource.description}</div>
              </a>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <ResourceCard
            title="Crisis Hotlines"
            icon={Phone}
            resources={crisisResources.slice(0, 1)}
            isExternal={false}
          />

          <ResourceCard
            title="Mental Health Services"
            icon={Heart}
            resources={mentalHealthServices}
            isExternal={true}
          />

          <ResourceCard
            title="Find a Therapist"
            icon={Search}
            resources={therapyServices}
            isExternal={true}
          />

          <ResourceCard
            title="Mental Health Apps & Tools"
            icon={Smartphone}
            resources={digitalTools}
            isExternal={true}
          />
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-2xl font-light text-gray-800 mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
              <Heart className="w-5 h-5 text-purple-500" />
            </div>
            A Gentle Reminder
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-gray-700">
            <div className="space-y-6">
              <p className="leading-relaxed font-light">
                <strong className="text-gray-800 font-medium">You matter.</strong> Your feelings are valid, and seeking help is a sign of strength, courage, and self-compassion.
              </p>
              <p className="leading-relaxed font-light">
                <strong className="text-gray-800 font-medium">Recovery is possible.</strong> Many people who have struggled with mental health challenges go on to live fulfilling, meaningful lives.
              </p>
            </div>
            <div className="space-y-6">
              <p className="leading-relaxed font-light">
                <strong className="text-gray-800 font-medium">Professional help works.</strong> Therapy, medication, and other treatments can be highly effective and life-changing.
              </p>
              <p className="leading-relaxed font-light">
                <strong className="text-gray-800 font-medium">You're not alone.</strong> Millions of people experience mental health challenges, and compassionate support is always available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthResources;
