import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchParams, TravelOption, TransportMode } from '../types';
import { generateTravelOptions } from '../services/geminiService';
import { Button } from '../components/Button';
import { Plane, Train, Ship, Car, AlertCircle, CheckCircle, ArrowRight, Users, Caravan, Bus } from 'lucide-react';

interface ResultsProps {
  searchParams: SearchParams | null;
}

export const Results: React.FC<ResultsProps> = ({ searchParams }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<TravelOption[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!searchParams) {
      navigate('/search');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await generateTravelOptions(searchParams);
        setOptions(data);
      } catch (err) {
        setError("Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams, navigate]);

  if (loading) {
    return (
      <div className="text-center py-20 px-4">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-lanzarote-ocean mb-8"></div>
        <h2 className="text-3xl font-bold text-lanzarote-ocean mb-4">Einen Moment bitte...</h2>
        <p className="text-xl text-gray-600">
          Unser intelligenter Reiseassistent prüft Ihre gewählten Verkehrsmittel:
        </p>
        <p className="text-lg text-lanzarote-ocean font-bold mt-2">
          {searchParams?.modes.map(m => m.replace('_', ' ')).join(' + ')}
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{error}</h2>
        <Button onClick={() => navigate('/search')}>Neue Suche</Button>
      </div>
    );
  }

  const getIcon = (mode: TransportMode) => {
    switch(mode) {
      case TransportMode.FLIGHT: return <Plane className="w-8 h-8" />;
      case TransportMode.TRAIN: return <Train className="w-8 h-8" />;
      case TransportMode.FERRY: return <Ship className="w-8 h-8" />;
      case TransportMode.RENTAL_CAR: return <Car className="w-8 h-8" />;
      case TransportMode.RIDESHARE: return <Users className="w-8 h-8" />;
      case TransportMode.OWN_VEHICLE: return <Caravan className="w-8 h-8" />;
      case TransportMode.COACH: return <Bus className="w-8 h-8" />;
      default: return <Ship className="w-8 h-8" />;
    }
  };

  const getStressColor = (level: string) => {
    switch(level) {
      case 'Niedrig': return 'bg-green-100 text-green-800 border-green-200';
      case 'Mittel': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hoch': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-xl shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-lanzarote-ocean">Vorschläge für Ihre Reise</h2>
          <p className="text-gray-600">Von {searchParams?.origin} nach Lanzarote</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/search')} className="text-base py-2 px-4">
          Suche ändern
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {options.map((option) => (
          <div key={option.id} className="bg-white rounded-2xl shadow-xl overflow-hidden border-2 border-transparent hover:border-lanzarote-ocean transition-all flex flex-col">
            <div className="bg-lanzarote-sky p-6 border-b border-gray-100">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-white rounded-full text-lanzarote-ocean shadow-sm">
                  {getIcon(option.mode)}
                </div>
                <span className={`px-4 py-1 rounded-full text-sm font-bold border ${getStressColor(option.stressLevel)}`}>
                  Stresslevel: {option.stressLevel}
                </span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 leading-tight min-h-[4rem]">{option.title}</h3>
            </div>
            
            <div className="p-6 flex-1 flex flex-col">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <span className="block text-gray-500 text-sm">Geschätzte Dauer</span>
                  <span className="text-xl font-bold text-gray-800">{option.duration}</span>
                </div>
                <div className="text-right">
                  <span className="block text-gray-500 text-sm">Preis p.P. ca.</span>
                  <span className="text-2xl font-bold text-lanzarote-ocean">{option.priceEstimate}</span>
                </div>
              </div>

              <div className="space-y-4 mb-6 flex-1">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h4 className="font-bold text-gray-700 mb-2">Route:</h4>
                  <p className="text-gray-600 leading-relaxed text-lg">{option.routeDescription}</p>
                </div>

                <div>
                  <h4 className="font-bold text-gray-700 mb-2">Vorteile:</h4>
                  <ul className="space-y-2">
                    {option.pros.map((pro, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-green-700">
                        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="mt-auto pt-4 border-t border-gray-100">
                 <Button 
                    fullWidth 
                    onClick={() => navigate('/booking', { state: { option } })}
                    className="flex items-center justify-center gap-2"
                 >
                   Zur Buchung <ArrowRight className="w-5 h-5" />
                 </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="bg-lanzarote-sand p-6 rounded-xl border border-orange-200">
        <h3 className="font-bold text-lanzarote-volcano mb-2">Hinweis für Best Ager:</h3>
        <p className="text-gray-800">
          Wir haben die Buchungswege so einfach wie möglich für Sie vorbereitet. Im nächsten Schritt können Sie direkt zu den Anbietern springen.
        </p>
      </div>
    </div>
  );
};