import { useState } from "react";
import Hero from "./components/landing/Hero";
import SystemDiagram from "./components/landing/SystemDiagram";
import Features from "./components/landing/Features";
import CTASection from "./components/landing/CTASection";
import Footer from "./components/landing/Footer";
import SatelliteList from "./components/tracking/SatelliteList";
import OrbitPredictionPage from "./components/tracking/OrbitPredictionPage";

function App() {
  const [currentView, setCurrentView] = useState('landing'); // 'landing' | 'satellite-list' | 'orbit-prediction'
  // eslint-disable-next-line no-unused-vars
  const [selectedSatellite, setSelectedSatellite] = useState(null);

  const handleGetStarted = () => {
    setCurrentView('satellite-list');
  };

  const handleOrbitPrediction = () => {
    setCurrentView('orbit-prediction');
  };

  const handleBackToHome = () => {
    setCurrentView('landing');
    setSelectedSatellite(null);
  };

  const handleSelectSatellite = (satellite) => {
    setSelectedSatellite(satellite);
    // Navigate to orbit prediction view
    setCurrentView('orbit-prediction');
  };

  // Show Orbit Prediction Page
  if (currentView === 'orbit-prediction') {
    return (
      <OrbitPredictionPage onBack={handleBackToHome} />
    );
  }

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
      <Hero onGetStarted={handleGetStarted} onOrbitPrediction={handleOrbitPrediction} />
      <SystemDiagram />
      <Features />
      <CTASection onGetStarted={handleGetStarted} onOrbitPrediction={handleOrbitPrediction} />
      <Footer />
    </div>
  );
}

export default App;