// frontend/src/app/components/ProductInquiryForm.tsx
"use client";

import { useState, FormEvent } from "react";

interface ProductInquiryFormProps {
  productId: string;
  productName: string;
  onSuccess?: () => void;
}

export default function ProductInquiryForm({
  productId,
  productName,
  onSuccess,
}: ProductInquiryFormProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setFeedbackMessage("");

    const strapiUrl =
      process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";
    const apiUrl = `${strapiUrl}/api/inquiries`;

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          data: {
            CustomerName: customerName,
            CustomerEmail: customerEmail,
            Message: message,
            Product: productId,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Inquiry submission failed:", errorData);
        throw new Error("Failed to submit inquiry. Please try again later.");
      }

      setStatus("success");
      setFeedbackMessage("Thank you! Your inquiry has been received.");
      setCustomerName("");
      setCustomerEmail("");
      setMessage("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      setStatus("error");
      setFeedbackMessage(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  };

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-sm p-6 text-center animate-fade-in-up">
        <h4 className="text-green-800 font-serif text-lg font-semibold mb-2">
          Inquiry Sent!
        </h4>
        <p className="text-green-700 mb-4">
          We have received your message regarding{" "}
          <span className="font-semibold">{productName}</span> and will get back
          to you shortly.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="text-sm font-medium text-green-800 underline hover:text-green-900 focus:outline-none focus:ring-2 focus:ring-green-500 rounded-sm px-2 py-1"
        >
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label
          htmlFor="customerName"
          className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5"
        >
          Your Name
        </label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          className="block w-full px-4 py-3 border border-gray-300 rounded-sm shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
          placeholder="John Doe"
        />
      </div>
      <div>
        <label
          htmlFor="customerEmail"
          className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5"
        >
          Your Email
        </label>
        <input
          type="email"
          id="customerEmail"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
          className="block w-full px-4 py-3 border border-gray-300 rounded-sm shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
          placeholder="john@example.com"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1.5"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="block w-full px-4 py-3 border border-gray-300 rounded-sm shadow-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:border-amber-600 focus:ring-1 focus:ring-amber-600 transition-colors"
          placeholder="I'm interested in this item..."
        ></textarea>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 italic">
        Inquiring about:{" "}
        <strong className="text-gray-800 dark:text-gray-200 not-italic capitalize">
          {productName}
        </strong>
      </p>
      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-red-900 text-white py-3.5 px-4 rounded-sm hover:bg-red-800 shadow-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-900 disabled:bg-red-200 disabled:cursor-not-allowed font-serif font-medium tracking-wide text-lg"
        >
          {status === "submitting" ? "Sending..." : "Send Inquiry"}
        </button>
      </div>
      {feedbackMessage && status === "error" && (
        <div className="bg-red-50 text-red-800 p-3 rounded-sm border border-red-100 text-sm text-center">
          {feedbackMessage}
        </div>
      )}
    </form>
  );
}
