import React, { useState, useEffect } from "react";
import TaskList from "./TaskList";
import TaskStatusChart from "./Charts/TaskStatusChart";

export default function RoutineTaskManager() {
    const [timeframe, setTimeframe] = useState('1h');
    const default1hRunning = [10, 12, 11, 13, 12];
    const default1hFailing = [1, 2, 1, 3, 2];
    const [taskStatusData, setTaskStatusData] = useState({
        running: default1hRunning,
        failing: default1hFailing
    });

    function simulateTaskStatusUpdate() {
        setTaskStatusData(prevData => {
            // Determine max values based on timeframe
            const maxRunningTasks = {
                '1h': 15,
                '4h': 25,
                '8h': 35,
                '12h': 45,
                '24h': 60
            }[timeframe];

            const maxFailingTasks = {
                '1h': 4,
                '4h': 6,
                '8h': 8,
                '12h': 10,
                '24h': 12
            }[timeframe];

            // Create a small variation in the data
            const newRunningTasks = prevData.running.map(value => {
                if (value > maxRunningTasks) {
                    return maxRunningTasks;
                }

                // Randomly adjust by -1, 0, or 1
                const adjustment = Math.floor(Math.random() * 3) - 1;
                return Math.max(0, value + adjustment);
            });

            const newFailingTasks = prevData.failing.map(value => {
                if (value > maxFailingTasks) {
                    return maxFailingTasks;
                }

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

    function getMultiplier(selectedTimeframe) {
        const parsedTimeframe = parseInt(selectedTimeframe.substring(0, selectedTimeframe.indexOf('h')));

        if (parsedTimeframe === 1) {
            return parsedTimeframe;
        } else if (parsedTimeframe === 4) {
            return 2;
        } else if (parsedTimeframe === 8) {
            return 3;
        } else if (parsedTimeframe === 12) {
            return 4;
        } else if (parsedTimeframe === 24) {
            return 5;
        }
    }

    useEffect(() => {
        // Set up an interval to update the chart every 3 seconds
        const interval = setInterval(simulateTaskStatusUpdate, 3000);

        // Clean up the interval when the component unmounts
        return () => clearInterval(interval);
    }, [timeframe]); // Add timeframe to dependency array

    const handleTimeframeChange = (newTimeframe) => {
        setTimeframe(newTimeframe);
        setTaskStatusData({
            running: default1hRunning.map(value => value * getMultiplier(newTimeframe)),
            failing: default1hFailing.map(value => value * getMultiplier(newTimeframe)),
        });
        // simulateTaskStatusUpdate();
    };

    return (
        <>
            <header className="topbar">
                <h2>Routine Task Management</h2>
            </header>
            <section className="task-manager-cards">
                <div style={{ 'paddingBottom': '8px' }} className="card barchart task-status-chart">
                    <TaskStatusChart 
                        data={taskStatusData} 
                        onRefresh={simulateTaskStatusUpdate} 
                        timeframe={timeframe}
                        onTimeframeChange={handleTimeframeChange}
                    />
                </div>
                <div className="card task-list">
                    <TaskList />
                </div>
            </section>
        </>
    );
}