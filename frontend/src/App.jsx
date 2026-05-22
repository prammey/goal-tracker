import { useEffect, useState } from "react";

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

  useEffect(() => {
    loadGoals();
  }, []);

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

    setTimeout(() => {
      setMessage("");
    }, 3000);
    
    setGoalText("");
    await loadGoals(); // Refresh the goals list
  }

  async function deleteGoal(index) {
    const response = await fetch(`${API_BASE}/goals/${index}`, {
      method: "DELETE",
    });

    const data = await response.json();
    setMessage(data.message);

    setTimeout(() => {
      setMessage("");
    }, 3000);

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

    const response = await fetch(`${API_BASE}/goals/${editingIndex}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal_text: goalText,
      }),
    });

    const data = await response.json();
    setMessage(data.message);

    setTimeout(() => {
      setMessage("");
    }, 3000);

    setGoalText("");
    setEditingIndex(null);
    await loadGoals();
  }

  return (
    <div>
      <h1>Goal Tracker</h1>

      <p className="subtitle">
        Add, edit, and delete your goals as you build better habits.
      </p>

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

      {goals.length === 0 ? (
        <p className="empty-message">No goals yet... Add your first one above!</p>
      ) : (
        <ul>
          {goals.map((goal, index) => (
            <li key={index}>
              <button onClick={() => startEdit(index, goal)}>Edit</button>
              -- {goal} --
              <button onClick={() => deleteGoal(index)}>Delete</button>
            </li>
          ))}
        </ul>
    )}
    </div>
  );
}

export default App;

