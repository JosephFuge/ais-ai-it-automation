import React from "react";
import TaskList from "./components/TaskList";

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Task Management Dashboard</h1>
      </header>
      <main>
        <TaskList />
      </main>
    </div>
  );
}

export default App;
