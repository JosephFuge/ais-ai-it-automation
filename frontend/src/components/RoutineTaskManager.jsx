import React, { useState, useEffect } from "react";
import TaskList from "./TaskList";
import TaskStatusChart from "./Charts/TaskStatusChart";
import axios from "axios";

export default function RoutineTaskManager() {
    const [taskStatusData, setTaskStatusData] = useState({
        running: [0, 0, 0, 0, 0],
        failing: [0, 0, 0, 0, 0]
    });

    async function fetchTaskStatusData() {
        try {
            // In a real application, this would come from your backend
            // For now, we'll generate some sample data
            const runningTasks = Math.floor(Math.random() * 10) + 5; // 5-15 tasks
            const failingTasks = Math.floor(Math.random() * 3); // 0-2 failing tasks
            
            setTaskStatusData({
                running: [
                    runningTasks - 2,
                    runningTasks - 1,
                    runningTasks,
                    runningTasks + 1,
                    runningTasks
                ],
                failing: [
                    failingTasks,
                    failingTasks + 1,
                    failingTasks,
                    failingTasks + 1,
                    failingTasks
                ]
            });
        } catch (error) {
            console.error("Error fetching task status data:", error);
        }
    }

    useEffect(() => {
        fetchTaskStatusData();
        // Refresh data every 5 minutes
        const interval = setInterval(fetchTaskStatusData, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <header className="topbar">
                <h2>Routine Task Management</h2>
            </header>
            <section className="dashboard-cards">
                <div style={{ 'paddingBottom': '60px' }} className="card barchart">
                    <h3>Task Status Overview</h3>
                    <TaskStatusChart data={taskStatusData} onRefresh={fetchTaskStatusData} />
                </div>
                <div className="card task-list">
                    <TaskList />
                </div>
            </section>
        </>
    );
} 