"use client";
import { useAuth } from "@/lib/AuthContext";
import { signOut, getAuth } from "firebase/auth";
import styles from "./Header.module.css";

export default function Header() {
    const { currentUser } = useAuth();

    const signOutHandler = () => {
        const auth = getAuth();

        signOut(auth)
            .then(() => {
                console.log("Signout success");
                location.reload();
            })
            .catch((error) => {
                console.warn("Signout error", error);
            });
    }

    return (
        <header className={styles.Top}>
            <nav className={styles.nav}>
                <div className={styles.Links}>
                    <a href="/">Home</a>
                </div>
                <div className={styles.Accounts}>
                    {currentUser ? (
                        <>
                            <span className={styles.email}>{currentUser.email}</span>
                            <button onClick={signOutHandler}>サインアウト</button>
                        </>
                    ) : (
                        <>
                            <a href="/signin">サインイン</a>
                        </>
                    )}
                </div>
            </nav>
        </header>
    )
}
