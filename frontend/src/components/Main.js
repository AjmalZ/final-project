import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { tasks } from 'reducers/Tasks';
import { category } from 'reducers/Category';
import { API_URL } from 'utils/urls';
import { user } from 'reducers/User';
import { TopBar } from './TopBar';
import { ToDoCard } from './ToDoCard';
import '../css/Main.css';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { CategoryColumn } from './CategoryColumn';
import { SideDrawer } from './SideDrawer';
import { NewCategoryButton } from './NewCategoryButton';
import { NewTaskButton } from './NewTaskButton';
import { Footer } from './Footer';
import { WelcomeText } from './WelcomeText';

export const Main = () => {
    // Redux state selectors
    const taskItems = useSelector((store) => store.tasks.items);
    const categories = useSelector((store) => store.category.items);
    const accessToken = useSelector((store) => store.user.accessToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Local state
    const [filterByCategory, setFilterByCategory] = useState([])

    useEffect(() => {
        // Check if the user is authenticated
        if (!accessToken) {
            if (localStorage.getItem('accessToken')) {
                // If access token is found in local storage, set it in Redux store
                dispatch(user.actions.setAccessToken(localStorage.getItem('accessToken')));
                dispatch(user.actions.setUsername(localStorage.getItem('username')));
                dispatch(user.actions.setUserId(localStorage.getItem('userId')));
            } else {
                // If no access token is found, navigate to the login page
                navigate('/login');
            }
        }
    }, [accessToken]);

    useEffect(() => {
        // Fetch tasks and categories from the API when access token changes
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
                    // If the API call is successful, update tasks in Redux store
                    dispatch(tasks.actions.setError(null));
                    dispatch(tasks.actions.setItems(data.response));
                } else {
                    // If the API call fails, update the error state in Redux store
                    dispatch(tasks.actions.setError(data.error));
                    dispatch(tasks.actions.setItems([]));
                }
            });

        fetch(API_URL('category'), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // If the API call is successful, update categories in Redux store
                    dispatch(category.actions.setError(null));
                    dispatch(category.actions.setItems(data.response));

                } else {
                    // If the API call fails, update the error state in Redux store
                    dispatch(category.actions.setError(data.error));
                    dispatch(category.actions.setItems([]));
                }
            });

    }, [accessToken, dispatch]);

    const updateTaskDropped = (taskId, cat) => {
        // Update the category of a dropped task in the backend
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: accessToken,
            },
            body: JSON.stringify({ category: cat }),
        };

        fetch(API_URL(`tasks/${taskId}`), options)
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    // If the API call is successful, update the task in Redux store
                    let taskItemsWithoutTask = taskItems.filter((item) => item._id !== taskId);
                    dispatch(tasks.actions.setError(null));
                    dispatch(tasks.actions.setItems([...taskItemsWithoutTask, data.response]));
                } else {
                    // If the API call fails, update the error state in Redux store
                    dispatch(tasks.actions.setError(data.error));
                }
            });
    };

    const onDragEnd = (result) => {
        // Handle the end of a drag and drop operation
        const { source, destination } = result;
        const tempTaskId = result.draggableId
        const tempCatId = result.destination.droppableId

        // Update the category of the dropped task in the backend
        updateTaskDropped(tempTaskId, tempCatId);

        if (!destination) return;

        if (source.droppableId === destination.droppableId && source.index === destination.index) {
            // If the task is dropped in the same position, no need to update the state
            return;
        }

        // Reorder the tasks within the category
        const categoryTasks = taskItems.filter((task) => task.category === source.droppableId);
        const draggedTask = categoryTasks[source.index];

        const updatedTasks = Array.from(categoryTasks);
        updatedTasks.splice(source.index, 1);
        updatedTasks.splice(destination.index, 0, draggedTask);

        // Update the task items in the Redux store with the updated task order
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
            <TopBar taskItems={taskItems} />
            <div className="drawer mainDrawer h-screen">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <div className="mx-10">
                        <WelcomeText />
                        <div className="flex gap-5 w-full justify-items-center kanban">
                            <DragDropContext onDragEnd={onDragEnd}>
                                {/* Render the category columns */}
                                {categories.map((cat) => (
                                    <Droppable droppableId={cat._id} key={cat._id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={{ backgroundColor: snapshot.isDraggingOver ? 'hsla(0, 0%, 100%, .6)' : 'hsla(0, 0%, 100%, .2)' }}
                                                {...provided.droppableProps}
                                                className="kanbanCategory scrollbar-thin">
                                                <div>
                                                    {/* Render the tasks in each category */}
                                                    <CategoryColumn cat={cat} taskItems={taskItems} />
                                                </div>
                                                <div>
                                                    {/* Filter and render the tasks based on category and priority */}
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
                                                                        <ToDoCard task={task} taskItems={taskItems} />
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
                <NewTaskButton taskItems={taskItems} />
                <NewCategoryButton />
            </div>
            <Footer />
        </div>
    );
};
