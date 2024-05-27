'use client';
import {useState, useEffect} from "react";
import styles from "./Todo.module.css";

export default function TodoComponent() {
    const [newTodo, setNewTodo] = useState("");
    const [newPriority, setNewPriority] = useState("normal");
    const [newProgress, setNewProgress] = useState("notDone");
    const [priorityFilter, setPriorityFilter] = useState("all");
    const [progressFilter, setProgressFilter] = useState("all");

    const [todos, setTodos] = useState([{
        id : "null",
        isDone: false,
        text: "サンプルタスク",
        priority: "normal",
        progress: "notDone",
    }]);

    const todoChange = (e) => setNewTodo(e.target.value);
    const priorityChange = (e) => setNewPriority(e.target.value);
    const priorityFilterChange = (e) => setPriorityFilter(e.target.value);
    const progressChange = (e) => setProgressFilter(e.target.value);

    const addTodos = () => {
        if(newTodo ==="") return;

        const newTodoItem = {
            id: new Date().getTime().toString(),
            isDone: false,
            text: newTodo,
            priority: newPriority,
            progress: newProgress,
        };

        setTodos([...todos, newTodoItem]);
        setNewTodo("");
        setNewPriority("normal");
        setNewProgress('notDone');
    };

    useEffect(() => {
        const savedTodos = localStorage.getItem("todolist");
        if(savedTodos && savedTodos.length > 0){
            setTodos(JSON.parse(savedTodos));
        }
    },[]);
    
    useEffect(() => {
        if(todos.length > 0 && todos[0].id === "null"){
            const savedTodos = localStorage.getItem("todolist");
            if(savedTodos && savedTodos.length > 0){
                setTodos(JSON.parse(savedTodos));
                return;
            };
            setTodos([]);
            return;
        };

        localStorage.setItem("todolist", JSON.stringify(todos));
    }, [todos]);

    const filteredTodos = () => {
        if(priorityFilter === 'all' && progressFilter === "all"){
            return todos;
        }
        else if(priorityFilter === 'all'){
            return todos.filter(todo => todo.progress === progressFilter);
        }
        else if(progressFilter === "all"){
            return todos.filter(todo => todo.priority === priorityFilter);
        }
        else{
            return todos.filter(todo => todo.priority === priorityFilter).filter(td => td.progress === progressFilter);
        }
    }


    return (
        <div className={styles.box}>
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
            <div id="progressFilter" className={styles.progressFilter} value={progressFilter} onChange={progressChange}>
                <p>progress filter</p>
                <select id ="progressSelector">
                    <option value="all">all</option>
                    <option value="done">done</option>
                    <option value="notDone">not done</option>
                </select>
            </div>
            <ul className={styles.list}>
                {typeof filteredTodos().map === 'function' && filteredTodos().map((todo, index) => todo.id !== 'null' ?(
                    <div className={styles.todo} key={todo.id}>
                        <span className={styles.index}>{index +1}</span>
                        <span className={styles.text}>{todo.text}</span>
                        <span className={styles.priority}>{todo.priority}</span>
                        <button className={styles.remove} onClick={() => {
                            const newTodo = [ ...todos];
                            newTodo.splice(index, 1);
                            setTodos(newTodo)
                        }}>remove</button>
                    </div>
                ):null)}
            </ul>
            
        </div>
    );
}