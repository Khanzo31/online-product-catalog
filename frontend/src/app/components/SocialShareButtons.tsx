// frontend/src/app/components/SocialShareButtons.tsx
"use client";

import {
  FacebookShareButton,
  TwitterShareButton,
  EmailShareButton,
  FacebookIcon,
  TwitterIcon,
  EmailIcon,
} from "react-share";

interface SocialShareButtonsProps {
  url: string;
  title: string;
}

export default function SocialShareButtons({
  url,
  title,
}: SocialShareButtonsProps) {
  return (
    <div className="flex items-center gap-4">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Share on:
      </span>
      <div className="flex items-center gap-2">
        <FacebookShareButton url={url} hashtag={"#AlpialCanada"}>
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <TwitterShareButton url={url} title={title}>
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        <EmailShareButton
          url={url}
          subject={title}
          body="Check out this product:"
        >
          <EmailIcon size={32} round />
        </EmailShareButton>
      </div>
    </div>
  );
}
