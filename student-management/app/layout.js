import "./globals.css";

export const metadata = {
  title: "Student Management",
  description: "Student Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}