import TodoComponent from "@/components/TodoComponent";
import styles from "./page.module.css";

export default function Home() {
    return (
        <main className={styles.main}>
            <h1>TODOリストアプリ</h1>
            <p>チーム2開発</p>

            <TodoComponent />
        </main>
    );
}
