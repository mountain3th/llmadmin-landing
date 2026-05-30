"use client";

import { useEffect, useState } from "react";
import { FaWindows, FaUbuntu } from "react-icons/fa";
import { Apple } from "@lobehub/icons";

const DOWNLOADS: Record<string, { icon: React.ReactNode; label: string; version: string }> = {
  Windows: {
    icon: <FaWindows size={20} />,
    label: "Windows (.exe)",
    version: "Windows 10/11",
  },
  macOS: {
    icon: <Apple size={20} />,
    label: "macOS (.dmg)",
    version: "(Intel) macOS 12+",
  },
  Linux: {
    icon: <FaUbuntu size={20} />,
    label: "Linux (.deb)",
    version: "Ubuntu 20.04+",
  },
};

function detectOS(): string {
  if (typeof navigator === "undefined") return "Windows";
  const ua = navigator.userAgent;
  if (ua.includes("Win")) return "Windows";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  return "Windows";
}

function getPlatformKey(os: string): string {
  if (os === "macOS") return "macos";
  return os.toLowerCase();
}

async function generateSignedUrl(platform: string): Promise<string> {
  const timestamp = Date.now();
  const data = `${platform}:${timestamp}`;
  const secret = "llmadmin-download-secret-v1";

  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret);
  const dataToSign = encoder.encode(data);

  const key = await crypto.subtle.importKey(
    "raw",
    keyData,
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const signature = await crypto.subtle.sign("HMAC", key, dataToSign);
  const hash = btoa(String.fromCharCode(...new Uint8Array(signature))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");

  return `/api/d/${hash}?p=${platform}&t=${timestamp}`;
}

export default function CTA() {
  const [os, setOs] = useState<string>("Windows");
  const [downloadUrl, setDownloadUrl] = useState<string>("");

  useEffect(() => {
    setOs(detectOS());
  }, []);

  useEffect(() => {
    const platform = getPlatformKey(os);
    generateSignedUrl(platform).then(setDownloadUrl);
  }, [os]);

  const download = DOWNLOADS[os];

  return (
    <section className="py-20 px-4 md:px-6">
      <div className="max-w-[1200px] mx-auto bg-white border-2 border-[#2d5a27]/20 rounded-2xl soft-shadow relative overflow-hidden">
        <div className="text-center p-12 md:p-16">
          <h2 className="text-3xl font-bold text-[#151c27] mb-4">准备开始了吗？</h2>
          <div className="w-16 h-1 bg-[#2d5a27] mx-auto rounded-full mb-6" />
          <p className="text-[#5c5f5e] text-lg mb-10 max-w-xl mx-auto">
            立即下载 LLM Admin，守护你的每一次请求。
          </p>
          <div className="inline-flex flex-col items-center">
            <a
              href={downloadUrl}
              className="inline-flex items-center justify-center gap-2 bg-[#2d5a27] text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-[#154212] hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-lg cursor-pointer"
            >
              {download.icon}
              立即下载 {download.label}
            </a>
            <span className="mt-2 text-xs text-[#5c5f5e]">* {download.version}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
