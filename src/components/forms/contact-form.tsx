"use client";

import { useState, type FormEvent } from "react";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };

  if (sent) {
    return (
      <div className="contact-form-success" role="status">
        <div><CheckIcon /></div>
        <h2>Preview complete.</h2>
        <p>No message was sent. The production form will connect only after an approved contact channel and API path exist.</p>
        <button type="button" onClick={() => setSent(false)}>Return to form</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="field-control">
        <label htmlFor="contact-name">Your name</label>
        <input id="contact-name" required autoComplete="name" />
      </div>
      <div className="field-control">
        <label htmlFor="contact-email">Email address</label>
        <input id="contact-email" required type="email" autoComplete="email" />
      </div>
      <div className="field-control contact-form__wide">
        <label htmlFor="contact-topic">What can we help with?</label>
        <select id="contact-topic" defaultValue="booking">
          <option value="booking">Booking question</option>
          <option value="venue">Venue information</option>
          <option value="other">Something else</option>
        </select>
      </div>
      <div className="field-control contact-form__wide">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" required />
      </div>
      <p className="contact-form__wide">Contact delivery is not configured; your message remains in this browser and is not submitted.</p>
      <button className="contact-submit contact-form__wide" type="submit">Preview submission <ArrowRightIcon /></button>
    </form>
  );
}
