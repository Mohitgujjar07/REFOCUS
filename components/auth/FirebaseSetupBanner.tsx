"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { AlertCircle, ChevronDown, ChevronUp, Copy, Check, ExternalLink } from "lucide-react";

export const FirebaseSetupBanner: React.FC = () => {
  const { isConfigured } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  if (isConfigured) return null;

  const sampleEnv = `# Add to .env.local in project root:
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=refocous-prod.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=refocous-prod
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=refocous-prod.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleEnv);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-amber-50 border-b border-amber-200 text-amber-900 text-xs px-4 py-2.5 transition-all select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          <span>
            <strong>Firebase Mode:</strong> Running with local baseline data. Add your Firebase web configuration to <code>.env.local</code> to activate live cloud authentication and Firestore sync.
          </span>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center gap-1 font-semibold text-amber-800 hover:text-amber-950 underline flex-shrink-0"
        >
          <span>{isOpen ? "Hide Setup Guide" : "Setup Instructions"}</span>
          {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {isOpen && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-amber-200/80 space-y-2.5 leading-relaxed">
          <p className="font-semibold text-amber-950">How to connect your Firebase Project:</p>
          <ol className="list-decimal list-inside space-y-1 text-amber-900">
            <li>
              Go to the{" "}
              <a
                href="https://console.firebase.google.com"
                target="_blank"
                rel="noreferrer"
                className="underline font-medium text-amber-950 inline-flex items-center gap-0.5"
              >
                Firebase Console <ExternalLink className="w-3 h-3" />
              </a>{" "}
              and click <strong>Add project</strong> (e.g. <code>refocous-app</code>).
            </li>
            <li>
              Under <strong>Build &gt; Authentication</strong>, click <em>Get Started</em> and enable <strong>Email/Password</strong> sign-in provider.
            </li>
            <li>
              Under <strong>Build &gt; Firestore Database</strong>, click <em>Create Database</em> and choose <strong>Production mode</strong>.
            </li>
            <li>
              In <strong>Project Settings &gt; General &gt; Your apps</strong>, click the <strong>&lt;/&gt; (Web)</strong> icon to register a web app and copy the <code>firebaseConfig</code> credentials.
            </li>
            <li>
              Create a file named <code>.env.local</code> in the root folder and paste your keys:
            </li>
          </ol>

          <div className="relative mt-2">
            <pre className="p-3 bg-card border border-amber-300 rounded-lg text-[11px] font-mono text-content-primary overflow-x-auto">
              {sampleEnv}
            </pre>
            <button
              onClick={handleCopy}
              className="absolute right-2 top-2 p-1.5 rounded bg-surface-subtle border border-border hover:bg-surface-muted text-content-primary text-xs flex items-center gap-1"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-status-success" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? "Copied" : "Copy Template"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
