import React, { useState, useEffect } from "react";
import axios from "axios";
import "./TaskList.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    id: "",
    task_type: "cleanup_logs",
    schedule: "hourly",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch tasks
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://127.0.0.1:8000/tasks");
      setTasks(response.data);
    } catch (error) {
      setError("Failed to fetch tasks");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add new task
  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/add-task", newTask);
      fetchTasks();
      setNewTask({ id: "", task_type: "cleanup_logs", schedule: "hourly" });
    } catch (error) {
      setError("Failed to add task");
      console.error("Error adding task:", error);
    }
  };

  // Delete task
  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete("http://127.0.0.1:8000/remove-task", {
        data: { task_id: taskId },
      });
      fetchTasks();
    } catch (error) {
      setError("Failed to delete task");
      console.error("Error deleting task:", error);
    }
  };

  // Run task
  const handleRunTask = async (taskType) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/run-task", {
        task_type: taskType,
      });
      alert(`Task scheduled! Task ID: ${response.data.task_id}`);
    } catch (error) {
      setError("Failed to run task");
      console.error("Error running task:", error);
    }
  };

  return (
    <div className="task-list-container">
      <h2>System Tasks Management</h2>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          placeholder="Task ID"
          value={newTask.id}
          onChange={(e) => setNewTask({ ...newTask, id: e.target.value })}
          required
        />
        <select
          value={newTask.task_type}
          onChange={(e) =>
            setNewTask({ ...newTask, task_type: e.target.value })
          }
        >
          <option value="cleanup_logs">Cleanup Logs</option>
          <option value="system_monitoring">System Monitoring</option>
          <option value="resource_management">Resource Management</option>
        </select>
        <select
          value={newTask.schedule}
          onChange={(e) => setNewTask({ ...newTask, schedule: e.target.value })}
        >
          <option value="hourly">Hourly</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Tasks List */}
      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : (
        <div className="tasks-grid">
          {tasks.map((task) => (
            <div key={task.id} className="task-card">
              <h3>{task.task_type}</h3>
              <p className="schedule">Schedule: {task.schedule}</p>
              <div className="task-actions">
                <button
                  onClick={() => handleRunTask(task.task_type)}
                  className="run-button"
                >
                  Run Now
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
