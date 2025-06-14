"use client";

import { useState, FormEvent } from "react";

export default function ProductInquiryForm({
  productId,
  productName,
}: {
  productId: number;
  productName: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_API_URL || "http://127.0.0.1:1337";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    setFeedbackMessage("");

    try {
      const res = await fetch(`${strapiUrl}/api/inquiries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: {
            CustomerName: name,
            CustomerEmail: email,
            Message: message,
            // --- THE FIX ---
            // The key is now lowercase to match the Strapi field name.
            product: productId,
          },
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        const errorMessage =
          errorData.error?.message || "Submission failed. Please try again.";
        throw new Error(errorMessage);
      }

      setStatus("success");
      setFeedbackMessage(
        `Thank you, ${name}! Your inquiry about "${productName}" has been sent.`
      );
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("error");
      if (err instanceof Error) {
        setFeedbackMessage(err.message);
      } else {
        setFeedbackMessage("An unexpected error occurred.");
      }
    }
  };

  if (status === "success") {
    return (
      <div className="p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
        <h3 className="font-bold">Success!</h3>
        <p>{feedbackMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Your Name
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Your Email
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="message"
          className="block text-sm font-medium text-gray-700"
        >
          Your Message
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={4}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300"
        >
          {status === "submitting" ? "Sending..." : "Send Inquiry"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">{feedbackMessage}</p>
      )}
    </form>
  );
}
