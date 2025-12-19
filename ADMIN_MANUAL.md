# Admin Manual: "God Mode" & Dashboard

This guide explains how to use the administrative features of the AlpialCanada website.

## 1. Accessing the Dashboard

1.  Navigate to `/dashboard` (e.g., `alpialcanada.com/dashboard`).
2.  Enter your secure **Admin Password**.
3.  Upon success, you will see the **Overview Panel** showing total inventory and recent inquiries.

## 2. "God Mode" (Frontend Admin Tools)

When logged in, the website transforms into an administration tool.

### The Admin Toolbar

A **Red Bar** will appear at the very top of the screen on every page.

- **Indicator:** Confirms "ADMIN MODE ACTIVE".
- **Go to Dashboard:** Quick link back to the stats area.
- **Log Out:** Securely clears your session cookie.

### Managing Products Directly

Navigate to any single product page on the website. You will see floating buttons in the **bottom-right corner**:

1.  **Blue Pencil Icon (Edit):**

    - Opens a new tab taking you directly to the **Strapi Admin Panel**.
    - _Note:_ You must be logged into Strapi for this to work.

2.  **Red Trash Icon (Delete):**
    - **Action:** Permanently removes the item from the database.
    - **Safety:** A browser popup will ask for confirmation ("Are you sure...?").
    - **Result:** The item is deleted, and you are redirected to the Dashboard.

## 3. Handling Inquiries

Inquiries are viewable on the Dashboard.

- **Reply:** Click the "Reply" button on any inquiry card. This opens your default email client (Gmail, Outlook) with the:
  - **To:** Customer's email.
  - **Subject:** Pre-filled (e.g., "Re: Inquiry about Vintage Truck").
- **Context:** The card displays the specific product the customer asked about. Click the product name to view the listing.

## 4. Adding New Products

1.  Go to the **Dashboard**.
2.  Click the **"Open Admin Panel →"** button in the "Manage Content" card.
3.  This opens Strapi. Go to **Content Manager** -> **Product** -> **Create New Entry**.
