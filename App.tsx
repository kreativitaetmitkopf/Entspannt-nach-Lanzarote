import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Header } from './components/Header';
import { Home } from './pages/Home';
import { Search } from './pages/Search';
import { Results } from './pages/Results';
import { BookingDetails } from './pages/BookingDetails';
import { SearchParams } from './types';

export default function App() {
  const [searchParams, setSearchParams] = useState<SearchParams | null>(null);

  return (
    <HashRouter>
      <div className="min-h-screen bg-lanzarote-sand font-sans text-lanzarote-text selection:bg-lanzarote-ocean selection:text-white">
        <Header />
        
        <main className="p-4 md:p-8 max-w-7xl mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route 
              path="/search" 
              element={<Search setSearchParams={setSearchParams} />} 
            />
            <Route 
              path="/results" 
              element={<Results searchParams={searchParams} />} 
            />
             <Route 
              path="/booking" 
              element={<BookingDetails />} 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        
        <footer className="text-center p-8 text-gray-500 text-sm">
          <p>© 2024 Entspannt nach Lanzarote - Best Ager</p>
        </footer>
      </div>
    </HashRouter>
  );
}