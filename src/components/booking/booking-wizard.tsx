"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { SlotCard } from "@/components/booking/slot-card";
import { AlertIcon, ArrowRightIcon, CalendarIcon, CheckIcon } from "@/components/ui/icons";
import type {
  AvailabilitySlot,
  AvailabilityStatus,
  BookingBlock,
  Field,
} from "@/lib/api/types";
import { formatMoney } from "@/lib/format";
import { createHttpPublicClient, PublicApiError } from "@/lib/api/http-client";
import type { Hold } from "@/lib/api/types";

const steps = ["Date", "Field", "Block", "Details", "Review"] as const;

function addIsoDays(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function displayDate(value: string, options: Intl.DateTimeFormatOptions): string {
  return new Intl.DateTimeFormat("en-MY", { ...options, timeZone: "UTC" }).format(new Date(`${value}T00:00:00.000Z`));
}

const stateExamples: AvailabilityStatus[] = [
  "available",
  "held",
  "booked",
  "blocked",
  "closed",
  "past",
];

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
  apiOrigin: string;
  businessDate: string;
  initialDate: string;
};

export function BookingWizard({ fields, blocks, availability, apiOrigin, businessDate, initialDate }: BookingWizardProps) {
  const client = useMemo(() => createHttpPublicClient(apiOrigin), [apiOrigin]);
  const dateOptions = useMemo(() => Array.from({ length: 5 }, (_, index) => {
    const value = addIsoDays(businessDate, index);
    return { value, day: displayDate(value, { weekday: "short" }), date: displayDate(value, { day: "2-digit" }), month: displayDate(value, { month: "short" }), label: index === 0 ? "Today" : displayDate(value, { weekday: "long" }), display: displayDate(value, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) };
  }), [businessDate]);
  const maxDate = useMemo(() => addIsoDays(businessDate, 90), [businessDate]);
  const [step, setStep] = useState(0);
  const [date, setDate] = useState(initialDate);
  const [fieldId, setFieldId] = useState<Field["id"]>("FIELD_01");
  const [blockId, setBlockId] = useState<BookingBlock["id"] | null>(null);
  const [customer, setCustomer] = useState<CustomerDetails>({
    name: "",
    phone: "",
    email: "",
    team: "",
  });
  const [liveAvailability, setLiveAvailability] = useState(availability);
  const [hold, setHold] = useState<Hold | null>(null);
  const [requestState, setRequestState] = useState<"idle" | "holding" | "booking">("idle");
  const [error, setError] = useState<string | null>(null);

  const field = fields.find((item) => item.id === fieldId) ?? fields[0];
  const block = blocks.find((item) => item.id === blockId) ?? null;
  const selectedDate = dateOptions.find((item) => item.value === date) ?? { value: date, day: displayDate(date, { weekday: "short" }), date: displayDate(date, { day: "2-digit" }), month: displayDate(date, { month: "short" }), label: displayDate(date, { weekday: "long" }), display: displayDate(date, { weekday: "long", day: "numeric", month: "long", year: "numeric" }) };
  const slots = blocks.map((item) => ({
    block: item,
    status:
      liveAvailability.find(
        (slot) => slot.fieldId === fieldId && slot.blockId === item.id,
      )?.status ?? "closed",
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

  const goTo = (nextStep: number) => {
    setStep(Math.max(0, Math.min(steps.length - 1, nextStep)));
    window.requestAnimationFrame(() => {
      document.querySelector<HTMLElement>(".booking-panel")?.focus();
    });
  };

  const submitDetails = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    goTo(4);
  };

  async function requestHold() {
    if (!blockId) return;
    setRequestState("holding");
    setError(null);
    try {
      const result = await client.createHold({ fieldId, blockCode: blockId, bookingDate: date }, crypto.randomUUID());
      setHold(result);
      goTo(3);
    } catch (requestError) {
      setError(requestError instanceof PublicApiError ? requestError.message : "The field block could not be held. Refresh and try again.");
      setLiveAvailability(await client.getAvailability(date).catch(() => liveAvailability));
    } finally { setRequestState("idle"); }
  }

  async function proceedToPayment() {
    if (!hold) return;
    setRequestState("booking");
    setError(null);
    try {
      const booking = await client.createBooking({ holdToken: hold.token, customer: { name: customer.name, phone: customer.phone, email: customer.email, ...(customer.team ? { teamName: customer.team } : {}) } }, crypto.randomUUID());
      if (!booking.accessToken) throw new Error("The booking response did not include its one-time access token.");
      window.sessionStorage.setItem(`axs:booking:${booking.reference}`, booking.accessToken);
      const attempt = await client.createPaymentAttempt(booking.reference, { method: "billplz_online", returnPath: `/booking/result?reference=${encodeURIComponent(booking.reference)}` }, crypto.randomUUID());
      if (!attempt.redirectUrl) throw new Error("The payment provider did not return a redirect URL.");
      window.location.assign(attempt.redirectUrl);
    } catch (requestError) {
      setError(requestError instanceof PublicApiError ? requestError.message : requestError instanceof Error ? requestError.message : "Payment could not be started.");
      setRequestState("idle");
    }
  }

  return (
    <div className="booking-wizard">
      <div className="booking-progress" aria-label="Booking steps">
        {steps.map((label, index) => (
          <div className={index === step ? "is-current" : index < step ? "is-complete" : ""} key={label}>
            <span>{index < step ? <CheckIcon /> : `0${index + 1}`}</span>
            <strong>{label}</strong>
          </div>
        ))}
      </div>

      <div className="booking-shell">
        <section className="booking-panel" tabIndex={-1} aria-labelledby={`booking-step-${step}`}>
          <div className="booking-panel__heading">
            <p>Step {step + 1} of {steps.length}</p>
            <h2 id={`booking-step-${step}`}>{getStepTitle(step)}</h2>
            <span>{getStepIntro(step)}</span>
          </div>
          {error ? <p className="booking-error" role="alert">{error}</p> : null}

          {step === 0 ? (
            <div className="date-step">
              <div className="date-strip" role="group" aria-label="Choose a booking date">
                {dateOptions.map((option) => (
                  <button
                    className={date === option.value ? "is-selected" : ""}
                    type="button"
                    key={option.value}
                    aria-pressed={date === option.value}
                    onClick={() => { setDate(option.value); setHold(null); }}
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
                    onChange={(event) => { setDate(event.target.value); setHold(null); }}
                  />
                </label>
              </div>
              <div className="booking-live-note">
                <AlertIcon />
                <p><strong>Live availability:</strong> Malaysia time, the 90-day window and the 60-minute cut-off are enforced by the booking API.</p>
              </div>
              <button className="wizard-next" type="button" onClick={() => goTo(1)}>
                Choose field <ArrowRightIcon />
              </button>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="field-choice-grid">
              {fields.map((item, index) => (
                <button
                  className={fieldId === item.id ? "field-choice is-selected" : "field-choice"}
                  type="button"
                  key={item.id}
                  aria-pressed={fieldId === item.id}
                  onClick={() => { setFieldId(item.id); setHold(null); }}
                >
                  <span className="field-choice__index">0{index + 1}</span>
                  <span className="field-choice__name">{item.name}</span>
                  <span>{item.surface}</span>
                  <i>{fieldId === item.id ? <CheckIcon /> : null}</i>
                </button>
              ))}
              <div className="wizard-buttons">
                <button className="wizard-back" type="button" onClick={() => goTo(0)}>Back</button>
                <button className="wizard-next" type="button" onClick={() => goTo(2)}>Choose block <ArrowRightIcon /></button>
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="slot-step">
              <div className="slot-grid">
                {slots.map(({ block: item, status }) => (
                  <SlotCard
                    key={item.id}
                    block={item}
                    status={status}
                    fieldName={field.shortName}
                    selected={blockId === item.id}
                    onSelect={status === "available" ? () => { setBlockId(item.id); setHold(null); } : undefined}
                  />
                ))}
              </div>
              <p className="availability-refresh" role="status">Live availability · refreshes every 15 seconds</p>
              <div className="wizard-buttons">
                <button className="wizard-back" type="button" onClick={() => goTo(1)}>Back</button>
                <button className="wizard-next" type="button" disabled={!blockId || requestState !== "idle"} onClick={requestHold}>{requestState === "holding" ? "Holding block…" : "Add details"} <ArrowRightIcon /></button>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <form className="customer-form" onSubmit={submitDetails}>
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
                  <label htmlFor="customer-email">Email address</label>
                  <input id="customer-email" required type="email" autoComplete="email" value={customer.email} onChange={(event) => setCustomer({ ...customer, email: event.target.value })} />
                </div>
                <div className="field-control">
                  <label htmlFor="customer-team">Team name <span>(optional)</span></label>
                  <input id="customer-team" autoComplete="organization" value={customer.team} onChange={(event) => setCustomer({ ...customer, team: event.target.value })} />
                </div>
              </div>
              <p className="privacy-inline">Details are submitted only to the ArmourXSports booking API to create this booking.</p>
              <div className="wizard-buttons">
                <button className="wizard-back" type="button" onClick={() => goTo(2)}>Back</button>
                <button className="wizard-next" type="submit">Review booking <ArrowRightIcon /></button>
              </div>
            </form>
          ) : null}

          {step === 4 && block ? (
            <div className="review-step">
              <dl>
                <div><dt>Date</dt><dd>{selectedDate.display}</dd></div>
                <div><dt>Field</dt><dd>{field.name}</dd></div>
                <div><dt>Block</dt><dd>{block.label} · {block.startsAt}–{block.endsAt}</dd></div>
                <div><dt>Booking contact</dt><dd>{customer.name}<small>{customer.email}</small></dd></div>
                <div className="review-step__total"><dt>Authoritative amount</dt><dd>{formatMoney(hold?.amountMinor ?? block.amountMinor)}</dd></div>
              </dl>
              <div className="booking-live-note">
                <AlertIcon />
                <p><strong>Server hold active.</strong> Complete payment before {hold ? new Date(hold.expiresAt).toLocaleTimeString("en-MY", { hour: "2-digit", minute: "2-digit" }) : "the hold expires"}. Payment is confirmed only by the verified backend callback.</p>
              </div>
              <div className="wizard-buttons">
                <button className="wizard-back" type="button" onClick={() => goTo(3)}>Edit details</button>
                <button className="wizard-next" type="button" disabled={!hold || requestState !== "idle"} onClick={proceedToPayment}>{requestState === "booking" ? "Creating payment…" : "Proceed to secure payment"} <ArrowRightIcon /></button>
              </div>
            </div>
          ) : null}
        </section>

        <aside className="booking-summary" aria-label="Booking selection summary">
          <p>Your selection</p>
          <dl>
            <div><dt>Date</dt><dd>{selectedDate.display}</dd></div>
            <div><dt>Field</dt><dd>{step > 0 ? field.shortName : "Choose next"}</dd></div>
            <div><dt>Block</dt><dd>{block ? `${block.startsAt}–${block.endsAt}` : "Not selected"}</dd></div>
          </dl>
          <div className="booking-summary__rule" />
          <p className="booking-summary__authority">Final availability and price always come from the ArmourXSports API.</p>
        </aside>
      </div>

      <section className="state-guide" aria-labelledby="state-guide-title">
        <div className="state-guide__heading">
          <p className="eyebrow"><span aria-hidden="true" />Public state guide</p>
          <h2 id="state-guide-title">Every slot tells the truth.</h2>
          <p>Compact examples show that no unavailable state is styled like an action.</p>
        </div>
        <div className="state-guide__grid">
          {stateExamples.map((status, index) => (
            <SlotCard
              block={blocks[index % blocks.length]}
              fieldName="State preview"
              key={status}
              status={status}
              compact
            />
          ))}
        </div>
      </section>
    </div>
  );
}

function getStepTitle(step: number) {
  return ["Choose your date", "Select a field", "Pick a complete block", "Who is booking?", "Review the match day"][step];
}

function getStepIntro(step: number) {
  return [
    "Start with a date inside the 90-day booking window.",
    "Both launch fields use the same fixed morning and evening blocks.",
    "Unavailable states stay visible, clear and non-interactive.",
    "The live service will require name, phone and email for guest booking.",
    "Check the details before the server creates a payment attempt.",
  ][step];
}
