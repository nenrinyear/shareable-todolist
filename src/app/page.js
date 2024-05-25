import TodoComponent from "@/components/TodoComponent";
import styles from "./page.module.css";

export default function Home() {
    return (
        <main className={styles.main}>
            <h1 className={styles.title}>Todo List</h1>
            <p className={styles.title}>チーム2開発</p>

            <TodoComponent />
        </main>
    );
}
