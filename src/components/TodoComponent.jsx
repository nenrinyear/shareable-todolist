'use client';
import { useState, useEffect } from "react";
import styles from "./Todo.module.css";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, child, set, onValue } from "firebase/database";

export const priorityToJapanese = (priority) => {
    switch (priority) {
        case "all":
            return "すべて";
        case "emergency":
            return "緊急";
        case "important":
            return "重要";
        case "normal":
            return "普通";
        case "trifle":
            return "些細";
        default:
            return "";
    }
};

export default function TodoComponent() {
    // 新しく入力する項目を一時的に格納しておく配列
    const [newTodo, setNewTodo] = useState("");
    const [newPriority, setNewPriority] = useState("normal");
    const [newProgress, setNewProgress] = useState("notDone");

    // フィルターの項目を記録しておくための変数
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [progressFilter, setProgressFilter] = useState("all");

    // todoタスク(todoList)の初期化
    const [todos, setTodos] = useState(() => {
        return localStorage.getItem("todolist") ? JSON.parse(localStorage.getItem("todolist")).todos : null;
    });

    // 入力値に変化があった際に行われる処理達
    const todoChange = (e) => setNewTodo(e.target.value);
    const priorityChange = (e) => setNewPriority(e.target.value);
    const priorityFilterChange = (e) => setPriorityFilter(e.target.value);
    const progressChange = (e) => setProgressFilter(e.target.value);

    // タスクをtodoListに足すために行われる処理
    const addTodos = () => {
        // もし新しく入力されるタスクが空なら何もしない
        if(newTodo ==="") return;

        // 新しく入力されるタスクが空でない時の処理
        // 新しく入力されるタスクの一時的な格納場所
        const newTodoItem = {
            id: new Date().getTime().toString(),
            isDone: newProgress === "done",
            text: newTodo,
            priority: newPriority,
        };

        // これまでに加えられたタスクとこれから加えるタスクをtodoに上書き保存する
        if (!todos) {
            setTodos([newTodoItem]);
        } else {
            setTodos([...todos, newTodoItem]);// 次に入力するときに入力フォームが初期状態になるように上書き
        }
        setNewTodo("");
        setNewPriority("normal");
        setNewProgress('notDone');
    };

    const db = getDatabase();
    const dbRef = ref(db);
    const auth = getAuth();
    const user = auth.currentUser;

    // 一度だけ行われる処理
    useEffect(() => {
        let ignore = false;
        // 取り出したデータが空でないときに処理を行う
        if (todos && todos.length > 0) {
            if (user) {
                get(child(dbRef, `users/${user.uid}`))
                    .then((snapshot) => {
                        const dbTodos = snapshot.exists() ? snapshot.val() : { todos: [] };

                        if (snapshot.exists() && dbTodos.todos && dbTodos.length > 0 && !ignore) {
                            const isConfirm = confirm("データベース上にデータが存在します。ローカルストレージとデータベースのデータを統合しますか？キャンセルを選択するとデータベースのデータが優先されます。");
                            if (isConfirm) {
                                console.log("ローカルストレージとデータベースのデータを統合します。");
                                const newTodos = [...todos, ...dbTodos.todos];
                                localStorage.removeItem("todolist");
                                setTodos(newTodos);

                            } else {
                                console.log("データベースのデータが優先されます");
                                localStorage.removeItem("todolist");
                            }
                        } else {
                            console.log("No data available");
                            set(ref(db, `users/${user.uid}`), {
                                todos: todos,
                                last_updated: new Date().getTime(),
                            });
                            localStorage.removeItem("todolist");
                        }
                    }).catch((error) => {
                        console.error(error);
                    });
            }
        } else if (user && !ignore) {
            get(child(dbRef, `users/${user.uid}`))
                .then((snapshot) => {
                    const dbTodos = snapshot.exists() ? snapshot.val() : { todos: [] };
                    if (snapshot.exists() && dbTodos.todos && dbTodos.todos.length > 0 && !ignore) {
                        console.log("データベース上にデータが存在します。")
                        if (!todos) {
                            setTodos(dbTodos.todos);
                            return;
                        }
                        const newTodos = [...todos, ...dbTodos.todos];
                        setTodos(newTodos);
                    } else {
                        console.log("No data available");
                        set(ref(db, `users/${user.uid}`), {
                            todos: todos,
                            last_updated: new Date().getTime(),
                        });
                        localStorage.removeItem("todolist");
                    }
                }).catch((error) => {
                    console.error(error);
                });
        }

        return () => { ignore = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    // todosに変化があった際に行われる処理
    useEffect(() => {
        if (!todos) {
            return;
        }

        const localTodolist = JSON.parse(localStorage.getItem("todolist"));
        if (localTodolist && "todos" in localTodolist && JSON.stringify(todos) === JSON.stringify(localTodolist.todos)) {
            return;
        }

        if (user) {
            set(ref(db, `users/${user.uid}/todos`), todos);
            set(ref(db, `users/${user.uid}/last_updated`), new Date().getTime());
        } else {
            localStorage.setItem("todolist", JSON.stringify({
                todos: todos,
                last_updated: new Date().getTime(),
            }));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [todos]);

    useEffect(() => {
        if (!user) {
            return;
        }

        return onValue(ref(db, `users/${user.uid}/todos`), (snapshot) => {
            const data = snapshot.val();
            if (data) {
                console.log("データベースからデータを取得しました。");
                setTodos(data);
            }
        });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredTodos = () => {
        if (!todos) {
            return [];
        }
        const isDone = progressFilter === "done";
        // フィルターが全てallの時は素通りさせる
        if(priorityFilter === 'all' && progressFilter === "all"){
            return todos;
        }
        // 優先度フィルターがallの時進捗フィルターだけ機能させる
        else if(priorityFilter === 'all'){
            return todos.filter(todo => todo.isDone === isDone);
        }
        // 進捗フィルターがallの時優先度フィルターだけを機能させる
        else if(progressFilter === "all"){
            return todos.filter(todo => todo.priority === priorityFilter);
        }
        // 両方のフィルターがある時、両方とも機能させる
        else{
            return todos.filter(todo => todo.priority === priorityFilter).filter(td => td.isDone === isDone);
        }
    }

    const handleclear = () => {
        const newTodos = todos.filter((todos) => !todos.isDone);
        setTodos(newTodos);
    };

    return (
        <div className={styles.box}>
            {/* 入力関係 */}
            <div className={styles.inputbox}>
                <input
                    id="inputbox"
                    className={styles.input}
                    value={newTodo}
                    onChange={todoChange}
                />
                <select id="inputPriority"className={styles.selector} value={newPriority} onChange={priorityChange}>
                    <option value="emergency">{priorityToJapanese("emergency")}</option>
                    <option value="important">{priorityToJapanese("important")}</option>
                    <option value="normal">{priorityToJapanese("normal")}</option>
                    <option value="trifle">{priorityToJapanese("trifle")}</option>
                </select>
                <button
                    className={`${styles.button} ${styles.add}`}
                    onClick={addTodos}
                    disabled={newTodo === ""}
                >
                    追加
                </button>
            </div>


            <div className={styles.filters}>
                {/* 優先度フィルター関係 */}
                <div className={styles.priorityFilter} >
                    <p>優先度フィルター</p>
                    <select id="prioritySelector" className={styles.selector} value={priorityFilter} onChange={priorityFilterChange}>
                        <option value="all">{priorityToJapanese("all")}</option>
                        <option value='emergency'>{priorityToJapanese("emergency")}</option>
                        <option value="important">{priorityToJapanese("important")}</option>
                        <option value="normal">{priorityToJapanese("normal")}</option>
                        <option value="trifle">{priorityToJapanese("trifle")}</option>
                    </select>
                </div>
                {/* 進捗フィルター関係 */}
                <div id="progressFilter" className={styles.progressFilter} value={progressFilter} onChange={progressChange}>
                    <p>進捗状況フィルター</p>
                    <select id="progressSelector" className={styles.selector}>
                        <option value="all">すべて</option>
                        <option value="done">完了</option>
                        <option value="notDone">未完了</option>
                    </select>
                </div>
            </div>

            <div className={styles.nokori}>
                {/* 表示リスト関係 */}
                <div>残りのタスク:{todos && todos.filter((todos) => !todos.isDone).length} </div>
                <button
                    className={`${styles.button} ${styles.remove}`}
                    onClick={handleclear}
                    disabled={todos && todos.filter((todos) => todos.isDone).length === 0}
                >
                    完了したタスクの消去
                </button>
            </div>

            <ul className={styles.list}>
                {typeof filteredTodos().map === 'function' && filteredTodos().map((todo, index) => todo.id !== 'null' ?(
                    <div className={styles.todo} key={todo.id}>
                        <span className={styles.index}>{index +1}</span>
                        <label>
                            <input
                                type="checkbox"
                                checked={todo.isDone}
                                onChange={(e) => {
                                    const newTodos = [...todos];
                                    const _index = newTodos.findIndex((td) => td.id === todo.id);
                                    if (e.target.checked) {
                                        newTodos[_index].isDone = true;
                                    } else {
                                        newTodos[_index].isDone = false;
                                    }
                                    setTodos(newTodos);
                                }}
                            />
                        </label>
                        <span className={styles.text}>{todo.text}</span>
                        <span
                            className={`${styles.priority} ${
                                todo.priority === 'emergency' ? styles.emergency :
                                todo.priority === 'important' ? styles.important :
                                todo.priority === 'normal' ? styles.normal :
                                styles.trifle
                            }`}
                        >
                            {priorityToJapanese(todo.priority)}
                        </span>
                        {/* 削除ボタン */}
                        <button
                            className={styles.remove}
                            onClick={() => {
                                const newTodos = [...todos];
                                const _index = newTodos.findIndex((td) => td.id === todo.id);
                                newTodos.splice(_index, 1);
                                setTodos(newTodos)
                            }}
                        >
                            ❌
                        </button>
                    </div>
                ) : null)}
            </ul>
        </div>
    );
}