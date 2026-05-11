'use client';

import { useState, useEffect } from 'react';

// API Feature Properties
export interface FeatureProperties {
  nama_ruas: string;
  provinsi: string;
  kategori: string;
  tahap: number;
  panjang_km: number;
  prg_konst: number;
  prg_lahan: number;
  prg_fs: number;
  prg_bd: number;
  "360 Panorama Photo"?: string;
}

export interface GeoFeature {
  type: string;
  id: string;
  geometry: {
    type: string;
    coordinates: number[][];
  };
  properties: FeatureProperties;
}

export interface GeoFeatureCollection {
  type: string;
  features: GeoFeature[];
}

// Mapped UI types
export interface RoadSegment {
  name: string;
  sub: string;
  kategori: string;
  tahap: number;
  panjang_km: number;
}

export interface MapRoute {
  name: string;
  coords: [number, number][]; // [lat, lng]
  color: string;
  weight: number;
  photo360?: string;
  properties: FeatureProperties;
}

export interface Stats {
  totalRuas: number;
  totalPanjang: number;
  avgKonstruksi: number;
  avgLahan: number;
  avgFS: number;
  avgBD: number;
}

export interface MapLocation {
  name: string;
  lat: number;
  lng: number;
  color: string;
}

export interface JTTSData {
  isLoading: boolean;
  error: string | null;
  constructionSegments: RoadSegment[];
  planningSegments: RoadSegment[];
  allSegments: RoadSegment[];
  mapRoutes: MapRoute[];
  mapLocations: MapLocation[];
  constructionStats: Stats;
  planningStats: Stats;
  totalLength: number;
}

export function useJTTSData(): JTTSData {
  const [data, setData] = useState<JTTSData>({
    isLoading: true,
    error: null,
    constructionSegments: [],
    planningSegments: [],
    allSegments: [],
    mapRoutes: [],
    mapLocations: [],
    constructionStats: { totalRuas: 0, totalPanjang: 0, avgKonstruksi: 0, avgLahan: 0, avgFS: 0, avgBD: 0 },
    planningStats: { totalRuas: 0, totalPanjang: 0, avgKonstruksi: 0, avgLahan: 0, avgFS: 0, avgBD: 0 },
    totalLength: 0
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('https://geoserver.mapid.io/layers_new/get_layer?api_key=e4ea050aba33477bbbacda6d15deaa4f&layer_id=69fda61469f94898a49d50e9&project_id=69c9ea71e4fe4912fb09edd5');
        if (!res.ok) throw new Error('Failed to fetch data');
        const json: GeoFeatureCollection = await res.json();

        let totalLength = 0;
        const constructionSegments: RoadSegment[] = [];
        const planningSegments: RoadSegment[] = [];
        const allSegments: RoadSegment[] = [];
        const mapRoutes: MapRoute[] = [];
        const mapLocations: MapLocation[] = [];

        let cPanjang = 0, cKonst = 0, cLahan = 0, cFS = 0, cBD = 0;
        let pPanjang = 0, pKonst = 0, pLahan = 0, pFS = 0, pBD = 0;

        json.features.forEach(f => {
          const props = f.properties;
          const segment: RoadSegment = {
            name: props.nama_ruas,
            sub: `${props.provinsi} | ${props.panjang_km.toFixed(1).replace('.', ',')} KM`,
            kategori: props.kategori,
            tahap: Number(props.tahap),
            panjang_km: props.panjang_km
          };
          
          allSegments.push(segment);
          totalLength += props.panjang_km;

          // Categorize
          if (props.kategori === 'On Going Konstruksi') {
            constructionSegments.push(segment);
            cPanjang += props.panjang_km;
            cKonst += props.prg_konst;
            cLahan += props.prg_lahan;
            cFS += props.prg_fs;
            cBD += props.prg_bd;
          } else if (props.kategori === 'Tahap Perencanaan') {
            planningSegments.push(segment);
            pPanjang += props.panjang_km;
            pKonst += props.prg_konst;
            pLahan += props.prg_lahan;
            pFS += props.prg_fs;
            pBD += props.prg_bd;
          }

          // Map Route
          let color = '#FFD700'; // default
          if (props.kategori === 'On Going Konstruksi') color = '#FFD700';
          else if (props.kategori === 'Tahap Konstruksi Lanjutan') color = '#FFA500';
          else if (props.kategori === 'Tahap Perencanaan') color = '#FF2020';
          else if (props.kategori === 'Selesai Beroperasi') color = '#00CC44';

          const coords: [number, number][] = f.geometry.coordinates.map(c => [c[1], c[0]]); // GeoJSON is [lng, lat] -> Leaflet needs [lat, lng]
          mapRoutes.push({
            name: props.nama_ruas,
            coords,
            color,
            weight: 3,
            photo360: props["360 Panorama Photo"],
            properties: props
          });

          // Pick the middle coordinate for the label
          const midPoint = coords[Math.floor(coords.length / 2)];
          if (midPoint) {
            mapLocations.push({
              name: props.nama_ruas.replace('JTTS ', ''), // Shorten name
              lat: midPoint[0],
              lng: midPoint[1],
              color
            });
          }
        });

        // Averages
        const cCount = constructionSegments.length || 1;
        const pCount = planningSegments.length || 1;

        setData({
          isLoading: false,
          error: null,
          constructionSegments,
          planningSegments,
          allSegments,
          mapRoutes,
          mapLocations,
          totalLength,
          constructionStats: {
            totalRuas: constructionSegments.length,
            totalPanjang: cPanjang,
            avgKonstruksi: cKonst / cCount,
            avgLahan: cLahan / cCount,
            avgFS: cFS / cCount,
            avgBD: cBD / cCount
          },
          planningStats: {
            totalRuas: planningSegments.length,
            totalPanjang: pPanjang,
            avgKonstruksi: pKonst / pCount,
            avgLahan: pLahan / pCount,
            avgFS: pFS / pCount,
            avgBD: pBD / pCount
          }
        });

      } catch (err: any) {
        setData(prev => ({ ...prev, isLoading: false, error: err.message }));
      }
    }

    fetchData();
  }, []);

  return data;
}
