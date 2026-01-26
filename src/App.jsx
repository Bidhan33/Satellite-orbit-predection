import { useState } from "react";
import Hero from "./components/landing/Hero";
import SystemDiagram from "./components/landing/SystemDiagram";
import Features from "./components/landing/Features";
import CTASection from "./components/landing/CTASection";
import Footer from "./components/landing/Footer";
import SatelliteList from "./components/tracking/SatelliteList";

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'satellite-list' | 'tracking'
  // eslint-disable-next-line no-unused-vars
  const [selectedSatellite, setSelectedSatellite] = useState(null);

  const handleGetStarted = () => {
    setCurrentView('satellite-list');
  };

  const handleBackToHome = () => {
    setCurrentView('landing');
    setSelectedSatellite(null);
  };

  const handleSelectSatellite = (satellite) => {
    setSelectedSatellite(satellite);
    // TODO: Navigate to detailed tracking view
    console.log('Selected satellite:', satellite);
  };

  // Show Satellite List
  if (currentView === 'satellite-list') {
    return (
      <SatelliteList 
        onBack={handleBackToHome}
        onSelectSatellite={handleSelectSatellite}
      />
    );
  }

  // Show Landing Page
  return (
    <div className="selection:bg-[#8b5cf6] selection:text-white">
      <Hero onGetStarted={handleGetStarted} />
      <SystemDiagram />
      <Features />
      <CTASection onGetStarted={handleGetStarted} />
      <Footer />
    </div>
  );
}

export default App;