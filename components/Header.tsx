import React from 'react';
import { Sun } from 'lucide-react';

// Wir definieren das Bild jetzt hier im Header
const BASE_URL = "https://nywbtjnupnrwxahqeilx.supabase.co/storage/v1/object/sign";
const FILE_PATH = "Entspannt nach Lanzarote/WhatsApp Image 2025-07-19 at 11.24.21_8e0c1630.jpg";
const TOKEN = "eyJraWQiOiJzdG9yYWdlLXVybC1zaWduaW5nLWtleV9hMGU1OWJlNC0zNjM5LTQyM2UtODZmZC0yYzBhNGIwODE1MWYiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJFbnRzcGFubnQgbmFjaCBMYW56YXJvdGUvV2hhdHNBcHAgSW1hZ2UgMjAyNS0wNy0xOSBhdCAxMS4yNC4yMV84ZTBjMTYzMC5qcGciLCJpYXQiOjE3NjU3MTEyNTYsImV4cCI6NDkxOTMxMTI1Nn0.k81ySb1fTXtg8w-HFXn2LFx_q0PIABTD_V01xbIbAAE";

const HEADER_IMAGE_URL = `${BASE_URL}/${encodeURI(FILE_PATH)}?token=${TOKEN}`;
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1473163928189-364b2c4e1135?q=80&w=2070&auto=format&fit=crop";

export const Header: React.FC = () => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = FALLBACK_IMAGE;
    e.currentTarget.onerror = null;
  };

  return (
    <header className="relative bg-lanzarote-ocean text-white shadow-md overflow-hidden">
      {/* Hintergrundbild Container - Schlankes Format (h-48 mobil, h-64 desktop) */}
      <div className="absolute inset-0 w-full h-full">
        <img 
          src={HEADER_IMAGE_URL} 
          onError={handleImageError}
          alt="Lanzarote Hintergrund" 
          className="w-full h-full object-cover object-center"
        />
        {/* Dunkler Overlay-Verlauf für bessere Textlesbarkeit */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60 backdrop-blur-[1px]"></div>
      </div>

      {/* Inhalt (liegt über dem Bild dank relative z-10) */}
      <div className="relative z-10 w-full h-48 md:h-64 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex items-center gap-3 mb-2 animate-fade-in">
          <Sun className="w-12 h-12 text-yellow-300 drop-shadow-lg" />
        </div>
        <h1 className="text-3xl md:text-5xl font-bold tracking-wide text-white drop-shadow-md font-sans">
          Entspannt nach Lanzarote
        </h1>
        <p className="mt-2 text-lg md:text-xl text-gray-100 font-medium drop-shadow-md max-w-2xl">
          Ihr Wegweiser für eine stressfreie Reise in die Sonne
        </p>
      </div>
    </header>
  );
};