import { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [goalText, setGoalText] = useState("");
  const [message, setMessage] = useState("");

  async function addGoal() {
    const response = await fetch(`${API_BASE}/goals`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal_text: goalText,
      }),
    });

    const data = await response.json();
    setMessage(data.message);
    setGoalText("");
  }

  return (
    <div>
      <h1>Goal Tracker</h1>

      <input
        type="text"
        placeholder="Type your goal..."
        value={goalText}
        onChange={(event) => setGoalText(event.target.value)}
      />

      <button onClick={addGoal}>Add Goal</button>

      <p>{message}</p>
    </div>
  );
}

export default App;