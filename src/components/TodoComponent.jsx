'use client';
import {useState, useEffect} from "react";
import styles from "./Todo.module.css";

export default function TodoComponent() {
    // 新しく入力する項目を一時的に格納しておく配列
    const [newTodo, setNewTodo] = useState("");
    const [newPriority, setNewPriority] = useState("normal");
    const [newProgress, setNewProgress] = useState("notDone");

    // フィルターの項目を記録しておくための変数
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [progressFilter, setProgressFilter] = useState("all");

    // todoタスク(todoList)の初期化
    const [todos, setTodos] = useState([{
        id : "null",
        isDone: false,
        text: "サンプルタスク",
        priority: "normal",
        progress: "notDone",
    }]);

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
            isDone: false,
            text: newTodo,
            priority: newPriority,
            progress: newProgress,
        };

        // これまでに加えられたタスクとこれから加えるタスクをtodoに上書き保存する
        setTodos([...todos, newTodoItem]);// 次に入力するときに入力フォームが初期状態になるように上書き
        setNewTodo("");
        setNewPriority("normal");
        setNewProgress('notDone');
    };

    // 一度だけ行われる処理
    useEffect(() => {
        // ローカルストレージに入っているtodolistを取り出す
        const savedTodos = localStorage.getItem("todolist");
        // 取り出したデータが空でないときに処理を行う
        if(savedTodos && savedTodos.length > 0){
            // 取り出したデータをtodoに上書き保存する
            setTodos(JSON.parse(savedTodos));
        }
    },[]);
    
    // tpdosに変化があった際に行われる処理
    useEffect(() => {
        // todosの要素が0より大きくtodosの0番目がnullの時
        if(todos.length > 0 && todos[0].id === "null"){
            // 上記と同じ処理を行う
            const savedTodos = localStorage.getItem("todolist");
            // もしローカルストレージのデータがあるならば
            if(savedTodos && savedTodos.length > 0){
                // 読み込んだデータをtodosに反映させる
                setTodos(JSON.parse(savedTodos));
                return;
            };
            // setTodosを空になおす
            setTodos([]);
            return;
        };

        // todosの要素が上の条件に当てはまらない時
        localStorage.setItem("todolist", JSON.stringify(todos));
    }, [todos]);

    const filteredTodos = () => {
        // フィルターが全てallの時は素通りさせる
        if(priorityFilter === 'all' && progressFilter === "all"){
            return todos;
        }
        // 優先度フィルターがallの時進捗フィルターだけ機能させる
        else if(priorityFilter === 'all'){
            return todos.filter(todo => todo.progress === progressFilter);
        }
        // 進捗フィルターがallの時優先度フィルターだけを機能させる
        else if(progressFilter === "all"){
            return todos.filter(todo => todo.priority === priorityFilter);
        }
        // 両方のフィルターがある時、両方とも機能させる
        else{
            return todos.filter(todo => todo.priority === priorityFilter).filter(td => td.progress === progressFilter);
        }
    }

    const handleclear = () => {
        const newTodos = todos.filter((todos) => todos.progress !== "done");
        setTodos(newTodos);
    };

    return (
        <div className={styles.box}>
            {/* 入力関係 */}
            <div className={styles.inputbox}>
                <input id="inputbox"className={styles.input} value={newTodo} onChange={todoChange}/>
                <select id="inputPriority"className={styles.select} value={newPriority} onChange={priorityChange}>
                    <option value="emergency">emergency</option>
                    <option value="important">important</option>
                    <option value="normal">normal</option>
                    <option value="trifle">trifle</option>
                </select>
                <button className={styles.add} onClick={addTodos}>add</button>
            </div>
            {/* 優先度フィルター関係 */}
            <div className={styles.priorityFilter} >
                <p>priority filter</p>
                <select id="prioritySelector" className={styles.priorirySlector} value={priorityFilter} onChange={priorityFilterChange}>
                    <option value="all">all</option>
                    <option value='emergency'>emergency</option>
                    <option value="important">important</option>
                    <option value="normal">normal</option>
                    <option value="trifle">trifle</option>
                </select>
            </div>
            {/* 進捗フィルター関係 */}
            <div id="progressFilter" className={styles.progressFilter} value={progressFilter} onChange={progressChange}>
                <p>progress filter</p>
                <select id ="progressSelector">
                    <option value="all">all</option>
                    <option value="done">done</option>
                    <option value="notDone">not done</option>
                </select>
            </div>
            {/* 表示リスト関係 */}
            <button onClick={handleclear}>完了したタスクの消去</button>
            <div>残りのタスク:{todos.filter((todos) => !todos.isDone).length} </div>
            <ul className={styles.list}>
            {typeof filteredTodos().map === 'function' && filteredTodos().map((todo, index) => todo.id !== 'null' ?(
                    <div className={styles.todo} key={todo.id}>
                        <span className={styles.index}>{index +1}</span>
                        <span className={styles.text}>{todo.text}</span>
                        <span className={styles.priority}>{todo.priority}</span>
                        {/* 削除ボタン */}
                        <button className={styles.remove} onClick={() => {
                            const newTodos = [...todos];
                            newTodos.splice(index, 1);
                            setTodos(newTodos)
                        }}>remove</button>
                        <label >
                            <input
                                type="checkbox"
                                checked={todo.progress === "done" ? true : false}
                                onChange={(e) => {
                                    console.log(todo)
                                    const newTodos = [...todos];
                                    if (e.target.checked) {
                                        newTodos[index].progress = "done";
                                    } else {
                                        newTodos[index].progress = "notDone";
                                    }
                                    setTodos(newTodos);
                                }}
                            />
                        </label>
                    </div>
                ):null)}
            </ul>
        </div>
    );
}