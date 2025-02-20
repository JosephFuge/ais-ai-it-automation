import React from "react";
import TaskList from "./components/TaskList";
import Sidebar from "./components/Sidebar";
import TaskUrgencyChart from "./components/TaskUrgencyChart";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Management Dashboard</h1>
      </header>
      <div className="dashboard">
        <Sidebar />
        <main className="content">
          <header class="topbar">
            <h2>Morning, Ryan!</h2>
            <p>Have a nice day!</p>
            <div class="user-info">
              <span>Ryan Snow</span>
            </div>
          </header>

          <section class="dashboard-cards">
            <div class="card engagement">
              <h3>Engagement</h3>
              <TaskUrgencyChart />
            </div>
            <div class="card chainlit">
              <iframe
                title="chatbot"
                src="http://127.0.0.1:8000/chainlit"
                id="the-frame"
                data-cy="the-frame"
                width="100%"
                height="500px"
              ></iframe>
            </div>
            <div class="card stats">
              <h3>Congratulations!</h3>
              <div class="chart-value">23</div>
              <p>GitHub issues closed this week.</p>
            </div>
            <div class="card stats">
              <h3>Project at Risk</h3>
              <p>Website Redesign</p>
              <p>8 Days Delay</p>
            </div>
            <div class="card task-list">
              <TaskList />
            </div>
          </section>
        </main>
        <script>
        </script>
      </div>
    </div>
  );
}

export default App;
