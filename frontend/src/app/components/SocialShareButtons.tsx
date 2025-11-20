// frontend/src/app/components/SocialShareButtons.tsx
"use client";

import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
} from "react-share";
import toast from "react-hot-toast";

interface SocialShareButtonsProps {
  url: string;
  title: string;
}

export default function SocialShareButtons({
  url,
  title,
}: SocialShareButtonsProps) {
  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Link copied to clipboard", {
        style: {
          background: "#4b5563", // gray-600
          color: "#fff",
          borderRadius: "4px",
        },
        iconTheme: {
          primary: "#fff",
          secondary: "#4b5563",
        },
      });
    });
  };

  const iconClass = "h-5 w-5 fill-current transition-colors";
  const buttonClass =
    "p-2 rounded-full border border-stone-200 bg-white text-stone-500 hover:text-amber-700 hover:border-amber-700 hover:bg-amber-50 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-600 focus:ring-offset-1";

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-6 border-t border-stone-100 dark:border-gray-700">
      <span className="text-sm font-serif font-medium text-gray-500 dark:text-gray-400 italic">
        Share this find:
      </span>
      <div className="flex items-center gap-3">
        {/* Facebook */}
        <FacebookShareButton url={url} hashtag={"#AlpialCanada"}>
          <div className={buttonClass} aria-label="Share on Facebook">
            <svg viewBox="0 0 24 24" className={iconClass}>
              <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
            </svg>
          </div>
        </FacebookShareButton>

        {/* Twitter / X */}
        <TwitterShareButton url={url} title={title}>
          <div className={buttonClass} aria-label="Share on X (Twitter)">
            <svg viewBox="0 0 24 24" className={iconClass}>
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </div>
        </TwitterShareButton>

        {/* Email */}
        <EmailShareButton
          url={url}
          subject={`Check out this antique: ${title}`}
          body={`I found this item on AlpialCanada and thought you might like it:\n\n${title}\n${url}`}
        >
          <div className={buttonClass} aria-label="Share via Email">
            <svg viewBox="0 0 24 24" className={iconClass}>
              <path
                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M22 6l-10 7L2 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
          </div>
        </EmailShareButton>

        {/* Copy Link (Custom) */}
        <button
          onClick={handleCopyLink}
          className={buttonClass}
          aria-label="Copy Link"
        >
          <svg viewBox="0 0 24 24" className={iconClass}>
            <path
              d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
