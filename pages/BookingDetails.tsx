import React from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { TravelOption } from '../types';
import { Button } from '../components/Button';
import { ExternalLink, ArrowLeft, CheckCircle, Info } from 'lucide-react';

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
          <div className="bg-orange-50 p-4 rounded-xl border border-orange-200 flex gap-3">
            <Info className="w-6 h-6 text-orange-600 shrink-0" />
            <p className="text-orange-800 text-sm md:text-base">
              <strong>Hinweis:</strong> Wir leiten Sie direkt zu den Anbietern weiter. Da Preise schwanken, prüfen Sie bitte vor der Zahlung noch einmal das genaue Datum.
            </p>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 border-b pb-2">Ihre Buchungs-Checkliste</h3>
          
          <div className="space-y-6">
            {option.bookingSteps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-6 p-6 border-2 border-gray-100 rounded-xl hover:border-lanzarote-ocean transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-lanzarote-ocean text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-md">
                    {index + 1}
                  </div>
                </div>
                
                <div className="flex-1 space-y-3">
                  <h4 className="text-xl font-bold text-gray-800">{step.stepTitle}</h4>
                  <p className="text-gray-600">{step.description}</p>
                  <div className="text-sm font-semibold text-lanzarote-ocean bg-stone-100 inline-block px-3 py-1 rounded-lg">
                    Anbieter: {step.providerName}
                  </div>
                </div>

                <div className="flex items-center">
                   <Button 
                      onClick={() => handleBookClick(step.bookingUrl)} 
                      className="whitespace-nowrap flex items-center gap-2 shadow-lg"
                    >
                      Zum Angebot <ExternalLink className="w-5 h-5" />
                   </Button>
                </div>
              </div>
            ))}
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