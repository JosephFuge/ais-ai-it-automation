import React, { useState, useEffect } from "react";
import TaskList from "./TaskList";
import TaskStatusChart from "./Charts/TaskStatusChart";

export default function RoutineTaskManager() {
    const [taskStatusData, setTaskStatusData] = useState({
        running: [10, 12, 11, 13, 12],
        failing: [1, 2, 1, 3, 2]
    });

    function simulateTaskStatusUpdate() {
        setTaskStatusData(prevData => {
            // Create a small variation in the data
            const newRunningTasks = prevData.running.map(value => {
                // Randomly adjust by -1, 0, or 1
                const adjustment = Math.floor(Math.random() * 3) - 1;
                return Math.max(0, value + adjustment);
            });

            const newFailingTasks = prevData.failing.map(value => {
                // Randomly adjust by -1, 0, or 1
                const adjustment = Math.floor(Math.random() * 3) - 1;
                return Math.max(0, value + adjustment);
            });

            return {
                running: [
                    ...newRunningTasks.slice(1),
                    newRunningTasks[newRunningTasks.length - 1]
                ],
                failing: [
                    ...newFailingTasks.slice(1),
                    newFailingTasks[newFailingTasks.length - 1]
                ]
            };
        });
    }

    useEffect(() => {
        // Set up an interval to update the chart every 3 seconds
        const interval = setInterval(simulateTaskStatusUpdate, 3000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, []);

    return (
        <>
            <header className="topbar">
                <h2>Routine Task Management</h2>
            </header>
            <section className="task-manager-cards">
                <div style={{ 'paddingBottom': '8px' }} className="card barchart task-status-chart">
                    <h3>Task Status Overview</h3>
                    <TaskStatusChart 
                        data={taskStatusData} 
                        onRefresh={simulateTaskStatusUpdate} 
                    />
                </div>
                <div className="card task-list">
                    <TaskList />
                </div>
            </section>
        </>
    );
}