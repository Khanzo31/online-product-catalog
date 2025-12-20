// backend/my-strapi-project/src/api/inquiry/content-types/inquiry/lifecycles.ts

import { Resend } from "resend";

interface PopulatedInquiry {
  id: string | number;
  CustomerName?: string;
  CustomerEmail?: string;
  Message?: string;
  Product?: {
    id: string | number;
    Name?: string;
    documentId?: string;
  };
}

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

    if (
      !inquiry ||
      !inquiry.Product ||
      !inquiry.Product.Name ||
      !inquiry.CustomerName ||
      !inquiry.CustomerEmail
    ) {
      console.error("Inquiry data missing. Email aborted.");
      return;
    }

    const adminEmail = process.env.ADMIN_EMAIL || "alpialcanada@gmail.com";
    const productName = inquiry.Product.Name;
    const productUrl = `https://www.alpialcanada.com/products/${inquiry.Product.documentId}`;

    try {
      await resend.emails.send({
        from: "AlpialCanada <inquiry@alpialcanada.com>",
        to: adminEmail,
        replyTo: inquiry.CustomerEmail, // FIXED: Changed reply_to to replyTo
        bcc: inquiry.CustomerEmail,
        subject: `Product Inquiry: ${productName} (from ${inquiry.CustomerName})`,
        html: `
          <div style="font-family: serif; line-height: 1.6; color: #333; max-width: 600px;">
            <h2 style="color: #7f1d1d; border-bottom: 1px solid #ddd; padding-bottom: 10px;">New Inquiry Received</h2>
            
            <p><strong>Item:</strong> ${productName}</p>
            <p><strong>From:</strong> ${inquiry.CustomerName} (${inquiry.CustomerEmail})</p>
            
            <div style="background: #f9f8f6; padding: 20px; border-left: 4px solid #b45309; margin: 20px 0;">
              <p style="margin-top: 0; font-weight: bold;">Message:</p>
              <p style="font-style: italic;">"${inquiry.Message || "No message provided."}"</p>
            </div>

            <p><a href="${productUrl}" style="color: #b45309; font-weight: bold;">View Original Listing on Site</a></p>
            
            <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
            
            <p style="font-size: 12px; color: #666;">
              <strong>Note for Admin:</strong> Simply click "Reply" to respond directly to the customer. 
              The customer has been BCC'd on this email as a confirmation of their request.
            </p>
          </div>
        `,
      });

      console.log(`Smart-threaded email sent for Inquiry ${inquiry.id}`);
    } catch (error) {
      console.error("Resend Error:", error);
    }
  },
};
