import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { TravelOption } from '../types';
import { Button } from '../components/Button';
import { ExternalLink, ArrowLeft, CheckCircle, Info, Map as MapIcon, Heart } from 'lucide-react';

export const BookingDetails: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const option = location.state?.option as TravelOption;

  if (!option) {
    return <Navigate to="/results" replace />;
  }

  const handleBookClick = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in pb-20">
      <Button variant="outline" onClick={() => navigate(-1)} className="flex items-center gap-2 py-2 px-4 text-base">
        <ArrowLeft className="w-5 h-5" /> Zurück zur Auswahl
      </Button>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border-t-8 border-lanzarote-ocean">
        <div className="p-8 bg-lanzarote-sky">
          <h2 className="text-3xl font-bold text-lanzarote-ocean mb-2">Ihre Reisebuchung</h2>
          <p className="text-xl text-gray-700 font-bold">{option.title}</p>
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-600">
            <span className="px-3 py-1 bg-white rounded-full border border-gray-200">Dauer: {option.duration}</span>
            <span className="px-3 py-1 bg-white rounded-full border border-gray-200">Preis ca.: {option.priceEstimate}</span>
          </div>
        </div>

        <div className="p-8 space-y-8">
          
          {/* Transparency / Affiliate Disclosure */}
          <div className="bg-green-50 p-5 rounded-xl border border-green-200 flex flex-col sm:flex-row gap-4 items-start shadow-sm">
             <div className="p-3 bg-white rounded-full text-green-600 shadow-sm shrink-0">
               <Heart className="w-6 h-6 fill-current" />
             </div>
             <div>
               <h4 className="font-bold text-green-800 text-lg mb-1">Gutes tun mit Ihrer Reise</h4>
               <p className="text-green-800 text-sm md:text-base leading-relaxed">
                 Diese App ist für Sie kostenlos. Wenn Sie über die Buttons "Zum Angebot" buchen, erhalten wir vom Anbieter teilweise eine kleine Provision. 
                 <strong>Für Sie bleibt der Preis gleich!</strong> Mit dieser Unterstützung helfen Sie unserem Verein, dieses Angebot für Best Ager weiterzuführen.
               </p>
             </div>
          </div>

          <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 flex gap-3">
            <Info className="w-6 h-6 text-orange-600 shrink-0" />
            <p className="text-orange-800 text-sm md:text-base">
              <strong>Hinweis:</strong> Die Links führen direkt zu den Anbietern. Prüfen Sie bitte vor der Zahlung dort noch einmal das genaue Datum.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">Ihre Buchungs-Checkliste</h3>
          
          <div className="space-y-6">
            {option.bookingSteps.map((step, index) => {
              const isNavigation = step.isNavigation;
              return (
                <div 
                  key={index} 
                  className={`flex flex-col md:flex-row gap-6 p-6 border-2 rounded-xl transition-colors ${isNavigation ? 'border-lanzarote-ocean bg-[#5e6d5a]/5' : 'border-gray-100 hover:border-lanzarote-ocean'}`}
                >
                  <div className="flex-shrink-0">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold shadow-md ${isNavigation ? 'bg-white text-lanzarote-ocean border-2 border-lanzarote-ocean' : 'bg-lanzarote-ocean text-white'}`}>
                      {isNavigation ? <MapIcon className="w-6 h-6" /> : (index + 1)}
                    </div>
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <h4 className="text-xl font-bold text-gray-800">{step.stepTitle}</h4>
                    <p className="text-gray-600">{step.description}</p>
                    <div className={`text-sm font-semibold inline-block px-3 py-1 rounded-lg ${isNavigation ? 'text-white bg-lanzarote-ocean' : 'text-lanzarote-ocean bg-stone-100'}`}>
                      {isNavigation ? 'Navigation' : `Anbieter: ${step.providerName}`}
                    </div>
                  </div>

                  <div className="flex items-center">
                     <Button 
                        onClick={() => handleBookClick(step.bookingUrl)} 
                        className={`whitespace-nowrap flex items-center gap-2 shadow-lg ${isNavigation ? 'bg-lanzarote-ocean hover:bg-[#4a5647]' : ''}`}
                      >
                        {isNavigation ? 'Route öffnen' : 'Zum Angebot'} <ExternalLink className="w-5 h-5" />
                     </Button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="pt-8 text-center space-y-4">
             <h4 className="font-bold text-gray-700">Alles erledigt?</h4>
             <p className="text-gray-600">Wir wünschen Ihnen eine entspannte Reise nach Lanzarote!</p>
             <div className="flex justify-center text-green-600">
               <CheckCircle className="w-12 h-12" />
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};