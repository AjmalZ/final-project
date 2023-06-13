import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { tasks } from 'reducers/Tasks';
import { category } from 'reducers/Category';
import { API_URL } from 'utils/urls';
import { user } from 'reducers/User';
import { TopBar } from './TopBar';
import { ToDoCard } from './ToDoCard';
import './Main.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CategoryColumn } from './CategoryColumn';
import { SideDrawer } from './SideDrawer';
import { NewCategoryButton } from './NewCategoryButton';
import { NewTaskButton } from './NewTaskButton';
import { Footer } from './Footer';
import { WelcomeText } from './WelcomeText';

export const Main = () => {
    const taskItems = useSelector((store) => store.tasks.items);
    const categories = useSelector((store) => store.category.items);
    const dispatch = useDispatch();
    const accessToken = useSelector((store) => store.user.accessToken);
    const username = useSelector((store) => store.user.username);
    const navigate = useNavigate();

    const [taskTitle, setTaskTitle] = useState('');
    const [taskMessage, setTaskMessage] = useState('');
    const [taskCategory, setTaskCategory] = useState(categories.length > 0 ? categories[0]._id : "");

    const [categoryTitle, setCategoryTitle] = useState('');
    const [taskDueDate, setTaskDueDate] = useState("");
    const [taskPriority, setTaskPriority] = useState(1);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');

    const [filterByCategory, setFilterByCategory] = useState([])

    const resetForm = () => {
        setTaskTitle('');
        setTaskMessage('');
        setTaskCategory(categories.length > 0 ? categories[0]._id : "");
        setTaskDueDate("");
        setTaskPriority(1);
    }

    useEffect(() => {
        if (!accessToken) {
            if (localStorage.getItem('accessToken')) {
                dispatch(user.actions.setAccessToken(localStorage.getItem('accessToken')));
                dispatch(user.actions.setUsername(localStorage.getItem('username')));
                dispatch(user.actions.setUserId(localStorage.getItem('userId')));
            } else
                navigate('/login');
        }
    }, [accessToken]);

    useEffect(() => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
        };

        fetch(API_URL('tasks'), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    dispatch(tasks.actions.setError(null));

                    dispatch(tasks.actions.setItems(data.response));
                } else {
                    dispatch(tasks.actions.setError(data.error));
                    dispatch(tasks.actions.setItems([]));
                }
            });

        fetch(API_URL('category'), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    dispatch(category.actions.setError(null));

                    dispatch(category.actions.setItems(data.response));

                } else {
                    dispatch(category.actions.setError(data.error));
                    dispatch(category.actions.setItems([]));
                }
            });

        fetch(API_URL('user'), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    dispatch(user.actions.setError(null));
                    setFirstName(data.response.firstName)
                    setLastName(data.response.lastName)
                    setEmail(data.response.email)
                    //dispatch(user.actions.setItem(data.response));
                } else {
                    dispatch(user.actions.setError(data.error));
                }
            });
    }, [accessToken, dispatch]);

    const updateUser = (userId) => {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ firstName: firstName, lastName: lastName, email: email }),
        };
        fetch(API_URL(`user/${userId}`), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    console.log("User updated successfully")
                } else {
                    dispatch(user.actions.setError(data.error));
                }
            });
    };


    const updateCategory = (categoryId) => {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ title: categoryTitle }),
        };
        fetch(API_URL(`category/${categoryId}`), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    dispatch(category.actions.setError(null));
                    const tempCategories = categories.map((item) => {
                        return { ...item, title: item._id === categoryId ? categoryTitle : item.title };
                    });
                    dispatch(category.actions.setItems([...tempCategories]));
                } else {
                    dispatch(category.actions.setError(data.error));
                }
            });
    };

    const updateTask = (taskId) => {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ title: taskTitle, message: taskMessage, dueDate: taskDueDate, category: taskCategory, priority: taskPriority }),
        };

        fetch(API_URL(`tasks/${taskId}`), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    let taskItemsWithoutTask = taskItems.filter((item) => item._id !== taskId);
                    dispatch(tasks.actions.setError(null));
                    resetForm()
                    dispatch(tasks.actions.setItems([...taskItemsWithoutTask, data.response]));
                } else {
                    dispatch(tasks.actions.setError(data.error));
                }
            });
    };

    //This should be removed, use the one above
    const updateTaskDropped = (taskId, title, message, cat, dueDate, priority) => {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ title: title, message: message, category: cat, duDate: dueDate, priority: priority }),
        };

        fetch(API_URL(`tasks/${taskId}`), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    let taskItemsWithoutTask = taskItems.filter((item) => item._id !== taskId);
                    dispatch(tasks.actions.setError(null));
                    dispatch(tasks.actions.setItems([...taskItemsWithoutTask, data.response]));
                } else {
                    dispatch(tasks.actions.setError(data.error));
                }
            });
    };


    const onDragEnd = (result) => {
        const { source, destination } = result;
        const tempTaskId = result.draggableId
        const tempCatId = result.destination.droppableId
        const tempTask = taskItems.find((task) => task._id === tempTaskId);
        updateTaskDropped(tempTaskId, tempTask.title, tempTask.message, tempCatId, tempTask.duDate);
        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            return;
        }

        const categoryTasks = taskItems.filter((task) => task.category === source.droppableId);
        const draggedTask = categoryTasks[source.index];

        const updatedTasks = Array.from(categoryTasks);
        updatedTasks.splice(source.index, 1);
        updatedTasks.splice(destination.index, 0, draggedTask);

        const updatedTaskItems = taskItems.map((task) => {
            if (task.category === source.droppableId) {
                return { ...task, index: updatedTasks.findIndex((t) => t._id === task._id) };
            }
            return task;
        });

        dispatch(tasks.actions.setItems(updatedTaskItems));
    };

    return (
        <div className="mainContainer">
            <TopBar
                taskItems={taskItems}
                firstName={firstName}
                lastName={lastName}
                setFirstName={setFirstName}
                setLastName={setLastName}
                email={email}
                setEmail={setEmail}
                updateUser={updateUser}
            />



            <div className="drawer mainDrawer h-screen">

                <input id="my-drawer" type="checkbox" className="drawer-toggle" />

                <div className="drawer-content scrollbar-thin">
                    <div className="mx-10">
                        <WelcomeText username={username} />
                        <div className="flex gap-5 w-full justify-items-center kanban">
                            <DragDropContext onDragEnd={onDragEnd}>
                                {categories.map((cat) => (
                                    <Droppable droppableId={cat._id} key={cat._id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={{ backgroundColor: snapshot.isDraggingOver ? 'hsla(0, 0%, 100%, .6)' : 'hsla(0, 0%, 100%, .2)' }}
                                                {...provided.droppableProps}
                                                className="kanbanCategory ">

                                                <div>
                                                    <CategoryColumn cat={cat} updateCategory={updateCategory} setCategoryTitle={setCategoryTitle} accessToken={accessToken} categories={categories} category={category} taskItems={taskItems} />
                                                </div>
                                                <div>
                                                    {taskItems
                                                        .filter((categoryTask) => (categoryTask.category === cat._id && filterByCategory.length === 0) || (categoryTask.category === cat._id && filterByCategory.length > 0 && filterByCategory.find(priorityFilter => priorityFilter === categoryTask.priority)))
                                                        .map((task, index) => (

                                                            <Draggable draggableId={task._id} index={index} key={task._id}>
                                                                {(provided, snapshot) => (
                                                                    <div
                                                                        ref={provided.innerRef}
                                                                        {...provided.draggableProps}
                                                                        {...provided.dragHandleProps}
                                                                    >
                                                                        <ToDoCard
                                                                            task={task}
                                                                            categories={categories}
                                                                            updateTask={updateTask}
                                                                            setTaskTitle={setTaskTitle}
                                                                            setTaskMessage={setTaskMessage}
                                                                            setTaskCategory={setTaskCategory}
                                                                            setTaskDueDate={setTaskDueDate}
                                                                            setTaskPriority={setTaskPriority}
                                                                            accessToken={accessToken}
                                                                            tasks={tasks}
                                                                            taskItems={taskItems}
                                                                        />
                                                                    </div>
                                                                )}
                                                            </Draggable>
                                                        ))}

                                                </div>
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>

                                ))}
                            </DragDropContext>
                        </div>
                    </div>
                </div>
                <SideDrawer filterByCategory={filterByCategory} setFilterByCategory={setFilterByCategory} />
                <NewTaskButton
                    taskTitle={taskTitle}
                    taskMessage={taskMessage}
                    taskCategory={taskCategory}
                    setTaskTitle={setTaskTitle}
                    setTaskCategory={setTaskCategory}
                    setTaskMessage={setTaskMessage}
                    taskDueDate={taskDueDate}
                    setTaskDueDate={setTaskDueDate}
                    setTaskPriority={setTaskPriority}
                    taskPriority={taskPriority}
                    taskItems={taskItems}
                    resetForm={resetForm}
                />
                <NewCategoryButton categoryTitle={categoryTitle} setCategoryTitle={setCategoryTitle} />

            </div>
            <Footer />
        </div>
    );
};
