import "./globals.css";

export const metadata = {
  title: "Little Notes — a quieter place for your thoughts",
  description: "A simple, thoughtful space to collect your notes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
