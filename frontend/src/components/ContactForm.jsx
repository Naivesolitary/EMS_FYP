"use client";

import { useState } from "react";
import { FiSend } from "react-icons/fi"; // Send Icon
import { FaSpinner } from "react-icons/fa"; // Spinner Icon

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      // Handle real form submission here
    }, 1500);
  };

  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <h2 className="mb-6 text-xl font-semibold text-gray-900">Send us a message</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              id="name"
              placeholder="John Smith"
              className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50/50 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="john@example.com"
              className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50/50 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              required
            />
          </div>
        </div>

        {/* <div className="space-y-2">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            id="phone"
            type="tel"
            placeholder="+1 (555) 000-0000"
            className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50/50 px-4 text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div> */}

        <div className="space-y-2">
          <label htmlFor="subject" className="text-sm font-medium text-gray-700">
            Subject
          </label>
          <select
            id="subject"
            className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50/50 px-4 text-gray-900 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          >
            <option value="">Select a subject</option>
            <option value="general">General Inquiry</option>
            <option value="booking">Event Booking</option>
            <option value="pricing">Pricing Information</option>
            <option value="support">Technical Support</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="message" className="text-sm font-medium text-gray-700">
            Message
          </label>
          <textarea
            id="message"
            placeholder="Tell us how we can help you..."
            className="min-h-[120px] w-full rounded-lg border border-gray-200 bg-gray-50/50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <FaSpinner className="h-4 w-4 animate-spin" />
              Sending...
            </>
          ) : (
            <>
              Send Message
              <FiSend className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
