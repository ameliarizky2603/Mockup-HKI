export interface RoadSegment {
  name: string;
  sub: string;
}

export const CONSTRUCTION_SEGMENTS: RoadSegment[] = [
  { name: 'JTTS Sigli - Banda Aceh', sub: 'Aceh | 74,6 KM' },
  { name: 'JTTS Binjai - Pangkalan Brandan', sub: 'Sumatera Utara | 52,2 KM' },
  { name: 'JTTS Pekanbaru - Dumai', sub: 'Riau | 131,0 KM' },
  { name: 'JTTS Rengat - Lingkar Pekanbaru', sub: 'Riau | 68,0 KM' },
  { name: 'JTTS Bangkinang - Bangkinang', sub: 'Riau | 40,0 KM' },
  { name: 'JTTS Padang - Sicincin', sub: 'Sumatera Barat | 36,6 KM' },
  { name: 'JTTS Junction Palembang', sub: 'Sumatera Selatan | 19,5 KM' },
  { name: 'JTTS Indralaya - Prabumulih', sub: 'Sumatera Selatan | 64,5 KM' },
  { name: 'JTTS Bakauheni - Terbanggi Besar', sub: 'Lampung | 140,0 KM' },
];

export const PLANNING_SEGMENTS: RoadSegment[] = [
  { name: 'JTTS Lubuk Linggau - Curup - Bengkulu', sub: 'Bengkulu | 95,0 KM' },
  { name: 'JTTS Jambi - Rengat', sub: 'Jambi - Riau | 105,0 KM' },
  { name: 'JTTS Betung - Tempino - Jambi', sub: 'Sumatera Selatan - Jambi | 170,0 KM' },
  { name: 'JTTS Bengkulu - Taba Penanjung', sub: 'Bengkulu | 17,6 KM' },
  { name: 'JTTS Belawan - Kuala Tanjung - Tebing Tinggi', sub: 'Sumatera Utara | 85,0 KM' },
  { name: 'JTTS Padang - Bukittinggi - Payakumbuh', sub: 'Sumatera Barat | 117,0 KM' },
  { name: 'JTTS Pematang Panggang - Kayu Agung', sub: 'Sumatera Selatan | 60,0 KM' },
];

export interface MapRoute {
  name: string;
  coords: [number, number][];
  color: string;
  weight: number;
}

export const MAP_ROUTES: MapRoute[] = [
  {
    name: 'JTTS Sigli - Banda Aceh',
    coords: [[5.38, 95.70],[5.28, 95.72],[5.19, 95.74],[5.12, 95.56],[5.07, 95.37]],
    color: '#FFD700', weight: 3
  },
  {
    name: 'JTTS Binjai - Pangkalan Brandan',
    coords: [[3.60, 98.48],[3.75, 98.30],[3.88, 98.10],[3.93, 97.98],[4.00, 97.87]],
    color: '#FFD700', weight: 3
  },
  {
    name: 'JTTS Pekanbaru - Dumai',
    coords: [[0.51, 101.45],[0.79, 101.23],[1.10, 101.07],[1.35, 100.90],[1.55, 100.86],[1.69, 100.77]],
    color: '#FFD700', weight: 3
  },
  {
    name: 'JTTS Rengat - Lingkar Pekanbaru',
    coords: [[0.35, 102.55],[0.42, 102.13],[0.48, 101.80],[0.51, 101.45]],
    color: '#FFD700', weight: 3
  },
  {
    name: 'JTTS Bangkinang - Bangkinang',
    coords: [[0.32, 101.02],[0.40, 101.25],[0.50, 101.44]],
    color: '#FFD700', weight: 3
  },
  {
    name: 'JTTS Padang - Sicincin',
    coords: [[-0.96, 100.35],[-0.80, 100.25],[-0.65, 100.20]],
    color: '#FFD700', weight: 3
  },
  {
    name: 'JTTS Junction Palembang',
    coords: [[-2.92, 104.75],[-2.96, 104.68],[-3.00, 104.60]],
    color: '#FFD700', weight: 3
  },
  {
    name: 'JTTS Indralaya - Prabumulih',
    coords: [[-3.20, 104.65],[-3.32, 104.40],[-3.43, 104.25]],
    color: '#FFD700', weight: 3
  },
  {
    name: 'JTTS Bakauheni - Terbanggi (planning)',
    coords: [[-5.58, 105.55],[-4.90, 105.30],[-4.50, 104.90],[-4.00, 104.70]],
    color: '#FF2020', weight: 3
  },
  {
    name: 'Selesai Beroperasi 1',
    coords: [[3.60, 98.48],[2.50, 99.45],[1.85, 100.23],[1.12, 100.90],[0.51, 101.45]],
    color: '#00CC44', weight: 3
  },
];

export interface MapLocation {
  name: string;
  lat: number;
  lng: number;
  color: string;
}

export const MAP_LOCATIONS: MapLocation[] = [
  { name: 'JTTS Sigli\nBanda Aceh', lat: 5.12, lng: 95.56, color: '#FFD700' },
  { name: 'JTTS Binjai\nPangkalan Brandan', lat: 3.87, lng: 98.10, color: '#FFD700' },
  { name: 'Medan', lat: 3.59, lng: 98.68, color: '#00CC44' },
  { name: 'JTTS Pekanbaru\nDumai', lat: 1.20, lng: 101.05, color: '#FFD700' },
  { name: 'JTTS Rengat\nLingkar Pekanbaru', lat: 0.42, lng: 102.13, color: '#FFD700' },
  { name: 'JTTS Bangkinang\nBangkinang', lat: 0.35, lng: 101.02, color: '#FFD700' },
  { name: 'JTTS Padang\nSicincin', lat: -0.96, lng: 100.35, color: '#FFD700' },
  { name: 'JTTS Junction\nPalembang', lat: -2.96, lng: 104.68, color: '#FFD700' },
  { name: 'JTTS Indralaya\nPrabumulih', lat: -3.32, lng: 104.40, color: '#FFD700' },
  { name: 'Lampung', lat: -5.45, lng: 105.26, color: '#00CC44' },
];
