"use client";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import styles from "./Signin.module.css";
import { redirect } from "next/navigation";

export default function SigninPage() {
    const signIn = () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        
        // サインインの処理
        signInWithPopup(auth, provider)
            .then((result) => {
                // サインイン成功時の処理
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                console.log(token, user);
                location.reload();
            })
            .catch((error) => {
                // サインイン失敗時の処理
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = GoogleAuthProvider.credentialFromError(error);
                console.log(errorCode, errorMessage, email, credential);
            });
    };

    const auth = getAuth();
    if (auth.currentUser) {
        // ログイン済みの場合はリダイレクト
        redirect("/");
    }

    return (
        <main className={styles.main}>
            <div className={styles.Title}>
                <h1>サインイン</h1>
                <p>サインインをすることで、同じアカウントでサインインしているTODOアプリ上でリアルタイムに情報を同期することができます。</p>
            </div>
            <div className={styles.form}>
                <div className={styles.box}>
                    <div className={styles.google_signin}>
                        <button
                            onClick={signIn}
                        >
                            Googleアカウントでサインイン
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
