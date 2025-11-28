import React from 'react';
import { Sun } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-lanzarote-ocean text-white p-6 shadow-md sticky top-0 z-50">
      <div className="max-w-4xl mx-auto flex items-center justify-center gap-3">
        <Sun className="w-10 h-10 text-yellow-300" />
        <h1 className="text-2xl md:text-3xl font-bold tracking-wide">Entspannt nach Lanzarote</h1>
      </div>
    </header>
  );
};