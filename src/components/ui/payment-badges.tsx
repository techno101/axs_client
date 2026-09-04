import React from "react";

export function PaymentBadges({ title = "Accepted Payment Methods", className = "" }: { title?: string; className?: string }) {
  return (
    <div className={`payment-support ${className}`}>
      {title ? <p className="payment-support__title">{title}</p> : null}
      <div className="payment-support__badges" aria-label="Supported payment options">
        <div className="payment-badge" title="Debit & Credit Cards (Visa, Mastercard)">
          <span className="payment-badge__icon payment-badge__icon--card">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </span>
          <span className="payment-badge__label">Visa / Mastercard</span>
        </div>

        <div className="payment-badge" title="FPX Online Banking">
          <span className="payment-badge__icon payment-badge__icon--fpx">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="3" y1="21" x2="21" y2="21" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <polyline points="5 6 12 3 19 6" />
              <line x1="4" y1="10" x2="4" y2="21" />
              <line x1="20" y1="10" x2="20" y2="21" />
              <line x1="8" y1="14" x2="8" y2="17" />
              <line x1="12" y1="14" x2="12" y2="17" />
              <line x1="16" y1="14" x2="16" y2="17" />
            </svg>
          </span>
          <span className="payment-badge__label">FPX Online Banking</span>
        </div>

        <div className="payment-badge" title="DuitNow QR">
          <span className="payment-badge__icon payment-badge__icon--duitnow">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </span>
          <span className="payment-badge__label">DuitNow QR</span>
        </div>

        <div className="payment-badge" title="Touch 'n Go eWallet">
          <span className="payment-badge__icon payment-badge__icon--tng">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <rect x="2" y="4" width="20" height="16" rx="3" />
              <circle cx="8" cy="12" r="2" />
              <path d="M16 12h.01" />
            </svg>
          </span>
          <span className="payment-badge__label">Touch &apos;n Go eWallet</span>
        </div>
      </div>
    </div>
  );
}
