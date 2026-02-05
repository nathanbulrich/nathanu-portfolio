"use client";

import { useState } from "react";

export default function CopyEmailButton() {
  const [copied, setCopied] = useState(false);

  const handleClick = () => {
    navigator.clipboard.writeText("nateulrich@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button onClick={handleClick} className="hover:underline cursor-pointer">
      {copied ? "Copied!" : "Email"}
    </button>
  );
}
