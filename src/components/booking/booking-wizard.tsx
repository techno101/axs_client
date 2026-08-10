"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { SlotCard } from "@/components/booking/slot-card";
import { AlertIcon, ArrowRightIcon, CalendarIcon, CheckIcon, ChevronIcon } from "@/components/ui/icons";
import type {
  AvailabilitySlot,
  BookingBlock,
  Field,
  PublicAddon,
  PublicConfigView,
} from "@/lib/api/types";
import type { VoucherValidation } from "@/lib/api/contract/v1";
import { formatMoney } from "@/lib/format";
import { createHttpPublicClient, PublicApiError } from "@/lib/api/http-client";
import { reportOperationalEvent } from "@/lib/operational-reporting";
import { customerApi, type CustomerSessionView } from "@/lib/customer-api";

type BasketItem = {
  fieldId: string;
  blockCode: string;
  bookingDate: string;
  fieldName: string;
  label: string;
  startsAt: string;
  endsAt: string;
  amountMinor: number;
};

const MAX_SESSIONS = 20;

function addIsoDays(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function displayDate(value: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-MY", { ...options, timeZone: "UTC" }).format(new Date(`${value}T00:00:00.000Z`));
}

type CustomerDetails = {
  name: string;
  phone: string;
  email: string;
  team: string;
};

type BookingWizardProps = {
  fields: Field[];
  blocks: BookingBlock[];
  availability: AvailabilitySlot[];
  addons: PublicAddon[];
  onlinePayment: PublicConfigView["onlinePayment"];
  businessDate: string;
  initialDate: string;
};

export function BookingWizard({ fields, blocks, availability, addons, onlinePayment, businessDate, initialDate }: BookingWizardProps) {
  const client = useMemo(() => createHttpPublicClient(), []);
  const dateOptions = useMemo(() => Array.from({ length: 5 }, (_, index) => {
    const value = addIsoDays(businessDate, index);
    return { value, day: displayDate(value, { weekday: "short" }), date: displayDate(value, { day: "2-digit" }), month: displayDate(value, { month: "short" }), label: index === 0 ? "Today" : displayDate(value, { weekday: "long" }), display: displayDate(value, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) };
  }), [businessDate]);
  const maxDate = useMemo(() => addIsoDays(businessDate, 90), [businessDate]);
  const [phase, setPhase] = useState<"sessions" | "details">("sessions");
  const [date, setDate] = useState(initialDate);
  const [customer, setCustomer] = useState<CustomerDetails>({ name: "", phone: "", email: "", team: "" });
  const [liveAvailability, setLiveAvailability] = useState(availability);
  const [basket, setBasket] = useState<BasketItem[]>([]);
  const [requestState, setRequestState] = useState<"idle" | "booking">("idle");
  const [error, setError] = useState<string | null>(null);
  const [accountPrefill, setAccountPrefill] = useState(false);
  const [addonSelections, setAddonSelections] = useState<Record<string, Record<string, number>>>({});
  const [voucherCode, setVoucherCode] = useState("");
  const [voucher, setVoucher] = useState<VoucherValidation | null>(null);
  const [voucherStatus, setVoucherStatus] = useState<"idle" | "checking" | "applied" | "rejected">("idle");
  const [voucherError, setVoucherError] = useState<string | null>(null);
  const [basketOpen, setBasketOpen] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const basketKey = (item: BasketItem) => `${item.fieldId}-${item.blockCode}-${item.bookingDate}`;
  const selectedDate = dateOptions.find((item) => item.value === date) ?? { value: date, day: displayDate(date, { weekday: "short" }), date: displayDate(date, { day: "2-digit" }), month: displayDate(date, { month: "short" }), label: displayDate(date, { weekday: "long" }), display: displayDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) };
  const addonTotalMinor = Object.entries(addonSelections).reduce((total, [, byAddon]) => total + Object.entries(byAddon).reduce((subtotal, [addonId, quantity]) => subtotal + (addons.find((addon) => addon.id === addonId)?.amountMinor ?? 0) * quantity, 0), 0);
  const sessionTotalMinor = basket.reduce((sum, item) => sum + item.amountMinor, 0);
  const discountMinor = voucher ? Math.round((sessionTotalMinor + addonTotalMinor) * voucher.percentage / 100) : 0;
  const estimatedTotalMinor = Math.max(0, sessionTotalMinor + addonTotalMinor - discountMinor);
  const slotsByField = (fieldId: string) => blocks.filter((item) => item.fieldId === fieldId).map((item) => ({
    block: item,
    status: liveAvailability.find((slot) => slot.fieldId === fieldId && slot.blockId === item.id)?.status ?? "closed",
  }));

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const next = await client.getAvailability(date);
        if (active) {
          setLiveAvailability(next);
          setError(null);
        }
      } catch (refreshError) {
        if (active) setError(refreshError instanceof PublicApiError ? refreshError.message : "Availability could not be refreshed. Check your connection and try again.");
      }
    };
    void refresh();
    const interval = window.setInterval(refresh, 15_000);
    return () => { active = false; window.clearInterval(interval); };
  }, [client, date]);

  useEffect(() => {
    let active = true;
    void customerApi<CustomerSessionView>("session")
      .then(({ account }) => {
        if (!active || account.status !== "active") return;
        setCustomer((current) => ({ ...current, name: current.name || account.displayName, phone: current.phone || account.phone, email: current.email || account.email }));
        setAccountPrefill(true);
      })
      .catch(() => undefined);
    return () => { active = false; };
  }, []);

  const goToDetails = () => {
    setPhase("details");
    window.requestAnimationFrame(() => headingRef.current?.focus());
  };
  const backToSessions = () => {
    setPhase("sessions");
    setBasketOpen(true);
    window.requestAnimationFrame(() => headingRef.current?.focus());
  };

  function toggleSession(item: BasketItem) {
    setError(null);
    const key = basketKey(item);
    const existing = basket.some((candidate) => basketKey(candidate) === key);
    if (!existing && basket.length >= MAX_SESSIONS) {
      setError(`You can book up to ${MAX_SESSIONS} sessions in one order.`);
      return;
    }
    setBasket((current) => existing ? current.filter((candidate) => basketKey(candidate) !== key) : [...current, item]);
    if (existing) {
      setAddonSelections((current) => { const next = { ...current }; delete next[key]; return next; });
      if (voucher && basket.length - 1 < (voucher.minSessionCount ?? 1)) { setVoucher(null); setVoucherStatus("idle"); setVoucherError(null); }
    }
  }

  const submitDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void proceedToPayment();
  };

  async function applyVoucher() {
    const code = voucherCode.trim().toUpperCase();
    if (!code || !basket.length) return;
    setVoucherStatus("checking");
    setVoucherError(null);
    try {
      const result = await client.validateVoucher({ code, sessionCount: basket.length });
      if (!result) { setVoucher(null); setVoucherStatus("rejected"); setVoucherError("That voucher code is not valid for this booking."); return; }
      setVoucher(result);
      setVoucherStatus("applied");
    } catch (voucherError) {
      setVoucher(null);
      setVoucherStatus("rejected");
      setVoucherError(voucherError instanceof PublicApiError ? voucherError.message : "The voucher could not be checked.");
    }
  }

  async function proceedToPayment() {
    if (!basket.length || !onlinePayment.enabled) return;
    setRequestState("booking");
    setError(null);
    try {
      const holdGroup = await client.createHoldGroup({ occurrences: basket.map(({ fieldId, blockCode, bookingDate }) => ({ fieldId, blockCode, bookingDate })) }, crypto.randomUUID());
      const addonsPayload = Object.entries(addonSelections).flatMap(([key, byAddon]) => {
        const item = basket.find((candidate) => basketKey(candidate) === key);
        if (!item) return [];
        return Object.entries(byAddon).filter(([, quantity]) => quantity > 0).map(([addonId, quantity]) => ({ catalogItemId: addonId, fieldId: item.fieldId, blockCode: item.blockCode, bookingDate: item.bookingDate, quantity }));
      });
      const order = await client.createOrder({ holdToken: holdGroup.token, customer: { name: customer.name, phone: customer.phone, email: customer.email, ...(customer.team ? { teamName: customer.team } : {}) }, ...(addonsPayload.length ? { addons: addonsPayload } : {}), ...(voucher ? { voucherCode: voucher.code } : {}) }, crypto.randomUUID());
      if (!order.accessToken) throw new Error("The order response did not include its one-time status handle.");
      window.sessionStorage.setItem(`axs:order:${order.reference}`, order.accessToken);
      window.sessionStorage.setItem(`axs:order-email:${order.reference}`, customer.email ? "present" : "missing");
      const attempt = await client.createOrderPaymentAttempt(order.reference, { method: "online_provider", returnPath: `/booking/result?reference=${encodeURIComponent(order.reference)}` }, crypto.randomUUID());
      if (!attempt.redirectUrl) throw new Error("The payment provider did not return a redirect URL.");
      window.location.assign(attempt.redirectUrl);
    } catch (requestError) {
      const message = requestError instanceof PublicApiError ? requestError.message : requestError instanceof Error ? requestError.message : "Payment could not be started.";
      setError(message);
      reportOperationalEvent({ category: "payment_failure", errorCode: requestError instanceof PublicApiError ? requestError.code : "CHECKOUT_START_FAILED", summary: message, routeOrScreen: "booking" });
      setRequestState("idle");
    }
  }

  return (
    <div className="booking-wizard booking-wizard--simple">
      {onlinePayment.enabled && onlinePayment.environment === "sandbox" ? <div className="booking-live-note booking-live-note--calm" role="status"><AlertIcon /><p><strong>Sandbox checkout — no real payment will be taken.</strong> This non-production booking flow is only for authorised testing.</p></div> : null}

      <div className="booking-phase" role="tablist" aria-label="Booking steps">
        <button className={phase === "sessions" ? "is-current" : "is-complete"} type="button" role="tab" aria-selected={phase === "sessions"} onClick={() => setPhase("sessions")}><span>{phase === "details" ? <CheckIcon /> : "01"}</span><strong>Pick sessions</strong></button>
        <button className={phase === "details" ? "is-current" : ""} type="button" role="tab" aria-selected={phase === "details"} onClick={() => phase === "details" ? undefined : goToDetails()}><span>02</span><strong>Your details</strong></button>
      </div>

      <h2 className="booking-wizard__heading" tabIndex={-1} ref={headingRef}>{phase === "sessions" ? "Pick your sessions" : "Your details"}</h2>
      {error ? <p className="booking-error" role="alert">{error}</p> : null}

      {phase === "sessions" ? (
        <>
          <div className="date-strip" role="group" aria-label="Choose a booking date">
            {dateOptions.map((option) => (
              <button
                className={date === option.value ? "is-selected" : ""}
                type="button"
                key={option.value}
                aria-pressed={date === option.value}
                onClick={() => { setDate(option.value); }}
              >
                <span>{option.day}</span>
                <strong>{option.date}</strong>
                <small>{option.month}</small>
              </button>
            ))}
            <label className="date-picker-button">
              <CalendarIcon />
              <span>Other date</span>
              <input
                aria-label="Choose another date"
                type="date"
                min={businessDate}
                max={maxDate}
                value={date}
                onChange={(event) => { setDate(event.target.value); }}
              />
            </label>
          </div>
          {!onlinePayment.enabled ? <div className="booking-live-note booking-live-note--calm" role="status"><AlertIcon /><p><strong>Online booking is unavailable right now.</strong> {onlinePayment.publicMessage ?? "You can still review fields, sessions and prices."} No session has been reserved.</p></div> : null}
          <div className="field-card-list">
            {fields.map((item) => {
              const slots = slotsByField(item.id);
              return (
                <section className="field-card" key={item.id} aria-labelledby={`field-card-${item.id}`}>
                  <div className="field-card__media">
                    <Image src={item.image} alt={item.imageAlt} fill sizes="(min-width: 900px) 50vw, 100vw" />
                  </div>
                  <div className="field-card__body">
                    <header className="field-card__header">
                      <div><h3 id={`field-card-${item.id}`}>{item.name}</h3><p>{item.surface}</p></div>
                      <p className="field-card__date">{selectedDate.display}</p>
                    </header>
                    <div className="field-card__slots">
                      {slots.map(({ block, status }) => {
                        const key = `${item.id}-${block.id}-${date}`;
                        const selected = basket.some((candidate) => basketKey(candidate) === key);
                        return (
                          <SlotCard
                            key={key}
                            block={block}
                            status={status}
                            fieldName={item.shortName}
                            selected={selected}
                            compact
                            onSelect={status === "available" ? () => toggleSession({ fieldId: item.id, blockCode: block.id, bookingDate: date, fieldName: item.name, label: block.label, startsAt: block.startsAt, endsAt: block.endsAt, amountMinor: block.amountMinor }) : undefined}
                          />
                        );
                      })}
                    </div>
                  </div>
                </section>
              );
            })}
          </div>
          <p className="availability-refresh" role="status">Live availability · refreshes every 15 seconds · Malaysia time · book up to 90 days ahead</p>
        </>
      ) : (
        <form className="booking-details-form" id="booking-details-form" onSubmit={submitDetails}>
          <div className="customer-form__grid">
            <div className="field-control">
              <label htmlFor="customer-name">Full name</label>
              <input id="customer-name" required autoComplete="name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} />
            </div>
            <div className="field-control">
              <label htmlFor="customer-phone">Mobile number</label>
              <input id="customer-phone" required inputMode="tel" autoComplete="tel" placeholder="e.g. 012 345 6789" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} />
            </div>
            <div className="field-control">
              <label htmlFor="customer-email">Email address <span>(optional for guests)</span></label>
              <input id="customer-email" type="email" autoComplete="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} />
            </div>
            <div className="field-control">
              <label htmlFor="customer-team">Team name <span>(optional)</span></label>
              <input id="customer-team" autoComplete="organization" value={customer.team} onChange={(event) => setCustomer({ ...customer, team: event.target.value })} />
            </div>
          </div>
          <p className="privacy-inline">We use these details only to create and manage this booking.{accountPrefill ? " Your saved account contact has been filled in for you." : ""}</p>

          <section className="details-section">
            <h3>Your sessions</h3>
            <ul className="details-basket">
              {basket.map((item) => (
                <li key={basketKey(item)}>
                  <div><strong>{item.fieldName} · {item.label}</strong><small>{displayDate(item.bookingDate, { weekday: "long", day: "numeric", month: "short" })} · {item.startsAt}–{item.endsAt}</small></div>
                  <span>{formatMoney(item.amountMinor)}</span>
                  <button type="button" className="details-basket__remove" onClick={() => toggleSession(item)} aria-label={`Remove ${item.fieldName} ${item.label} on ${item.bookingDate}`}>×</button>
                </li>
              ))}
            </ul>
            <button type="button" className="button button--quiet" onClick={backToSessions}>Add or remove sessions</button>
          </section>

          {addons.length ? (
            <fieldset className="review-step__addons"><legend>Add-ons <small>Optional; choose a quantity for any session</small></legend>{basket.map((item) => { const key = basketKey(item); const byAddon = addonSelections[key] ?? {}; const chosen = addons.filter((addon) => (byAddon[addon.id] ?? 0) > 0); return <div className="review-step__addon-session" key={key}><p>{item.fieldName} · {item.label} · {item.bookingDate}</p>{chosen.length ? <ul>{chosen.map((addon) => <li key={addon.id}>{addon.name} <strong>× {byAddon[addon.id]}</strong> <small>{formatMoney(addon.amountMinor * byAddon[addon.id])}</small></li>)}</ul> : null}<div className="review-step__addon-options">{addons.map((addon) => <label key={addon.id} className="review-step__addon-option"><span><strong>{addon.name}</strong><small>{addon.description || addon.kind} · {formatMoney(addon.amountMinor)}</small></span><select aria-label={`Quantity of ${addon.name} for ${item.label} on ${item.bookingDate}`} value={byAddon[addon.id] ?? 0} onChange={(event) => { const quantity = Number(event.target.value); setAddonSelections((current) => { const next = { ...current, [key]: { ...(current[key] ?? {}), [addon.id]: quantity } }; if (!Object.values(next[key]).some((value) => value > 0)) delete next[key]; return next; }); }}><option value={0}>None</option>{[1, 2, 3, 4, 5].map((quantity) => <option key={quantity} value={quantity}>{quantity}</option>)}</select></label>)}</div></div>; })}</fieldset>
          ) : null}

          <div className="review-step__voucher"><label htmlFor="voucher-code">Voucher code <small>Optional</small><input id="voucher-code" maxLength={32} placeholder="FRIEND10" value={voucherCode} onChange={(event) => { setVoucherCode(event.target.value.toUpperCase()); setVoucher(null); setVoucherStatus("idle"); setVoucherError(null); }} /></label><button className="button button--quiet" type="button" disabled={!voucherCode.trim() || voucherStatus === "checking"} onClick={applyVoucher}>{voucherStatus === "checking" ? "Checking…" : voucherStatus === "applied" ? "Applied" : "Apply"}</button>{voucherError ? <p className="booking-error" role="alert">{voucherError}</p> : voucherStatus === "applied" && voucher ? <p className="review-step__voucher-ok" role="status">{voucher.code} · {voucher.percentage}% off sessions and add-ons</p> : null}</div>

          <dl className="review-step__totals">
            <div><dt>Sessions</dt><dd>{formatMoney(sessionTotalMinor)}</dd></div>
            {addonTotalMinor ? <div><dt>Add-ons</dt><dd>{formatMoney(addonTotalMinor)}</dd></div> : null}
            {discountMinor ? <div><dt>Voucher discount</dt><dd>−{formatMoney(discountMinor)}</dd></div> : null}
            <div className="review-step__total"><dt>Estimated total</dt><dd>{formatMoney(estimatedTotalMinor)}</dd></div>
          </dl>

          {!customer.email ? <div className="booking-live-note booking-live-note--calm" role="alert"><AlertIcon /><p><strong>No email provided.</strong> Copy your booking reference now. Screenshot this page. Save it somewhere safe. Without an email, you cannot recover your booking later.</p></div> : null}
        </form>
      )}

      <div className="booking-bar">
        <button type="button" className="booking-bar__basket" aria-expanded={basketOpen} onClick={() => setBasketOpen((open) => !open)}>
          <span className="booking-bar__count">{basket.length}</span>
          <span className="booking-bar__label">{basket.length ? `${basket.length} session${basket.length === 1 ? "" : "s"}` : "No sessions"}</span>
          <strong>{formatMoney(estimatedTotalMinor)}</strong>
          <ChevronIcon />
        </button>
        {basketOpen ? (
          <ul className="booking-bar__list">
            {basket.map((item) => (
              <li key={basketKey(item)}><span>{item.fieldName} · {item.label} · {item.bookingDate}</span><span>{formatMoney(item.amountMinor)}</span></li>
            ))}
            {!basket.length ? <li>Pick a session above to add it here.</li> : null}
          </ul>
        ) : null}
        {phase === "sessions" ? (
          <button className="button button--primary booking-bar__continue" type="button" disabled={!basket.length || !onlinePayment.enabled} onClick={goToDetails}>{!basket.length ? "Pick a session to continue" : !onlinePayment.enabled ? "Online payment unavailable" : `Continue · ${formatMoney(estimatedTotalMinor)}`} <ArrowRightIcon /></button>
        ) : (
          <div className="booking-bar__actions">
            <button className="button button--quiet" type="button" onClick={backToSessions}>Back</button>
            <button className="button button--primary" type="submit" form="booking-details-form" disabled={!basket.length || requestState !== "idle" || !onlinePayment.enabled}>{requestState === "booking" ? "Creating payment…" : "Proceed to secure payment"} <ArrowRightIcon /></button>
          </div>
        )}
      </div>

      {phase === "sessions" ? (
        <div className="booking-live-note booking-live-note--calm">
          <AlertIcon />
          <p><strong>We check every selected session before payment.</strong> If availability has changed, nothing is reserved and you can choose again. Your field is confirmed only after payment is verified.</p>
        </div>
      ) : null}
    </div>
  );
}
