import { useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [goalText, setGoalText] = useState("");
  const [message, setMessage] = useState("");
  const [goals, setGoals] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  async function loadGoals() {
    const response = await fetch(`${API_BASE}/goals`);
    const data = await response.json();
    console.log(data);
    setGoals(data);
  }
  
  async function addGoal() {
    if (goalText.trim() === "") {
      setMessage("Please type a goal first.");
      return;
    }

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
    await loadGoals(); // Refresh the goals list
  }

  async function deleteGoal(index) {
    await fetch(`${API_BASE}/goals/${index}`, {
      method: "DELETE",
    });

    await loadGoals();
  }

  function startEdit(index, goal) {
    setEditingIndex(index);
    setGoalText(goal);
  }

  async function updateGoal() {
    if (goalText.trim() === "") {
      setMessage("Goal cannot be empty.");
      return;
    }

    await fetch(`${API_BASE}/goals/${editingIndex}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal_text: goalText,
      }),
    });

    setMessage("Goal updated.");
    setGoalText("");
    setEditingIndex(null);
    await loadGoals();
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

      <button onClick={editingIndex === null ? addGoal : updateGoal}>
        {editingIndex === null ? "Add Goal" : "Save Update"}
      </button>
      
      {editingIndex !== null && (
        <button onClick={() => {
          setEditingIndex(null);
          setGoalText("");
        }}>
          Cancel Edit
        </button>
      )}
            
      <p>{message}</p>

      <h2>Your Goals</h2>

      <ul>
        {goals.map((goal, index) => (
          <li key={index}>
            {goal}
            <button onClick={() => startEdit(index, goal)}>Edit</button>
            <button onClick={() => deleteGoal(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

