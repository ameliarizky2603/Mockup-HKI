import React from 'react';
import { Play } from 'lucide-react';
import { RoadSegment, Stats } from '../hooks/useJTTSData';

interface Props {
  segments: RoadSegment[];
  stats: Stats;
  onSelect?: (name: string) => void;
}

const PlanningPanel: React.FC<Props> = ({ segments, stats, onSelect }) => {
  return (
    <>
      <div className="section-header sh-red">Perencanaan Jalan Tol</div>
      <div className="perencanaan-body">
        <div className="rencana-list-panel" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="rencana-list-title">Ruas Perencanaan</div>
          <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
            <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, overflowY: 'auto' }}>
              {segments.map((segment, idx) => (
                <div key={idx} className="rencana-item" onClick={() => onSelect?.(segment.name)}>
                  <Play className="rencana-arrow" size={10} fill="currentColor" />
                  <div>
                    <div className="rencana-name">{segment.name}</div>
                    <div className="rencana-sub">{segment.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rencana-stats">
          <div className="rencana-cards-row" style={{ flex: 1 }}>
            <div className="rencana-card">
              <div className="rencana-card-label">Perencanaan On Going</div>
              <div className="rencana-card-num">{stats.totalRuas}</div>
              <div className="rencana-card-sub">Ruas</div>
            </div>
            <div className="rencana-card">
              <div className="rencana-card-label">Total Panjang</div>
              <div className="rencana-card-num" style={{ fontSize: '22px' }}>{stats.totalPanjang.toFixed(1).replace('.', ',')}</div>
              <div className="rencana-card-sub">KM</div>
            </div>
          </div>

          <div className="prog-rencana-panel">
            <div className="prog-rencana-title">Progress Perencanaan</div>
            <div className="prog-bar-row">
              <div className="prog-bar-label">Progres_FS</div>
              <div className="prog-bar-track"><div className="prog-bar-fill" style={{ width: `${stats.avgFS}%`, background: '#c62828' }}></div></div>
              <div className="prog-bar-val">{stats.avgFS.toFixed(0)}%</div>
            </div>
            <div className="prog-bar-row">
              <div className="prog-bar-label">Progres_BD</div>
              <div className="prog-bar-track"><div className="prog-bar-fill" style={{ width: `${stats.avgBD}%`, background: '#c62828' }}></div></div>
              <div className="prog-bar-val">{stats.avgBD.toFixed(0)}%</div>
            </div>
            {/* The following are hardcoded or 0 since API doesn't provide them */}
            <div className="prog-bar-row">
              <div className="prog-bar-label">Progres_RTA</div>
              <div className="prog-bar-track"><div className="prog-bar-fill" style={{ width: '0%', background: '#c62828' }}></div></div>
              <div className="prog-bar-val">0%</div>
            </div>
            <div className="prog-bar-row">
              <div className="prog-bar-label">Progres_AMDAL</div>
              <div className="prog-bar-track"><div className="prog-bar-fill" style={{ width: '0%', background: '#8b0000' }}></div></div>
              <div className="prog-bar-val">0%</div>
            </div>
            <div className="prog-bar-row">
              <div className="prog-bar-label">Progres_DPPT</div>
              <div className="prog-bar-track"><div className="prog-bar-fill" style={{ width: '0%', background: '#8b0000' }}></div></div>
              <div className="prog-bar-val">0%</div>
            </div>
            <div className="prog-bar-row">
              <div className="prog-bar-label">Progres_ANDALALIN</div>
              <div className="prog-bar-track"><div className="prog-bar-fill" style={{ width: '0%', background: '#8b0000' }}></div></div>
              <div className="prog-bar-val">0%</div>
            </div>
            <div className="prog-axis">
              <span>0%</span><span>50%</span><span>100%</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlanningPanel;
