'use client';

import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { MapRoute, MapLocation } from '../hooks/useJTTSData';

interface Props {
  routes: MapRoute[];
  locations: MapLocation[];
  selectedRouteName?: string | null;
}

const MapPanel: React.FC<Props> = ({ routes, locations, selectedRouteName }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<maplibregl.Map | null>(null);
  const [active360, setActive360] = useState<MapRoute | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const viewerRef = useRef<any>(null);
  // Store route references for click handler
  const routesRef = useRef<MapRoute[]>(routes);
  routesRef.current = routes;

  // Initialize map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstance.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemap.mapid.io/styles/dark/style.json?key=67aacc7e051d92f468af03c4',
      center: [102.5, 1.5],
      zoom: 4.5,
      attributionControl: false
    });

    // Add attribution
    map.addControl(new maplibregl.AttributionControl({ compact: true }), 'bottom-right');

    // Add zoom control
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'bottom-right');

    map.on('load', () => {
      setMapLoaded(true);
    });

    // Suppress "missing image" warnings from basemap by adding dummy transparent image
    map.on('styleimagemissing', (e) => {
      const id = e.id;
      if (!map.hasImage(id)) {
        const width = 1;
        const height = 1;
        const data = new Uint8Array(width * height * 4); // transparent pixel
        map.addImage(id, { width, height, data });
      }
    });

    // Prevent native browser drag
    mapContainerRef.current.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });

    mapInstance.current = map;

    return () => {
      map.remove();
      mapInstance.current = null;
      setMapLoaded(false);
    };
  }, []);

  // Add routes and locations after map loads
  useEffect(() => {
    const map = mapInstance.current;
    if (!map || !mapLoaded) return;

    // Add route sources and layers
    routes.forEach((r, i) => {
      const sourceId = `route-${i}`;
      const layerId = `route-line-${i}`;

      // coords are stored as [lat, lng] from useJTTSData, convert to [lng, lat] for MapLibre
      const coordinates = r.coords.map(c => [c[1], c[0]]);

      if (map.getSource(sourceId)) return; // Already added

      map.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: r.name, routeIndex: i },
          geometry: {
            type: 'LineString',
            coordinates
          }
        }
      });

      map.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        paint: {
          'line-color': r.color,
          'line-width': 6,
          'line-opacity': 0.8
        },
        layout: {
          'line-cap': 'round',
          'line-join': 'round'
        }
      });

      // Hover effects
      map.on('mouseenter', layerId, () => {
        map.getCanvas().style.cursor = 'pointer';
        map.setPaintProperty(layerId, 'line-width', 10);
        map.setPaintProperty(layerId, 'line-opacity', 1);
      });

      map.on('mouseleave', layerId, () => {
        map.getCanvas().style.cursor = '';
        map.setPaintProperty(layerId, 'line-width', 6);
        map.setPaintProperty(layerId, 'line-opacity', 0.8);
      });

      // Tooltip popup on hover
      const popup = new maplibregl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'route-tooltip'
      });

      map.on('mousemove', layerId, (e) => {
        popup
          .setLngLat(e.lngLat)
          .setHTML(`<div style="font-size:11px;font-weight:600;color:#fff;padding:2px 4px;">${r.name}</div>`)
          .addTo(map);
      });

      map.on('mouseleave', layerId, () => {
        popup.remove();
      });

      // Click to open 360
      map.on('click', layerId, (e) => {
        e.originalEvent.stopPropagation();
        setActive360(routesRef.current[i]);
      });
    });

    // Add location markers
    locations.forEach(loc => {
      // Circle dot marker
      const dotEl = document.createElement('div');
      dotEl.style.cssText = `
        width: 10px; height: 10px;
        background: ${loc.color};
        border: 1.5px solid #fff;
        border-radius: 50%;
        pointer-events: none;
        user-select: none;
      `;

      new maplibregl.Marker({ element: dotEl })
        .setLngLat([loc.lng, loc.lat])
        .addTo(map);

      // Text label
      const labelEl = document.createElement('div');
      labelEl.style.cssText = `
        color: #fff; font-size: 9px; font-weight: 600;
        background: rgba(0,0,0,0.55);
        padding: 1px 3px; border-radius: 2px;
        white-space: nowrap;
        user-select: none; pointer-events: none;
      `;
      labelEl.setAttribute('draggable', 'false');
      labelEl.textContent = loc.name.replace('\n', ' ');

      new maplibregl.Marker({ element: labelEl, anchor: 'top-left', offset: [8, -8] })
        .setLngLat([loc.lng, loc.lat])
        .addTo(map);
    });

  }, [mapLoaded, routes, locations]);

  // Fly to selected route
  useEffect(() => {
    const map = mapInstance.current;
    if (!selectedRouteName || !map || !mapLoaded) return;

    const targetRoute = routes.find(r => r.name === selectedRouteName);
    if (targetRoute && targetRoute.coords.length > 0) {
      const coordinates = targetRoute.coords.map(c => [c[1], c[0]] as [number, number]);
      const bounds = coordinates.reduce(
        (b, coord) => b.extend(coord as maplibregl.LngLatLike),
        new maplibregl.LngLatBounds(coordinates[0], coordinates[0])
      );
      map.fitBounds(bounds, { padding: 50, duration: 1500 });
    }
  }, [selectedRouteName, routes, mapLoaded]);

  // Pannellum 360 viewer
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
    <div id="map-wrapper" style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div id="map-container" ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
      <button className="map-close">✕</button>

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
  );
};

export default MapPanel;
