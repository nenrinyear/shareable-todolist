'use client';
import {useState, useEffect} from "react";
import styles from "./Todo.module.css";

export default function TodoComponent() {
    const [newTodo, setNewTodo] = useState("");

    const [todos, setTodos] = useState([{
        id : "null",
        isDone: false,
        text: "サンプルタスク",
    }]);

    const todoChange = (e) => setNewTodo(e.target.value);

    const addTodos = () => {
        if(newTodo ==="") return;

        const newTodoItem = {
            id: new Date().getTime().toString(),
            isDone: false,
            text: newTodo,
        };

        setTodos([...todos, newTodoItem]);
        setNewTodo("");
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

    return (
        <div className={styles.box}>
            <input className={styles.input} value={newTodo} onChange={todoChange}/>
            <button className={styles.add} onClick={addTodos}>add</button>
            <ul className={styles.list}>
                {typeof todos.map === 'function' && todos.map((todo,index) => todo.id !== "null" ?(
                    <div className={styles.todo} key={todo.id}>
                        <span className={styles.index}>{index+1}.</span>
                        <span className={styles.text}>{todo.text}</span>
                        <button className={styles.remove} onClick={() => {
                            const newTodos = [...todos];
                            newTodos.splice(index, 1);
                            setTodos(newTodos)
                        }}>remove</button>
                    </div>
                ): null)}
            </ul>
        </div>
    );
}