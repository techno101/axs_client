"use client";

import { useState, type FormEvent } from "react";
import { ArrowRightIcon, CheckIcon } from "@/components/ui/icons";

export function ContactForm() {
  const [sent, setSent] = useState(false);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    const name = String(values.get("name") ?? "").trim();
    const email = String(values.get("email") ?? "").trim();
    const topic = String(values.get("topic") ?? "Booking question").trim();
    const message = String(values.get("message") ?? "").trim();
    const subject = encodeURIComponent(`ArmourX Sports - ${topic}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    setSent(true);
    window.location.assign(`mailto:armourxsports@gmail.com?subject=${subject}&body=${body}`);
  };

  if (sent) {
    return (
      <div className="contact-form-success" role="status">
        <div><CheckIcon /></div>
        <h2>Your email is ready.</h2>
        <p>Your email app should open with the message filled in. If it did not, email <a href="mailto:armourxsports@gmail.com">armourxsports@gmail.com</a>.</p>
        <button type="button" onClick={() => setSent(false)}>Return to form</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      <div className="field-control">
        <label htmlFor="contact-name">Your name</label>
        <input id="contact-name" name="name" required autoComplete="name" />
      </div>
      <div className="field-control">
        <label htmlFor="contact-email">Email address</label>
        <input id="contact-email" name="email" required type="email" autoComplete="email" />
      </div>
      <div className="field-control contact-form__wide">
        <label htmlFor="contact-topic">What can we help with?</label>
        <select id="contact-topic" name="topic" defaultValue="Booking question">
          <option>Booking question</option>
          <option>Venue information</option>
          <option>Something else</option>
        </select>
      </div>
      <div className="field-control contact-form__wide">
        <label htmlFor="contact-message">Message</label>
        <textarea id="contact-message" name="message" required />
      </div>
      <p className="contact-form__wide">Continue to open this message in your email app. This website does not store the form contents.</p>
      <button className="contact-submit contact-form__wide" type="submit">Continue to email <ArrowRightIcon /></button>
    </form>
  );
}
