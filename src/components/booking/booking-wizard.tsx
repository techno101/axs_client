"use client";

import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import { SlotCard } from "@/components/booking/slot-card";
import { ArrowRightIcon, CalendarIcon, ChevronIcon } from "@/components/ui/icons";
import { PaymentBadges } from "@/components/ui/payment-badges";
import type {
  AvailabilityDaySummary,
  AvailabilitySlot,
  BookingBlock,
  Field,
  PublicAddon,
  PublicConfigView,
} from "@/lib/api/types";
import type { VoucherValidation } from "@/lib/api/contract/v1";
import { formatMoney, formatTimePair12 } from "@/lib/format";
import { availabilityDotLevel } from "@/lib/api/types";
import { createHttpPublicClient, PublicApiError } from "@/lib/api/http-client";
import { reportOperationalEvent } from "@/lib/operational-reporting";
import { customerApi, type CustomerSessionView } from "@/lib/customer-api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

function dateLabel(value: string): string {
  return displayDate(value, { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function toDate(value: string): Date {
  return new Date(`${value}T00:00:00.000Z`);
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
  const railDays = useMemo(() => Array.from({ length: 91 }, (_, index) => {
    const value = addIsoDays(businessDate, index);
    return { value, day: displayDate(value, { weekday: "short" }), date: displayDate(value, { day: "2-digit" }), month: displayDate(value, { month: "short" }), label: index === 0 ? "Today" : displayDate(value, { weekday: "long" }) };
  }), [businessDate]);
  const maxDate = useMemo(() => addIsoDays(businessDate, 90), [businessDate]);
  const [phase, setPhase] = useState<"sessions" | "details">("sessions");
  const [date, setDate] = useState(initialDate);
  const [calendarOpen, setCalendarOpen] = useState(false);
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
  const [chipsSummary, setChipsSummary] = useState<Record<string, AvailabilityDaySummary>>({});
  const [calendarSummary, setCalendarSummary] = useState<Record<string, AvailabilityDaySummary>>({});
  const railRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  /** UTC-safe date key for a calendar-selected Date. */
  function utcDateKey(value: Date): string {
    return `${value.getUTCFullYear()}-${String(value.getUTCMonth() + 1).padStart(2, "0")}-${String(value.getUTCDate()).padStart(2, "0")}`;
  }

  useEffect(() => {
    const chip = railRef.current?.querySelector(`[data-date="${date}"]`);
    if (chip && typeof chip.scrollIntoView === "function") chip.scrollIntoView({ block: "nearest", inline: "center", behavior: "smooth" });
  }, [date]);

  const scrollRail = (delta: number) => {
    railRef.current?.scrollBy({ left: delta * 96, behavior: "smooth" });
  };

  const basketKey = (item: BasketItem) => `${item.fieldId}-${item.blockCode}-${item.bookingDate}`;
  const addonTotalMinor = Object.entries(addonSelections).reduce((total, [, byAddon]) => total + Object.entries(byAddon).reduce((subtotal, [addonId, quantity]) => subtotal + (addons.find((addon) => addon.id === addonId)?.amountMinor ?? 0) * quantity, 0), 0);
  const sessionTotalMinor = basket.reduce((sum, item) => sum + item.amountMinor, 0);
  const discountMinor = voucher ? Math.round((sessionTotalMinor + addonTotalMinor) * voucher.percentage / 100) : 0;
  const estimatedTotalMinor = Math.max(0, sessionTotalMinor + addonTotalMinor - discountMinor);
  const isPastCutoff = (bookingDate: string, startsAt: string) => {
    if (bookingDate < businessDate) return true;
    if (bookingDate === businessDate) {
      const now = new Date();
      const startsAtDate = new Date(`${bookingDate}T${startsAt}:00+08:00`);
      if (startsAtDate.getTime() - now.getTime() < 60 * 60_000) {
        return true;
      }
    }
    return false;
  };

  const slotsByField = (fieldId: string) => blocks.filter((item) => item.fieldId === fieldId).map((item) => {
    const live = liveAvailability.find((slot) => slot.fieldId === fieldId && slot.blockId === item.id);
    let status = live?.status ?? "closed";
    if (status === "available" && isPastCutoff(date, item.startsAt)) {
      status = "past";
    }
    return {
      block: item,
      status,
    };
  });

  useEffect(() => {
    let active = true;
    const refresh = async () => {
      try {
        const next = await client.getAvailability(date);
        if (active) {
          setLiveAvailability(next);
          setError(null);
        }
      } catch {
        if (active) setError("Service temporarily unavailable. We're really sorry about this — please try again in a moment, or email armourxsports@gmail.com.");
      }
    };
    void refresh();
    const interval = window.setInterval(refresh, 15_000);
    return () => { active = false; window.clearInterval(interval); };
  }, [client, date]);

  const dotClass: Record<string, string> = {
    full: "availability-light--full",
    partial: "availability-light--partial",
    none: "availability-light--none",
    past: "availability-light--past",
  };

  useEffect(() => {
    let active = true;
    void client.getAvailabilitySummary(businessDate, addIsoDays(businessDate, 90))
      .then((days) => { if (active) setChipsSummary(Object.fromEntries(days.map((day) => [day.date, day]))); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [client, businessDate]);

  useEffect(() => {
    if (!calendarOpen) return;
    let active = true;
    const [year, month] = date.split("-").map(Number);
    const first = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const last = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    void client.getAvailabilitySummary(first, last)
      .then((days) => { if (active) setCalendarSummary(Object.fromEntries(days.map((day) => [day.date, day]))); })
      .catch(() => undefined);
    return () => { active = false; };
  }, [client, calendarOpen, date]);

  const loadCalendarMonth = (year: number, month: number) => {
    const first = `${year}-${String(month).padStart(2, "0")}-01`;
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    const last = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
    void client.getAvailabilitySummary(first, last)
      .then((days) => setCalendarSummary(Object.fromEntries(days.map((day) => [day.date, day]))))
      .catch(() => undefined);
  };

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
    } catch {
      setVoucher(null);
      setVoucherStatus("rejected");
      setVoucherError("We couldn't check that voucher just now. Please try again in a moment.");
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
    } catch (requestError) {
      let message = "Payment could not be started.";
      if (requestError instanceof PublicApiError) {
        if (requestError.fieldErrors && Object.keys(requestError.fieldErrors).length) {
          const firstDetail = Object.values(requestError.fieldErrors).find(Boolean);
          message = firstDetail || requestError.message;
        } else {
          message = requestError.message;
        }
      } else if (requestError instanceof Error) {
        message = requestError.message;
      }
      setError(message);
      reportOperationalEvent({ category: "payment_failure", errorCode: requestError instanceof PublicApiError ? requestError.code : "CHECKOUT_START_FAILED", summary: message, routeOrScreen: "booking" });
      setRequestState("idle");
    }
  }

  const paymentBlocked = !onlinePayment.enabled;

  return (
    <div className="booking-wizard booking-wizard--simple">
      <div className="booking-phase-tabs" role="group" aria-label="Booking steps">
        <button className={phase === "sessions" ? "is-active" : ""} type="button" aria-pressed={phase === "sessions"} onClick={() => setPhase("sessions")}>Pick sessions</button>
        <button className={phase === "details" ? "is-active" : ""} type="button" aria-pressed={phase === "details"} disabled={!basket.length} onClick={() => setPhase("details")}>Your details</button>
      </div>

      <h2 className="booking-wizard__heading" tabIndex={-1} ref={headingRef}>{phase === "sessions" ? "Pick your sessions" : "Your details"}</h2>
      {error ? <p className="booking-error" role="alert">{error}</p> : null}

      {phase === "sessions" ? (
        <>
          <div className="date-rail" role="group" aria-label="Choose a booking date">
            <button type="button" className="date-rail__arrow" aria-label="Earlier dates" onClick={() => scrollRail(-6)}>‹</button>
            <div className="date-rail__track" ref={railRef}>
              {railDays.map((option) => {
                const level = availabilityDotLevel(option.value, chipsSummary[option.value], businessDate);
                return (
                  <button
                    className={date === option.value ? "is-selected" : ""}
                    type="button"
                    key={option.value}
                    data-date={option.value}
                    aria-pressed={date === option.value}
                    onClick={() => { setDate(option.value); }}
                  >
                    <i className={`availability-light availability-light--top ${dotClass[level]}`} aria-hidden="true" />
                    <span>{option.day}</span>
                    <strong>{option.date}</strong>
                    <small>{option.month}</small>
                  </button>
                );
              })}
            </div>
            <button type="button" className="date-rail__arrow" aria-label="Later dates" onClick={() => scrollRail(6)}>›</button>
            <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
              <PopoverTrigger asChild>
                <button className="date-picker-button" type="button" aria-label="Open the calendar">
                  <CalendarIcon />
                  <span>Calendar</span>
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-3">
                <Calendar
                  selected={toDate(date)}
                  min={toDate(businessDate)}
                  max={toDate(maxDate)}
                  availability={calendarSummary}
                  businessDate={businessDate}
                  onMonthChange={(year, month) => loadCalendarMonth(year, month)}
                  onSelect={(selected) => { setDate(utcDateKey(selected)); setCalendarOpen(false); }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {paymentBlocked ? (
            <p className="booking-note" role="status">{onlinePayment.publicMessage ?? "Online booking will open again soon."}</p>
          ) : null}

          <div className="field-card-list">
            {fields.map((item) => {
              const slots = slotsByField(item.id);
              return (
                <section className="field-card" key={item.id} aria-labelledby={`field-card-${item.id}`}>
                  <div className="field-card__media">
                    <Image src={item.image} alt={item.imageAlt} fill sizes="(min-width: 900px) 40vw, 100vw" />
                  </div>
                  <div className="field-card__body">
                    <header className="field-card__header">
                      <div><h3 id={`field-card-${item.id}`}>{item.name}</h3><p>{item.surface}</p></div>
                      <p className="field-card__date">{dateLabel(date)}</p>
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
          <p className="availability-refresh" role="status">All times are Malaysia time · book up to 90 days ahead</p>
        </>
      ) : (
        <form className="booking-details-form" id="booking-details-form" onSubmit={submitDetails}>
          <div className="customer-form__grid">
            <div className="field-control">
              <Label htmlFor="customer-name">Full name</Label>
              <Input id="customer-name" required autoComplete="name" value={customer.name} onChange={(event) => setCustomer({ ...customer, name: event.target.value })} />
            </div>
            <div className="field-control">
              <Label htmlFor="customer-phone">Mobile number</Label>
              <Input id="customer-phone" required inputMode="tel" autoComplete="tel" placeholder="e.g. 012 345 6789" value={customer.phone} onChange={(event) => setCustomer({ ...customer, phone: event.target.value })} />
            </div>
            <div className="field-control">
              <Label htmlFor="customer-email">Email <span className="field-control__optional">(optional for guests)</span></Label>
              <Input id="customer-email" type="email" autoComplete="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} />
            </div>
            <div className="field-control">
              <Label htmlFor="customer-team">Team name <span className="field-control__optional">(optional)</span></Label>
              <Input id="customer-team" autoComplete="organization" value={customer.team} onChange={(event) => setCustomer({ ...customer, team: event.target.value })} />
            </div>
          </div>
          <p className="privacy-inline">We use these details only to manage this booking.{accountPrefill ? " Your saved account details have been filled in." : ""}</p>

          <section className="details-section">
            <h3>Your sessions</h3>
            <ul className="details-basket">
              {basket.map((item) => (
                <li key={basketKey(item)}>
                  <div><strong>{item.fieldName} · {item.label}</strong><small>{displayDate(item.bookingDate, { weekday: "long", day: "numeric", month: "short" })} · {formatTimePair12(item.startsAt, item.endsAt)}</small></div>
                  <span>{formatMoney(item.amountMinor)}</span>
                  <button type="button" className="details-basket__remove" onClick={() => toggleSession(item)} aria-label={`Remove ${item.fieldName} ${item.label} on ${item.bookingDate}`}>×</button>
                </li>
              ))}
            </ul>
            <Button type="button" variant="ghost" size="sm" onClick={backToSessions}>Add or remove sessions</Button>
          </section>

          {addons.length ? (
            <fieldset className="review-step__addons"><legend>Add-ons <small>Optional</small></legend>{basket.map((item) => { const key = basketKey(item); const byAddon = addonSelections[key] ?? {}; return <div className="review-step__addon-session" key={key}><p>{item.fieldName} · {item.label} · {formatTimePair12(item.startsAt, item.endsAt)}</p><div className="review-step__addon-options">{addons.map((addon) => <div className="review-step__addon-option" key={addon.id}><div><strong>{addon.name}</strong><small>{addon.description || addon.kind} · {formatMoney(addon.amountMinor)}</small></div><Select value={String(byAddon[addon.id] ?? 0)} onValueChange={(quantity) => { setAddonSelections((current) => { const next = { ...current, [key]: { ...(current[key] ?? {}), [addon.id]: Number(quantity) } }; if (!Object.values(next[key]).some((value) => value > 0)) delete next[key]; return next; }); }}><SelectTrigger className="w-24" aria-label={`Quantity of ${addon.name}`}><SelectValue /></SelectTrigger><SelectContent><SelectItem value="0">None</SelectItem>{[1, 2, 3, 4, 5].map((quantity) => <SelectItem key={quantity} value={String(quantity)}>{quantity}</SelectItem>)}</SelectContent></Select></div>)}</div></div>; })}</fieldset>
          ) : null}

          <div className="review-step__voucher"><Label htmlFor="voucher-code">Voucher code <span className="field-control__optional">optional</span></Label><div className="review-step__voucher-row"><Input id="voucher-code" maxLength={32} placeholder="e.g. FRIEND10" value={voucherCode} onChange={(event) => { setVoucherCode(event.target.value.toUpperCase()); setVoucher(null); setVoucherStatus("idle"); setVoucherError(null); }} /><Button type="button" variant="outline" disabled={!voucherCode.trim() || voucherStatus === "checking"} onClick={applyVoucher}>{voucherStatus === "checking" ? "Checking…" : voucherStatus === "applied" ? "Applied" : "Apply"}</Button></div>{voucherError ? <p className="booking-error" role="alert">{voucherError}</p> : voucherStatus === "applied" && voucher ? <p className="review-step__voucher-ok" role="status">{voucher.code} · {voucher.percentage}% off</p> : null}</div>

          <dl className="review-step__totals">
            <div><dt>Sessions</dt><dd>{formatMoney(sessionTotalMinor)}</dd></div>
            {addonTotalMinor ? <div><dt>Add-ons</dt><dd>{formatMoney(addonTotalMinor)}</dd></div> : null}
            {discountMinor ? <div><dt>Voucher discount</dt><dd>−{formatMoney(discountMinor)}</dd></div> : null}
            <div className="review-step__total"><dt>Total</dt><dd>{formatMoney(estimatedTotalMinor)}</dd></div>
          </dl>

          <PaymentBadges title="Accepted Payment Methods" className="booking-details-payments" />

          {!customer.email ? <p className="booking-note" role="alert">Add an email to get your booking details sent to you. You can also save your booking reference after payment.</p> : null}
          {error ? <p className="booking-error" role="alert">{error}</p> : null}
        </form>
      )}

      <div className="booking-bar">
        <button type="button" className="booking-bar__basket" aria-expanded={basketOpen} onClick={() => setBasketOpen((open) => !open)}>
          <span className="booking-bar__count">{basket.length}</span>
          <span className="booking-bar__label">{basket.length ? `${basket.length} session${basket.length === 1 ? "" : "s"}` : "No sessions"}</span>
          <strong>{formatMoney(estimatedTotalMinor)}</strong>
          <ChevronIcon className="text-white/50" />
        </button>
        {basketOpen ? (
          <ul className="booking-bar__list">
            {basket.map((item) => (
              <li key={basketKey(item)}><span>{item.fieldName} · {item.label} · {displayDate(item.bookingDate, { day: "2-digit", month: "short" })}</span><span>{formatMoney(item.amountMinor)}</span></li>
            ))}
            {!basket.length ? <li>Pick a session above to add it here.</li> : null}
          </ul>
        ) : null}
        {phase === "sessions" ? (
          <Button className="booking-bar__continue" type="button" disabled={!basket.length || paymentBlocked} onClick={goToDetails}>{!basket.length ? "Pick a session to continue" : `Continue · ${formatMoney(estimatedTotalMinor)}`} <ArrowRightIcon /></Button>
        ) : (
          <div className="booking-bar__actions">
            <Button type="button" variant="ghost" onClick={backToSessions}>Back</Button>
            <Button type="submit" form="booking-details-form" disabled={!basket.length || requestState !== "idle" || paymentBlocked}>{requestState === "booking" ? "Taking you to payment…" : "Continue to payment"} <ArrowRightIcon /></Button>
          </div>
        )}
      </div>

      {phase === "sessions" ? (
        <p className="booking-note">Your booking is confirmed as soon as the payment goes through.</p>
      ) : null}
    </div>
  );
}
