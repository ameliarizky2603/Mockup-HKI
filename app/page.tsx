'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import DaftarRuas from './components/DaftarRuas';
import ConstructionPanel from './components/ConstructionPanel';
import PlanningPanel from './components/PlanningPanel';
import { useJTTSData } from './hooks/useJTTSData';

// Dynamically import MapPanel with SSR disabled
const MapPanel = dynamic(() => import('./components/MapPanel'), { 
  ssr: false,
  loading: () => <div className="map-col" style={{ background: '#1a2332', display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, minHeight: '200px' }}>Loading Map...</div>
});

export default function Home() {
  const jttsData = useJTTSData();
  const [selectedRouteName, setSelectedRouteName] = useState<string | null>(null);

  if (jttsData.isLoading) {
    return <div style={{ color: 'white', padding: '20px', textAlign: 'center' }}>Loading JTTS Dashboard Data...</div>;
  }

  if (jttsData.error) {
    return <div style={{ color: 'red', padding: '20px', textAlign: 'center' }}>Error loading data: {jttsData.error}</div>;
  }

  return (
    <>
      {/* TOP NAV */}
      <div className="topnav">
        <span className="topnav-title">Dashboard Geospasial</span>
        <span className="topnav-menu">☰</span>
      </div>

      {/* MAIN */}
      <div className="main">
        {/* LEFT: MAP + LEGEND + DAFTAR */}
        <div className="map-col">
          <MapPanel routes={jttsData.mapRoutes} locations={jttsData.mapLocations} selectedRouteName={selectedRouteName} />
          <DaftarRuas allSegments={jttsData.allSegments} onSelect={(name) => setSelectedRouteName(name)} />
        </div>

        {/* RIGHT: PANELS */}
        <div className="right-col">
          <ConstructionPanel 
            segments={jttsData.constructionSegments} 
            stats={jttsData.constructionStats} 
            totalLength={jttsData.totalLength} 
            onSelect={(name) => setSelectedRouteName(name)}
          />
          <PlanningPanel 
            segments={jttsData.planningSegments} 
            stats={jttsData.planningStats} 
            onSelect={(name) => setSelectedRouteName(name)}
          />
        </div>
      </div>
    </>
  );
}
