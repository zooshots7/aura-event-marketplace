import Navbar from './components/landing/Navbar';
import Hero from './components/landing/Hero';
import ValueProps from './components/landing/ValueProps';
import HowItWorks from './components/landing/HowItWorks';
import FeaturesDashboard from './components/landing/FeaturesDashboard';
import SocialProof from './components/landing/SocialProof';
import CreatorStats from './components/landing/CreatorStats';
import PricingCTA from './components/landing/PricingCTA';
import Footer from './components/landing/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 selection:text-purple-200 flex flex-col overflow-x-hidden">
      <Navbar />
      <Hero />
      <ValueProps />
      <HowItWorks />
      <FeaturesDashboard />
      <SocialProof />
      <CreatorStats />
      <PricingCTA />
      <Footer />
    </main>
  );
}

