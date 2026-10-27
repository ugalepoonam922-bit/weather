import React, { useState } from 'react';
import { X, Share2, Copy, Check, MessageSquare, Send } from 'lucide-react';
import { generateShareableReport } from '../services/weatherService';

export default function ShareWeatherModal({ isOpen, onClose, weather, cityName, unit = 'C' }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !weather) return null;

  const reportText = generateShareableReport(weather, cityName, unit);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(reportText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="share-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Share Weather Bulletin"
      >
        <div className="modal-header">
          <div className="modal-title-group">
            <Share2 size={20} className="text-primary" />
            <h3 className="modal-title">Share Weather Bulletin</h3>
          </div>
          <button className="close-modal-btn" onClick={onClose} aria-label="Close share dialog">
            <X size={20} />
          </button>
        </div>

        <div className="share-body">
          <p className="share-desc">
            Copy or share this live weather summary directly to WhatsApp, Telegram, or family & work groups:
          </p>

          <div className="share-preview-box">
            <pre className="share-preview-text">{reportText}</pre>
          </div>

          <div className="share-action-buttons">
            <button className="share-primary-btn whatsapp-btn" onClick={handleWhatsAppShare}>
              <MessageSquare size={16} /> Share via WhatsApp
            </button>
            <button className={`share-secondary-btn ${copied ? 'copied' : ''}`} onClick={handleCopy}>
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied to Clipboard!' : 'Copy Text'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
