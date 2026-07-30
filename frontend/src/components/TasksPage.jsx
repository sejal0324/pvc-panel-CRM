import { useEffect, useState } from "react";
import { Calendar, Building2, Clock, CheckCircle } from "lucide-react";
import * as taskApi from "../apis/taskApi";
import "./TasksPage.css";

export default function TasksPage() {

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadTasks();

    }, []);

    async function loadTasks() {

        try {

            const data = await taskApi.getTasks();

            setTasks(data);

        }

        catch (err) {

            console.error(err);

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return <h3>Loading Tasks...</h3>;

    }

    return (

        <div className="tasks-container">

            <div className="tasks-header">

                <h1>Today's Tasks</h1>

                <p>
                    AI generated follow-ups and visits
                </p>

            </div>

            <div className="tasks-grid">

                {tasks.map(task => (

                    <div
                        className="task-card"
                        key={task.task_id}
                    >

                        <div className="task-top">

                            <Building2 size={20} />

                            <span>

                                {task.business_name}

                            </span>

                        </div>

                        <div className="task-body">

                            <div>

                                <Calendar size={16}/>

                                {task.due_date}

                            </div>

                            <div>

                                <Clock size={16}/>

                                {task.task_type}

                            </div>

                        </div>

                        <div className="task-footer">

                            <span
                                className={`status ${task.status.toLowerCase()}`}
                            >

                                {task.status}

                            </span>

                            <button>

                                <CheckCircle size={18}/>

                                Complete

                            </button>

                        </div>

                    </div>

                ))}

            </div>

        </div>

    );

}