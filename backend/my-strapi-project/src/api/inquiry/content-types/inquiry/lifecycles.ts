// backend/my-strapi-project/src/api/inquiry/content-types/inquiry/lifecycles.ts

import { Resend } from "resend";

// --- START OF DEFINITIVE FIX ---
// Define a more specific type that correctly reflects Strapi's potential response.
interface PopulatedInquiry {
  // Use `string | number` for IDs.
  id: string | number;
  // Mark properties as optional to match Strapi's service return type.
  CustomerName?: string;
  CustomerEmail?: string;
  Message?: string;
  Product?: {
    id: string | number;
    Name?: string;
    documentId?: string;
  };
}
// --- END OF DEFINITIVE FIX ---

export default {
  async afterCreate(event) {
    const { result } = event;

    const resend = new Resend(process.env.RESEND_API_KEY);

    const inquiry: PopulatedInquiry = await strapi.entityService.findOne(
      "api::inquiry.inquiry",
      result.id,
      {
        populate: { Product: true },
      }
    );

    // This comprehensive check is a "type guard". It ensures all necessary
    // properties exist and satisfies TypeScript.
    if (
      !inquiry ||
      !inquiry.Product ||
      !inquiry.Product.Name ||
      !inquiry.Product.documentId ||
      !inquiry.CustomerName ||
      !inquiry.CustomerEmail
    ) {
      console.error(
        "Could not send email: Essential inquiry or product data is missing."
      );
      return;
    }

    // After the check above, TypeScript knows these values are defined.
    const customerName = inquiry.CustomerName;
    const customerEmail = inquiry.CustomerEmail;
    const customerMessage = inquiry.Message || "No message provided."; // Provide a fallback for the optional message
    const productName = inquiry.Product.Name;
    const productUrl = `https://www.alpialcanada.com/products/${inquiry.Product.documentId}`;

    const adminEmail = "alpialcanada@gmail.com";

    try {
      await Promise.all([
        // --- Email to the Site Administrator ---
        resend.emails.send({
          from: "AlpialCanada Inquiry <inquiry@alpialcanada.com>",
          to: adminEmail,
          subject: `New Inquiry for: ${productName}`,
          html: `
            <h1>New Product Inquiry</h1>
            <p>You have received a new inquiry for the product: <strong>${productName}</strong>.</p>
            <hr>
            <h2>Customer Details:</h2>
            <ul>
              <li><strong>Name:</strong> ${customerName}</li>
              <li><strong>Email:</strong> ${customerEmail}</li>
            </ul>
            <h2>Message:</h2>
            <p>${customerMessage}</p>
            <hr>
            <p><a href="${productUrl}">View Product Page</a></p>
          `,
        }),

        // --- Confirmation Email to the Customer ---
        resend.emails.send({
          from: "AlpialCanada <confirmation@alpialcanada.com>",
          to: customerEmail,
          subject: "Your Inquiry to AlpialCanada has been Received",
          html: `
            <h1>Thank You, ${customerName}!</h1>
            <p>We have successfully received your inquiry for the product: <strong>${productName}</strong>.</p>
            <p>We will review your message and get back to you as soon as possible.</p>
            <p>You can view the product again here: <a href="${productUrl}">${productName}</a></p>
            <br>
            <p>Sincerely,</p>
            <p>The AlpialCanada Team</p>
          `,
        }),
      ]);

      console.log(
        `Inquiry emails sent successfully for inquiry ID: ${inquiry.id}`
      );
    } catch (error) {
      console.error(
        `Error sending inquiry emails for inquiry ID: ${inquiry.id}`,
        error
      );
    }
  },
};
