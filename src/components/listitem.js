import React, {useState, useEffect} from 'react';
import { useHistory  } from 'react-router-dom';
import { Dropdown, Alert } from 'react-bootstrap';

function ListItem(props) {
    const todoName = props.match.params.name;
    const [todoItems, setTodoItems] = useState(null);
    const [sortableItems, setsortableItems] = useState();
    const [sortBy, setSortBy] = useState();
    const [filterBy, setFilterBy] = useState();
    const [newItemName, setNewItemName] = useState();
    const [newItemDescription, setNewItemDescription] = useState();
    const [newItemDeadline, setNewItemDeadline] = useState();
    const [newDependentItemId, setNewDependentItemId] = useState();
    const [updatedTodoItemName, setUpdatedTodoItemName] = useState({});
    const [updatedTodoItemDescription, setUpdatedTodoItemDescription] = useState({});
    const [updatedTodoItemDeadline, setUpdatedTodoItemDeadline] = useState({});
    const [selectedTodoItem, setSelectedTodoItem] = useState();
    const [updateContainer, setUpdateContainer] = useState(false);
    const [dependentItem, setDependentItem] = useState();
    let history = useHistory(null);
    let token = null;
    let items = [];
    let dropDownTodoItems = [];
    let cannotComplete = null;

    useEffect(() => {
        console.log(todoName);
        
        getTodo();
    }, []);

    let setJwtToken = function() {
        token = localStorage.getItem("token");
        if (!token) {
            history.push('/sign-in');
        }

        return "Bearer " + token;
    }

   

    let getTodo = async function() { 

        let requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': setJwtToken(),
                'Content-type': 'application/json'
            }
        }

        await fetch(`http://localhost:8080/todo/by-name/${todoName}`, requestOptions)
            .then(response => response.json())
            .then(data =>{
                setTodoItems(data);
                setsortableItems(data.todoItems);
            })
            .catch(error => console.log("er: ", error));
    }

    let getTodoItems = async function(sortParam, filterParam) {

        if (sortParam && !filterParam) {
            setSortBy(sortParam);
            filterParam = filterBy ? filterBy : 'all';
        } else if (!sortParam && filterParam) {
            setFilterBy(filterParam);
            sortParam = sortBy ? sortBy : 'createdDate';
        } else {
            sortParam = sortBy ? sortBy : 'createdDate';
            filterParam = filterBy ? filterBy : 'all';
        }

        let reqParams = `?sort=${sortParam},asc`;

        let requestOptions = {
            method: 'GET',
            headers: {
                'Authorization': setJwtToken(),
                'Content-type': 'application/json'
            }
        }

        await fetch(`http://localhost:8080/todo/item/${todoItems.id}/${filterParam}/${reqParams}`, requestOptions)
            .then(response => response.json())
            .then(data =>{
                setsortableItems(data.content);
                console.log("todoitems123: ", data);
            })
            .catch(error => console.log("er: ", error));
    }

    if (todoItems || sortableItems) {
        let itemArr = null;

        if(sortableItems) {
            itemArr = sortableItems;
        } else {
            itemArr = todoItems.todoItems;
        }

        items = itemArr.map((item, key) => {
            
            return <li key={key} className="list-group-item text-capitalize d-flex justify-content-between my-2">
                   
                    <div className="container">
                        <div className="row">
                            <div className="col">
                                <div className="todo-icon d-flex justify-content-between">
                                    <div className="d-flex">
                                        <input type="checkbox" className="mr-2" onClick={() => setComplete(item.id)} checked={item.status == 'COMPLETE' ? true : false}/>
                                        <h6>{item.itemName + " - " + item.simpleDeadline}</h6>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-success btn-sm mx-2" onClick={() => onOpenUpdateContainer(item)}>
                                            <i className="fas fa-pen" aria-hidden="true"></i>
                                        </button>

                                        <button type="button" className="btn btn-success btn-sm mx-2" onClick={() => deleteTodoItem(item.id)}>
                                            <i className="fas fa-trash" aria-hidden="true"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col">
                                
                                    <p>
                                        {item.description}
                                    </p>
                                
                            </div>
                        </div>
                    </div>
            </li>
        });
    }

    let addTodoListItem = async function(event) {
        event.preventDefault();
        let requestOptions = {
            method: 'POST',
            headers: {
            'Authorization': setJwtToken(),
            'Content-type': 'application/json'
            },
            body: JSON.stringify({
                itemName: newItemName,
                description: newItemDescription,
                deadline: newItemDeadline,
                dependentItemId: newDependentItemId
            })
        }
        await fetch(`http://localhost:8080/todo/item/${todoItems.id}`, requestOptions)
            .then(response => response.json())
            .then(data =>{
                getTodoItems();
            })
            .catch(error => console.log("err: ", error));
    }

    let deleteTodoItem = async function(itemId) {
        let requestOptions = {
            method: 'DELETE',
            headers: {
            'Authorization': setJwtToken(),
            'Content-type': 'application/json'
            }
        }

        await fetch(`http://localhost:8080/todo/item/${itemId}`, requestOptions)
            .then(response => {
                if (response.ok) {
                    getTodoItems();
                }
            })
    }

    let onOpenUpdateContainer = function(item) {
        setUpdateContainer(true);
        setSelectedTodoItem(item);
    }

    let updateTodoItem = async function(event) {
        //event.preventDefault();
        let requestOptions = {
            method: 'PUT',
            headers: {
                'Authorization': setJwtToken(),
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                itemName: updatedTodoItemName,
                description: updatedTodoItemDescription,
                deadline: updatedTodoItemDeadline
            })
        }
        await fetch(`http://localhost:8080/todo/item/${selectedTodoItem.id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            setUpdateContainer(false);
        })
        .catch(error => console.log('error', error));

    }

    let setComplete = async function(itemId) {
        
        let requestOptions = {
                method: 'PUT',
                headers: {
                    'Authorization': setJwtToken(),
                    'Content-type': 'application/json'
                }
            };
        
        await fetch(`http://localhost:8080/todo/item/complete/${itemId}`, requestOptions)
        .then(response => response.json())
        .then(data =>{
            console.log("rsp: ", data)
            debugger;
            if (data.error && data.status != 200) {
                alert(data.message);
            } else {
                getTodoItems();
            }
            
        })
        .catch(error => console.log("er: ", error));
    }

    let onSetDependentItem = function(todoItem) {
        setDependentItem(todoItem.itemName + " - " + todoItem.simpleDeadline);
        setNewDependentItemId(todoItem.id);
    }

    if (todoItems || sortableItems) {
        let itemArr = null;

        if(sortableItems) {
            itemArr = sortableItems;
        } else {
            itemArr = todoItems.todoItems;
        }

        dropDownTodoItems = itemArr.map((item, key) => {
            
            return <Dropdown.Item onClick={() => onSetDependentItem(item)}>{item.itemName + " - " + item.simpleDeadline}</Dropdown.Item>
        });
    }

    return(
        <div>
        <div className="card card-body my-3">
        
        <form onSubmit={addTodoListItem}>
            <div className="input-group">
                <div className="input-group-prepend">
                    <div className="input-group-text bg-primary text-white">
                        <i className="fas fa-book"/>
                    </div>
                </div>
                
                <input 
                    type="text"
                    className="form-control text-capitalize"
                    placeholder="Item Name"
                    onChange={event => setNewItemName(event.target.value)}/>
                
            </div>
            <div className="input-group">
                <div className="input-group-prepend">
                    <div className="input-group-text bg-primary text-white">
                        <i className="fas fa-info-circle"/>
                    </div>
                </div>
               
                <input 
                    type="text"
                    className="form-control text-capitalize"
                    placeholder="Description"
                    onChange={event => setNewItemDescription(event.target.value)}/>
                
            </div>
            <div className="input-group">
                <div className="input-group-prepend">
                    <div className="input-group-text bg-primary text-white">
                        <i className="fas fa-calendar-alt"/>
                    </div>
                </div>
               
                <input 
                    type="text"
                    className="form-control text-capitalize"
                    placeholder="Deadline"
                    onChange={event => setNewItemDeadline(event.target.value)}/>
                
            </div>
            <div className="input-group">
                <div className="input-group-prepend">
                    <div className="input-group-text bg-primary text-white">
                        <i className="fas fa-calendar-alt"/>
                    </div>
                </div>
               
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic3">
                            Dependent Item
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            {dropDownTodoItems}
                        </Dropdown.Menu>
                    </Dropdown>
                    <input 
                    type="text"
                    className="form-control text-capitalize"
                    placeholder="Dependent Item"
                    value={dependentItem}
                    onChange={event => setNewItemDeadline(event.target.value)} readOnly/>
                
            </div>
            <button type="submit" className="btn btn-block btn-primary mt-3">
                Add List
            </button>
        </form>
    </div>

    <div className="card card-body my-3" style= {{ display: updateContainer ? 'block':'none' }}>
        
        <form onSubmit={updateTodoItem}>
            <div className="input-group">
                <div className="input-group-prepend">
                    <div className="input-group-text bg-primary text-white">
                        <i className="fas fa-book"/>
                    </div>
                </div>
                
                <input 
                    type="text"
                    className="form-control text-capitalize"
                    placeholder="Item Name"
                    onChange={event => setUpdatedTodoItemName(event.target.value)}/>
                
            </div>
            <div className="input-group">
                <div className="input-group-prepend">
                    <div className="input-group-text bg-primary text-white">
                        <i className="fas fa-info-circle"/>
                    </div>
                </div>
               
                <input 
                    type="text"
                    className="form-control text-capitalize"
                    placeholder="Description"
                    onChange={event => setUpdatedTodoItemDescription(event.target.value)}/>
                
            </div>
            <div className="input-group">
                <div className="input-group-prepend">
                    <div className="input-group-text bg-primary text-white">
                        <i className="fas fa-calendar-alt"/>
                    </div>
                </div>
               
                <input 
                    type="text"
                    className="form-control text-capitalize"
                    placeholder="Deadline"
                    onChange={event => setUpdatedTodoItemDeadline(event.target.value)}/>
                
            </div>
            <div className="container">
                        <div className="row">
                            <div className="col">
                                <button type="button" className="btn btn-block btn-primary mt-3">
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
    <h3 className="text-capitalize text-center">
               {todoName}
            </h3>

            <div className="container d-flex justify-content-between">
                <div className="row">
                    <div className="col">
                    <Dropdown>
                        <Dropdown.Toggle variant="success" id="dropdown-basic">
                            Sort By
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item onClick={() => getTodoItems("itemName", null)}>Item Name</Dropdown.Item>
                            <Dropdown.Item onClick={() => getTodoItems("deadline", null)}>Deadline</Dropdown.Item>
                            <Dropdown.Item onClick={() => getTodoItems("createdDate", null)}>Created Date</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                    </div>

                    <div className="col">
                        <Dropdown>
                            <Dropdown.Toggle variant="success" id="dropdown-basic2">
                                Filter By
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                <Dropdown.Item onClick={() => getTodoItems(null, "all")}>All</Dropdown.Item>
                                <Dropdown.Item onClick={() => getTodoItems(null, "COMPLETE")}>Complete</Dropdown.Item>
                                <Dropdown.Item onClick={() => getTodoItems(null, "NOT_COMPLETE")}>Not complete</Dropdown.Item>
                                <Dropdown.Item onClick={() => getTodoItems(null, "EXPIRED")}>Expired</Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
            
                </div>
            </div>

        <ul className="list-group my-5">
        
            
            
            {items}
            <button type="button" className="btn btn-danger btn-block text-capitalize mt-5">
                Clear List
            </button>
        </ul>
    </div>
    </div>
    )
}

export default ListItem