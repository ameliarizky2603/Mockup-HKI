import React from 'react';
import { RoadSegment } from '../hooks/useJTTSData';

interface Props {
  allSegments: RoadSegment[];
  onSelect?: (name: string) => void;
}

const DaftarRuas: React.FC<Props> = ({ allSegments, onSelect }) => {
  const getPhaseSegments = (phase: number) => allSegments.filter(s => s.tahap === phase);

  const colClasses = {
    1: 'col-blue',
    2: 'col-green',
    3: 'col-orange',
    4: 'col-red'
  };

  return (
    <div className="daftar-section">
      <div className="daftar-title">Daftar Ruas JTTS</div>
      <div className="map-legend" style={{ flexDirection: 'row', gap: '15px', padding: '6px 14px', borderBottom: '1px solid var(--border-color)', borderTop: 'none' }}>
        <div className="legend-item"><div className="legend-line" style={{ background: '#FFD700' }}></div>On Going Konstruksi</div>
        <div className="legend-item"><div className="legend-line" style={{ background: '#FFA500' }}></div>Tahap Konstruksi Lanjutan</div>
        <div className="legend-item"><div className="legend-line" style={{ background: '#FF2020' }}></div>Tahap Perencanaan</div>
        <div className="legend-item"><div className="legend-line" style={{ background: '#00CC44' }}></div>Selesai Beroperasi</div>
      </div>
      <div className="daftar-grid">
        {[1, 2, 3, 4].map(phase => (
          <div key={phase} className="daftar-col">
            <div className={`daftar-col-title ${colClasses[phase as keyof typeof colClasses]}`}>Ruas Tahap {phase}</div>
            <div className="daftar-list-wrapper">
              <ul>
                {getPhaseSegments(phase).length > 0 ? (
                  getPhaseSegments(phase).map((s, idx) => (
                    <li key={idx} style={{ cursor: 'pointer' }} onClick={() => onSelect?.(s.name)}>
                      {s.name.replace('JTTS ', '')}
                    </li>
                  ))
                ) : (
                  <li style={{ color: '#555', listStyle: 'none', paddingLeft: 0 }}>Tidak ada ruas</li>
                )}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DaftarRuas;
