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
    const taskItems = useSelector((store) => store.tasks.items);
    const categories = useSelector((store) => store.category.items);
    const accessToken = useSelector((store) => store.user.accessToken);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [filterByCategory, setFilterByCategory] = useState([])

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

    }, [accessToken, dispatch]);

    const updateTaskDropped = (taskId, cat) => {
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

        updateTaskDropped(tempTaskId, tempCatId);

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
            <TopBar taskItems={taskItems} />
            <div className="drawer mainDrawer h-screen">
                <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    <div className="mx-10">
                        <WelcomeText />
                        <div className="flex gap-5 w-full justify-items-center kanban">
                            <DragDropContext onDragEnd={onDragEnd}>
                                {categories.map((cat) => (
                                    <Droppable droppableId={cat._id} key={cat._id}>
                                        {(provided, snapshot) => (
                                            <div
                                                ref={provided.innerRef}
                                                style={{ backgroundColor: snapshot.isDraggingOver ? 'hsla(0, 0%, 100%, .6)' : 'hsla(0, 0%, 100%, .2)' }}
                                                {...provided.droppableProps}
                                                className="kanbanCategory scrollbar-thin">
                                                <div>
                                                    <CategoryColumn cat={cat} taskItems={taskItems} />
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