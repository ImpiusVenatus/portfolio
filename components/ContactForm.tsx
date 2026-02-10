"use client";

import { useState } from "react";
import { dmMono } from "@/app/layout";

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error("Send failed");
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  const inputClass = `w-full px-4 py-3 rounded-xl border border-border-subtle bg-foreground/5 text-foreground placeholder-text-muted-2 focus:outline-none focus:border-foreground/30 transition-colors ${dmMono.className} text-sm`;
  const labelClass = `block text-left text-text-muted-2 text-xs tracking-widest mb-2 ${dmMono.className}`;

  return (
    <form onSubmit={handleSubmit} className="mt-12 w-full max-w-md mx-auto text-left">
      <div className="space-y-5">
        <div>
          <label htmlFor="contact-name" className={labelClass}>
            NAME
          </label>
          <input
            id="contact-name"
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
            className={inputClass}
            placeholder="Your name"
            disabled={status === "sending"}
          />
        </div>
        <div>
          <label htmlFor="contact-email" className={labelClass}>
            EMAIL
          </label>
          <input
            id="contact-email"
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
            className={inputClass}
            placeholder="you@example.com"
            disabled={status === "sending"}
          />
        </div>
        <div>
          <label htmlFor="contact-message" className={labelClass}>
            MESSAGE
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
            className={`${inputClass} resize-none`}
            placeholder="How can we work together?"
            disabled={status === "sending"}
          />
        </div>
      </div>
      {status === "success" && (
        <p className="mt-4 text-emerald-400/90 text-sm tracking-wide">
          Thanks — I&apos;ll get back to you soon.
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 text-rose-400/90 text-sm tracking-wide">
          Something went wrong. Please try again or email me directly.
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className={`mt-8 w-full py-4 rounded-xl border border-border-subtle bg-foreground/10 text-foreground/90 hover:bg-foreground/15 hover:text-foreground transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${dmMono.className} text-xs tracking-widest uppercase`}
      >
        {status === "sending" ? "SENDING…" : "SEND MESSAGE"}
      </button>
    </form>
  );
}
