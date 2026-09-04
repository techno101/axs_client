import React from "react";
import Image from "next/image";

export function PaymentBadges({
  title = "Accepted Payment Methods",
  className = "",
}: {
  title?: string;
  className?: string;
}) {
  return (
    <div className={`payment-support ${className}`.trim()}>
      {title ? <p className="payment-support__title">{title}</p> : null}
      <div className="payment-support__badges" aria-label="Supported payment options">
        {/* Visa & Mastercard */}
        <div className="payment-badge" title="Visa & Mastercard (Debit / Credit Cards)">
          <div className="payment-badge__logo-group">
            <span className="payment-badge__logo-pill payment-badge__logo-pill--visa">
              <Image
                src="/images/payments/visa.svg"
                alt="Visa"
                width={36}
                height={12}
                className="payment-badge__logo payment-badge__logo--visa"
              />
            </span>
            <span className="payment-badge__logo-pill payment-badge__logo-pill--mc">
              <Image
                src="/images/payments/mastercard.svg"
                alt="Mastercard"
                width={20}
                height={20}
                className="payment-badge__logo payment-badge__logo--mc"
              />
            </span>
          </div>
          <span className="payment-badge__label">Visa / Mastercard</span>
        </div>

        {/* FPX Online Banking */}
        <div className="payment-badge" title="FPX Online Banking (PayNet Malaysian Banks)">
          <span className="payment-badge__logo-pill payment-badge__logo-pill--fpx">
            <Image
              src="/images/payments/fpx.svg"
              alt="FPX Online Banking"
              width={38}
              height={18}
              className="payment-badge__logo payment-badge__logo--fpx"
            />
          </span>
          <span className="payment-badge__label">FPX Online Banking</span>
        </div>

        {/* DuitNow QR */}
        <div className="payment-badge" title="DuitNow QR (National QR Pay)">
          <span className="payment-badge__logo-pill payment-badge__logo-pill--duitnow">
            <Image
              src="/images/payments/duitnow.svg"
              alt="DuitNow QR"
              width={20}
              height={20}
              className="payment-badge__logo payment-badge__logo--duitnow"
            />
          </span>
          <span className="payment-badge__label">DuitNow QR</span>
        </div>

        {/* Touch 'n Go eWallet */}
        <div className="payment-badge" title="Touch 'n Go eWallet">
          <span className="payment-badge__logo-pill payment-badge__logo-pill--tng">
            <Image
              src="/images/payments/tng.svg"
              alt="Touch 'n Go eWallet"
              width={20}
              height={20}
              className="payment-badge__logo payment-badge__logo--tng"
            />
          </span>
          <span className="payment-badge__label">Touch &apos;n Go eWallet</span>
        </div>
      </div>
    </div>
  );
}
