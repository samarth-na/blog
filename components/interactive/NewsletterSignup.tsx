"use client";

import { useState } from "react";
import posthog from "posthog-js";

interface NewsletterSignupProps {
  placeholder?: string;
  buttonText?: string;
  onSubscribe?: (email: string) => void;
}

export function BlogNewsletterSignup({
  placeholder = "your email",
  buttonText = "subscribe",
  onSubscribe
}: NewsletterSignupProps) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    posthog.capture("newsletter_signup_submitted", {
      email_provided: !!email,
    });

    if (onSubscribe) {
      onSubscribe(email);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input 
        type="email" 
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-3 py-2 text-sm border border-border bg-background focus:outline-none focus:border-primary"
      />
      <button type="submit" className="px-4 py-2 text-sm bg-foreground text-background hover:opacity-80">
        {buttonText}
      </button>
    </form>
  );
}
