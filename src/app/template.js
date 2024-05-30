"use client";

import Header from "@/components/Header";
import { AuthProvider } from "@/lib/AuthContext";
import { initializeFirebaseApp } from "@/lib/firebase";

export default function Template({ children }) {
    initializeFirebaseApp();
    return (
        <AuthProvider>
            <Header />
            {children}
        </AuthProvider>
    );
}
