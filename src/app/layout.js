import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import SessionWrapper from "@/components/layout/SessionWrapper";

const poppins = Poppins({
    weight: ['200', '300', '400', '500', '600', '700'],
    style: ['normal'],
    subsets: ['latin'],
    display: 'swap'
});

export const metadata = {
  title: "Blugig Dashboard",
  description: "Created using next.js and shadcn UI",
};

export default function RootLayout({ children }) {

    return (
        <SessionWrapper>
            <html lang="en" suppressHydrationWarning>
                <body className={poppins.className}>
                    {children}

                    <Toaster />
                </body>
            </html>
        </SessionWrapper>
    );
}
