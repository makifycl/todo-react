import React, {useState, useEffect} from 'react';
import { useHistory, Redirect } from 'react-router-dom';


function TodoList() {
    const [todo, setTodo] = useState([]);
    const [newTodo, setNewTodo] = useState();
    const [updatedTodoName, setUpdatedTodoName] = useState();
    const [selectedTodo, setSelectedTodo] = useState();
    const [updateContainer, setUpdateContainer] = useState(false);
    let history = useHistory();
    let token = null;
    let todoLists = null;

    useEffect(() => {

        getTodos();
    }, []);

    let setJwtToken = function() {
        token = localStorage.getItem("token");
        if (!token) {
            history.push('/sign-in');
        }

        return "Bearer " + token;
    }

    let requestOptions = {
        method: 'GET',
        headers: {
            'Authorization': setJwtToken(),
            'Content-type': 'application/json'
        }
    }

    let getTodos = async () => {
        await fetch("http://localhost:8080/todo/page?sort=id,desc", requestOptions)
        .then(response => response.json())
        .then(result => {
            setTodo(result.content);
        })
        .catch(error => console.log('error', error));
    }
    
    let navigateTodoDetails = function(todoName) {
        history.push({
            pathname: '/todo-items/' + todoName,
            state: { name: todoName }
          })
    }

    if (todo && todo.length > 0) {
        todoLists = todo.map((td, key) => {
            
            return <li key={key} className="list-group-item text-capitalize d-flex justify-content-between my-2">
                    <h6>{td.name}</h6>
                    <div className="todo-icon">
                    <button type="button" className="btn btn-success btn-sm mx-2" onClick={() => navigateTodoDetails(td.name)}>
                        <i className="fas fa-th-list" aria-hidden="true"></i>
                    </button>

                    <button type="button" className="btn btn-success btn-sm mx-2" onClick={() => onOpenUpdateContainer(td)}>
                        <i className="fas fa-pen" aria-hidden="true"></i>
                    </button>

                    <button type="button" className="btn btn-success btn-sm mx-2"  onClick={() => onDeleteTodoList(td.name)}>
                        <i className="fas fa-trash" aria-hidden="true"></i>
                    </button>
                    </div>
            </li>
        });
    }
    
    let addTodoList = async function(e) {
        //e.preventDefault();
        await fetch("http://localhost:8080/todo", {
            method: 'POST',
            headers: {
                'Authorization': setJwtToken(),
                'Content-type': 'application/json'
            },
            body: JSON.stringify({name: newTodo})
        })
            .then(response => response.json())
            .then(data => {
                todoLists.push(data);
            })
            .catch(error => console.log("Er: ", error));
    };

    let onOpenUpdateContainer = function(todo) {
        setUpdateContainer(true);
        setSelectedTodo(todo);
    }

    let onCloseUpdateContainer = function() {
        setUpdateContainer(false);
    }

    let updateTodoList = async function(event) {
        //event.preventDefault();
        let requestOptions = {
            method: 'PUT',
            headers: {
                'Authorization': setJwtToken(),
                'Content-type': 'application/json'
            },
            body: JSON.stringify(selectedTodo)
        }
        await fetch(`http://localhost:8080/todo/${updatedTodoName}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            setUpdateContainer(false);
        })
        .catch(error => console.log('error', error));

    }

    let onDeleteTodoList = async function(todoName) {
        let requestOptions = {
            method: 'DELETE',
            headers: {
                'Authorization': setJwtToken(),
                'Content-type': 'application/json'
            }
        }
        await fetch(`http://localhost:8080/todo/${todoName}`, requestOptions)
        .then(response => {
            if (response.ok) {
                getTodos();
            }
        })
        .catch(error => console.log('error', error));
    }

    return (
        <div>
            <div className="card card-body my-3">
            
                <form onSubmit={addTodoList}>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text bg-primary text-white">
                                <i className="fas fa-book"/>
                            </div>
                        </div>
                        <input 
                            type="text"
                            className="form-control text-capitalize"
                            placeholder="Add a todo list"
                            onChange={event => setNewTodo(event.target.value)}/>
                    </div>
                    <button type="submit" className="btn btn-block btn-primary mt-3">
                        Add List
                    </button>
                </form>
            </div>
        
            <div className="card card-body my-3" style= {{ display: updateContainer ? 'block':'none' }}>
            
                <form onSubmit={updateTodoList}>
                    <div className="input-group">
                        <div className="input-group-prepend">
                            <div className="input-group-text bg-primary text-white">
                                <i className="fas fa-book"/>
                            </div>
                        </div>
                        <input 
                            type="text"
                            className="form-control text-capitalize"
                            placeholder="Add a todo list"
                            onChange={event => setUpdatedTodoName(event.target.value)}/>
                    </div>
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <button type="button" className="btn btn-block btn-primary mt-3" onClick={() => onCloseUpdateContainer()}>
                                    Cancel 
                                </button>
                            </div>
                            <div className="col">
                                <button type="submit" className="btn btn-block btn-primary mt-3">
                                    Update 
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>

        <div>
            <ul className="list-group my-5">
                <h3 className="text-capitalize text-center">
                    Todo list
                </h3>
                {todoLists}
            </ul>
        </div>
        </div>
    )
}

export default TodoList