import "./globals.css";

export const metadata = {
    title: "TODOリストアプリ",
    description: "チーム2開発",
};

export default function RootLayout({ children }) {
    return (
        <html lang="ja">
            <head>
                <meta charSet="utf-8" />
            </head>
            <body>{children}</body>
        </html>
    );
}
