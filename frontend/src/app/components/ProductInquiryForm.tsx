// frontend/src/app/components/ProductInquiryForm.tsx
"use client";

import { useState, FormEvent } from "react";

interface ProductInquiryFormProps {
  productId: string;
  productName: string;
}

export default function ProductInquiryForm({
  productId,
  productName,
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
            // FIX: The API ID for the relation is "Product" (uppercase P), matching the Strapi setup.
            Product: productId,
          },
        }),
      });

      if (!res.ok) {
        // Log the detailed error from Strapi for better debugging
        const errorData = await res.json();
        console.error("Inquiry submission failed:", errorData);
        throw new Error("Failed to submit inquiry. Please try again later.");
      }

      setStatus("success");
      setFeedbackMessage("Thank you! Your inquiry has been sent successfully.");
      setCustomerName("");
      setCustomerEmail("");
      setMessage("");
    } catch (error) {
      setStatus("error");
      setFeedbackMessage(
        error instanceof Error ? error.message : "An unknown error occurred."
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="customerName"
          className="block text-sm font-medium text-gray-700"
        >
          Your Name
        </label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="customerEmail"
          className="block text-sm font-medium text-gray-700"
        >
          Your Email
        </label>
        <input
          type="email"
          id="customerEmail"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        ></textarea>
      </div>
      <p className="text-sm text-gray-500">
        Inquiring about: <strong>{productName}</strong>
      </p>
      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300"
        >
          {status === "submitting" ? "Sending..." : "Send Inquiry"}
        </button>
      </div>
      {feedbackMessage && (
        <p
          className={`text-sm ${
            status === "error" ? "text-red-600" : "text-green-600"
          }`}
          aria-live="assertive"
        >
          {feedbackMessage}
        </p>
      )}
    </form>
  );
}
