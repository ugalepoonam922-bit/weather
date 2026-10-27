import React, { useState } from 'react';
import { AlertTriangle, ShieldAlert, ChevronDown, ChevronUp, Bell, CheckCircle } from 'lucide-react';

export default function AlertsBanner({ activeAlert, onDismiss, onToggleSimulatedAlert, isSimulated }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!activeAlert) {
    return (
      <div className="no-alert-banner">
        <div className="no-alert-content">
          <CheckCircle size={16} className="text-emerald" />
          <span>No active severe weather warnings for this sector (All clear)</span>
        </div>
        <button
          className="simulate-alert-btn"
          onClick={onToggleSimulatedAlert}
          title="Simulate IMD Common Alerting Protocol (CAP) Warning"
        >
          <Bell size={12} /> Test Alert Protocol
        </button>
      </div>
    );
  }

  const severityClass = `alert-severity-${activeAlert.severity || 'orange'}`;

  return (
    <section className="alerts-section" aria-label="Official Weather Alerts">
      <div className={`alert-card ${severityClass}`}>
        <div className="alert-header" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="alert-icon-col">
            <ShieldAlert size={24} className="alert-bell-icon" />
          </div>

          <div className="alert-meta-col">
            <div className="alert-badge-row">
              <span className={`alert-pill ${activeAlert.severity}`}>
                {activeAlert.severity?.toUpperCase()} ALERT
              </span>
              <span className="alert-source-tag">Source: {activeAlert.source || 'IMD CAP System'}</span>
              {isSimulated && <span className="simulated-tag">SIMULATED TEST</span>}
            </div>
            <h4 className="alert-title">{activeAlert.title}</h4>
            <p className="alert-validity">
              Valid until: <strong>{activeAlert.validUntil}</strong> • Region: {activeAlert.area}
            </p>
          </div>

          <button className="expand-alert-btn" aria-label="Expand alert details">
            {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="alert-expanded-body">
            <div className="alert-desc-box">
              <p className="alert-full-desc">{activeAlert.description}</p>
            </div>

            {activeAlert.precautions && (
              <div className="alert-precautions-box">
                <span className="precautions-title">Recommended Safety Measures:</span>
                <ul className="precautions-list">
                  {activeAlert.precautions.map((p, i) => (
                    <li key={i}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="alert-actions-row">
              <button
                className="dismiss-alert-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onDismiss();
                }}
              >
                Dismiss from Homepage
              </button>
              {isSimulated && (
                <button
                  className="reset-alert-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleSimulatedAlert();
                  }}
                >
                  Turn Off Simulation
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
