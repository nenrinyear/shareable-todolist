import "./globals.css";
import { Noto_Sans_JP } from "next/font/google";

export const metadata = {
    title: "TODOリストアプリ",
    description: "チーム2開発",
};

const noto_sans_jp = Noto_Sans_JP({
    display: "swap",
    subsets: ["latin-ext"],
});

export default function RootLayout({ children }) {
    return (
        <html lang="ja">
            <head>
                <meta charSet="utf-8" />
            </head>
            <body className={noto_sans_jp.className}>{children}</body>
        </html>
    );
}
