'use client';

import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { MapRoute, MapLocation } from '../hooks/useJTTSData';

interface Props {
  routes: MapRoute[];
  locations: MapLocation[];
  selectedRouteName?: string | null;
}

const MapPanel: React.FC<Props> = ({ routes, locations, selectedRouteName }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const [active360, setActive360] = useState<MapRoute | null>(null);
  const viewerRef = useRef<any>(null);

  useEffect(() => {
    if (selectedRouteName && mapInstance.current) {
      const targetRoute = routes.find(r => r.name === selectedRouteName);
      if (targetRoute && targetRoute.coords.length > 0) {
        const bounds = L.latLngBounds(targetRoute.coords as L.LatLngExpression[]);
        mapInstance.current.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
      }
    }
  }, [selectedRouteName, routes]);

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Initialize map
    const map = L.map(mapRef.current, {
      center: [1.5, 102.5],
      zoom: 5,
      zoomControl: false,
      attributionControl: true
    });

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    // Custom zoom control
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Draw routes
    routes.forEach(r => {
      const poly = L.polyline(r.coords as L.LatLngExpression[], {
        color: r.color,
        weight: 6,
        opacity: 0.8
      }).addTo(map);

      poly.on('mouseover', (e: any) => {
        if (e.target) {
          (e.target as any).setStyle({ weight: 10, opacity: 1 });
        }
      });

      poly.on('mouseout', (e: any) => {
        if (e.target) {
          (e.target as any).setStyle({ weight: 6, opacity: 0.8 });
        }
      });

      poly.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setActive360(r);
      });

      poly.bindTooltip(r.name, { sticky: true });
    });

    // Draw markers
    const markerStyle = (color: string) => ({
      radius: 5,
      fillColor: color,
      color: '#fff',
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.9
    });

    locations.forEach(loc => {
      L.circleMarker([loc.lat, loc.lng], markerStyle(loc.color)).addTo(map);

      const label = L.divIcon({
        className: 'map-label-icon',
        html: `<div style="color:#fff;font-size:9px;font-weight:600;background:rgba(0,0,0,0.55);padding:1px 3px;border-radius:2px;white-space:nowrap;">${loc.name.replace('\n', '<br>')}</div>`,
        iconAnchor: [-8, 8]
      });

      L.marker([loc.lat, loc.lng], { icon: label }).addTo(map);
    });

    mapInstance.current = map;
  }, [routes, locations]);

  // Effect to initialize Pannellum when modal opens
  useEffect(() => {
    if (active360?.photo360) {
      const timer = setTimeout(() => {
        if ((window as any).pannellum) {
          viewerRef.current = (window as any).pannellum.viewer('panorama-360', {
            type: 'equirectangular',
            panorama: active360.photo360,
            autoLoad: true,
            showControls: true
          });
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [active360]);

  return (
    <>
      <div id="map-container" ref={mapRef} style={{ position: 'relative' }}>
        <button className="map-close">✕</button>
        <div className="esri-watermark">Powered by Esri</div>

        {active360 && (
          <div className="modal-overlay" onClick={() => setActive360(null)} style={{
            position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 2000,
            display: 'flex', flexDirection: 'column', padding: '20px'
          }}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{
              backgroundColor: '#111', borderRadius: '8px', overflow: 'hidden',
              display: 'flex', flexDirection: 'column', height: '100%', border: '1px solid #333'
            }}>
              <div className="modal-header" style={{
                padding: '12px 16px', display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', borderBottom: '1px solid #222', background: '#0a0a0a'
              }}>
                <div>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>{active360.name}</div>
                  <div style={{ color: '#888', fontSize: '11px' }}>{active360.properties.provinsi} | {active360.properties.panjang_km} KM</div>
                </div>
                <button onClick={() => setActive360(null)} style={{
                  background: 'none', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer'
                }}>✕</button>
              </div>
              <div style={{ flex: 1, position: 'relative', background: '#000' }}>
                {active360.photo360 ? (
                  <div id="panorama-360" style={{ width: '100%', height: '100%' }}></div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666' }}>
                    Photo 360 tidak tersedia untuk ruas ini
                  </div>
                )}
              </div>
              <div className="modal-footer" style={{
                padding: '12px', background: '#0a0a0a', borderTop: '1px solid #222',
                display: 'flex', gap: '20px'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#aaa', fontSize: '10px', marginBottom: '4px' }}>Progress Konstruksi</div>
                  <div style={{ height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${active360.properties.prg_konst}%`, height: '100%', background: '#3a7bd5' }}></div>
                  </div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ color: '#aaa', fontSize: '10px', marginBottom: '4px' }}>Progress Lahan</div>
                  <div style={{ height: '6px', background: '#222', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${active360.properties.prg_lahan}%`, height: '100%', background: '#00b8b8' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="esri-credit">Esri, TomTom, Garmin, FAO, NOAA, USGS</div>
      <div className="map-legend">
        <div className="legend-item"><div className="legend-line" style={{ background: '#FFD700' }}></div>On Going Konstruksi</div>
        <div className="legend-item"><div className="legend-line" style={{ background: '#FFA500' }}></div>Tahap Konstruksi Lanjutan</div>
        <div className="legend-item"><div className="legend-line" style={{ background: '#FF2020' }}></div>Tahap Perencanaan</div>
        <div className="legend-item"><div className="legend-line" style={{ background: '#00CC44' }}></div>Selesai Beroperasi</div>
      </div>
    </>
  );
};

export default MapPanel;
