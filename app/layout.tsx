import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LLM Admin - Your Chief LLM Partner",
  description:
    "LLM Admin 将您的模型编排为一支全天候待命的 AI 团队。它调度、切换、守护每一次请求。您只管使用 —— 无惧网络波动。",
  keywords: ["LLM Admin", "AI", "模型编排", "LLM", "OpenAI", "Anthropic", "API"],
  metadataBase: new URL("https://llmadmin.dev"),
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "LLM Admin - Your Chief LLM Partner",
    description:
      "LLM Admin 将您的模型编排为一支全天候待命的 AI 团队。它调度、切换、守护每一次请求。",
    url: "https://llmadmin.dev",
    siteName: "LLM Admin",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LLM Admin",
      },
    ],
    locale: "zh_CN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "LLM Admin - Your Chief LLM Partner",
    description:
      "LLM Admin 将您的模型编排为一支全天候待命的 AI 团队。它调度、切换、守护每一次请求。",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}