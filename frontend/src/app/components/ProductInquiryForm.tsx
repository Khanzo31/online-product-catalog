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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="customerName"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Your Name
        </label>
        <input
          type="text"
          id="customerName"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-600 focus:border-red-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
      </div>
      <div>
        <label
          htmlFor="customerEmail"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Your Email
        </label>
        <input
          type="email"
          id="customerEmail"
          value={customerEmail}
          onChange={(e) => setCustomerEmail(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-600 focus:border-red-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-600 focus:border-red-600 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        ></textarea>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Inquiring about: <strong>{productName}</strong>
      </p>
      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 disabled:bg-red-300"
        >
          {status === "submitting" ? "Sending..." : "Send Inquiry"}
        </button>
      </div>
      {feedbackMessage && status !== "idle" && (
        <p
          className={`text-sm mt-2 ${
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
