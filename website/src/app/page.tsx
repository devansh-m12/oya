import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PersonaCard } from '@/components/PersonaCard';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center py-12 px-6">
      <div className="text-center max-w-4xl mx-auto mb-16">
        <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
          OYA - Multi AI Persona
        </h1>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
          Discover personalized AI companions tailored to your needs, from professional guidance to entertainment and beyond.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl w-full px-4">
        {/* Casino Butler Card */}
        <PersonaCard
          image="/butler.webp"
          tags={[
            { label: 'Professional', color: 'blue' },
            { label: 'Gambler', color: 'green' },
            { label: 'Entertaining', color: 'purple' }
          ]}
          rating={{ label: 'Adult (18+)', color: 'red' }}
          title="Casino Butler"
          description="Your sophisticated guide to casino games, strategies, and responsible gambling. Experience the thrill with expert insights."
          link="/butler"
        />

        {/* Professional Advisor Card
        <PersonaCard
          image="https://via.placeholder.com/400x256/4F46E5/FFFFFF?text=Professional+Advisor"
          tags={[
            { label: 'Professional', color: 'indigo' },
            { label: 'Advisor', color: 'yellow' },
            { label: 'Motivational', color: 'teal' }
          ]}
          rating={{ label: 'PG', color: 'green' }}
          title="Professional Advisor"
          description="Get tailored career advice, business strategies, and productivity tips from a seasoned expert."
          link="/professional"
        />

        {/* Kids Tutor Card */}
        {/*<PersonaCard
          image="https://via.placeholder.com/400x256/06B6D4/FFFFFF?text=Kids+Tutor"
          tags={[
            { label: 'Educational', color: 'pink' },
            { label: 'Friendly', color: 'orange' },
            { label: 'Creative', color: 'cyan' }
          ]}
          rating={{ label: 'Kids', color: 'blue' }}
          title="Kids Tutor"
          description="A fun and engaging learning companion that makes education exciting for young minds."
          link="/kids"
        /> */}

        {/* Lara Card */}
        <PersonaCard
          image="/lara.jpeg"
          tags={[
            { label: 'Free Spirit', color: 'indigo' },
            { label: 'Spicy', color: 'cyan' },
            { label: 'Unfiltered', color: 'yello' }
          ]}
          rating={{ label: 'Adult (18+)', color: 'red' }}
          title="Lara Pereona"
          description="A free spirit who speaks her soul and expects you to do the same. Engage in spicy, authentic conversations."
          link="/lara"
        />
      </div>
    </div>
  );
}
