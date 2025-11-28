import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Plane, Train, Car, Ship, Users, Caravan, Bus } from 'lucide-react';
import { TransportMode } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [selectedModes, setSelectedModes] = useState<TransportMode[]>([TransportMode.FLIGHT]);

  const toggleMode = (mode: TransportMode) => {
    setSelectedModes(prev => 
      prev.includes(mode) 
        ? prev.filter(m => m !== mode)
        : [...prev, mode]
    );
  };

  const startPlanning = () => {
    if (selectedModes.length === 0) {
      alert("Bitte wählen Sie mindestens ein Verkehrsmittel aus.");
      return;
    }
    navigate('/search', { state: { modes: selectedModes } });
  };

  const ModeButton = ({ mode, icon: Icon, label }: { mode: TransportMode, icon: any, label: string }) => {
    const isSelected = selectedModes.includes(mode);
    return (
      <button
        onClick={() => toggleMode(mode)}
        className={`flex flex-col items-center p-4 rounded-xl border-2 transition-all duration-200 w-full sm:w-32
          ${isSelected 
            ? 'bg-lanzarote-ocean text-white border-lanzarote-ocean shadow-lg scale-105' 
            : 'bg-white text-gray-500 border-gray-200 hover:border-lanzarote-ocean hover:text-lanzarote-ocean'
          }`}
      >
        <Icon className={`w-8 h-8 mb-2 ${isSelected ? 'text-white' : 'currentColor'}`} />
        <span className="text-sm font-bold">{label}</span>
      </button>
    );
  };

  return (
    <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
      
      <div className="bg-white p-6 rounded-2xl shadow-xl border-2 border-lanzarote-sand max-w-3xl w-full">
        <img 
          src="https://images.unsplash.com/photo-1542981589-32219c2df360?q=80&w=1200&auto=format&fit=crop" 
          alt="Playa de Famara Lanzarote" 
          className="w-full h-48 object-cover rounded-xl mb-6 shadow-sm" 
        />
        <h2 className="text-3xl font-bold text-lanzarote-ocean mb-2">
          Ihr Weg in die Sonne
        </h2>
        <p className="text-xl text-gray-700 leading-relaxed mb-6">
          Womit möchten Sie reisen? Stellen Sie sich Ihren Mix zusammen.
        </p>
        
        {/* Selection Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <ModeButton mode={TransportMode.FLIGHT} icon={Plane} label="Flug" />
          <ModeButton mode={TransportMode.TRAIN} icon={Train} label="Zug" />
          <ModeButton mode={TransportMode.FERRY} icon={Ship} label="Fähre" />
          <ModeButton mode={TransportMode.COACH} icon={Bus} label="Reisebus" />
          <ModeButton mode={TransportMode.RENTAL_CAR} icon={Car} label="Mietwagen" />
          <ModeButton mode={TransportMode.RIDESHARE} icon={Users} label="Mitfahrgeleg." />
          <ModeButton mode={TransportMode.OWN_VEHICLE} icon={Caravan} label="Wohnmobil" />
        </div>

        <Button onClick={startPlanning} fullWidth disabled={selectedModes.length === 0}>
          Reise planen starten
        </Button>
      </div>

      <div className="text-gray-600 max-w-lg">
        <p className="italic">"Weil der Urlaub schon bei der Anreise beginnt."</p>
      </div>
    </div>
  );
};