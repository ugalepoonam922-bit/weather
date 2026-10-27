import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Layers, Wind, CloudRain, RotateCcw } from 'lucide-react';

export default function RadarMapModal({ isOpen, onClose, cityName = 'New Delhi' }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [frame, setFrame] = useState(0);
  const [activeLayer, setActiveLayer] = useState('precipitation'); // 'precipitation' | 'wind'

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % 6);
    }, 1200);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  const frameLabels = ['-2h 00m', '-1h 30m', '-1h 00m', '-0h 30m', 'Now', '+0h 30m (Nowcast)'];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="radar-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Doppler Radar and Satellite View"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <CloudRain size={20} className="text-primary" />
            <h3 className="modal-title">Live Doppler Radar & Satellite Nowcast</h3>
          </div>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close radar view">
            <X size={20} />
          </button>
        </div>

        <div className="radar-view-body">
          {/* Layer Selector Bar */}
          <div className="radar-layer-bar">
            <button
              className={`layer-btn ${activeLayer === 'precipitation' ? 'active' : ''}`}
              onClick={() => setActiveLayer('precipitation')}
            >
              <CloudRain size={16} /> Precipitation Radar (dBZ)
            </button>
            <button
              className={`layer-btn ${activeLayer === 'wind' ? 'active' : ''}`}
              onClick={() => setActiveLayer('wind')}
            >
              <Wind size={16} /> Surface Wind Streamlines
            </button>
          </div>

          {/* Simulated Interactive Radar Screen */}
          <div className="radar-screen">
            {/* Base Geographic Grid */}
            <div className="radar-grid-lines" />

            {/* Radar Sweep Animation */}
            <div className={`radar-sweep-beam ${isPlaying ? 'sweeping' : ''}`} />

            {/* Simulated Radar Storm Cells */}
            <div className={`radar-cell cell-1 frame-${frame}`} />
            <div className={`radar-cell cell-2 frame-${frame}`} />
            <div className={`radar-cell cell-3 frame-${frame}`} />

            {/* India Key Met Stations */}
            <div className="radar-station st-delhi active-pin">
              <span className="station-dot" />
              <span className="station-name">New Delhi</span>
            </div>
            <div className="radar-station st-mumbai">
              <span className="station-dot" />
              <span className="station-name">Mumbai</span>
            </div>
            <div className="radar-station st-kolkata">
              <span className="station-dot" />
              <span className="station-name">Kolkata</span>
            </div>
            <div className="radar-station st-chennai">
              <span className="station-dot" />
              <span className="station-name">Chennai</span>
            </div>
            <div className="radar-station st-nagpur">
              <span className="station-dot" />
              <span className="station-name">Nagpur Radar</span>
            </div>

            {/* Live Indicator Overlay */}
            <div className="radar-overlay-tag">
              <span className="radar-live-dot" />
              <span>IMD DWR Network • 500km Range</span>
            </div>

            {/* dBZ Reflectivity Legend */}
            <div className="radar-legend-bar">
              <span className="legend-label">Light (15 dBZ)</span>
              <div className="legend-gradient" />
              <span className="legend-label">Severe Storm (65 dBZ)</span>
            </div>
          </div>

          {/* Animation Timeline Controls */}
          <div className="radar-controls-card">
            <button
              className="radar-play-btn"
              onClick={() => setIsPlaying(!isPlaying)}
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} />}
            </button>

            <div className="radar-timeline">
              <div className="timeline-ticks">
                {frameLabels.map((lbl, idx) => (
                  <button
                    key={lbl}
                    className={`timeline-step ${frame === idx ? 'active' : ''}`}
                    onClick={() => {
                      setFrame(idx);
                      setIsPlaying(false);
                    }}
                  >
                    <span className="step-point" />
                    <span className="step-time">{lbl}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              className="radar-reset-btn"
              onClick={() => setFrame(4)}
              title="Jump to current time"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
