import { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:8000";

function App() {
  const [goalText, setGoalText] = useState("");
  const [message, setMessage] = useState("");
  const [goals, setGoals] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const [loginInput, setLoginInput] = useState("");
  const [currentUser, setCurrentUser] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  async function loadGoals() {
    if (!isLoggedIn || currentUser === "") return;

    const response = await fetch(`${API_BASE}/goals/${currentUser}`);
    const data = await response.json();
    setGoals(data);
  }

  useEffect(() => {
    if (isLoggedIn && currentUser !== "") {
      loadGoals();
    }
  }, [isLoggedIn, currentUser]);

  function loginUser() {
    const cleanUsername = loginInput.trim().toLowerCase();

    if (cleanUsername === "") {
      setMessage("[ Please enter a username ]");
      return;
    }

    setCurrentUser(cleanUsername);
    setIsLoggedIn(true);
    setShowLogin(false);
    setGoalText("");
    setEditingIndex(null);
    setMessage(`[ Logged in successfully ]`);
  }

  function logoutUser() {
    setCurrentUser("");
    setIsLoggedIn(false);
    setGoals([]);
    setGoalText("");
    setEditingIndex(null);
    setMessage("[ Logged out ]");
  }

  async function addGoal() {
    if (!isLoggedIn) {
      setMessage("[ Please log in first ]");
      return;
    }

    if (goalText.trim() === "") {
      setMessage("[ Please type a goal first ]");
      return;
    }

    const response = await fetch(`${API_BASE}/goals/${currentUser}`, {
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
    await loadGoals();
  }

  async function deleteGoal(index) {
    const response = await fetch(`${API_BASE}/goals/${currentUser}/${index}`, {
      method: "DELETE",
    });

    const data = await response.json();
    setMessage(data.message);
    await loadGoals();
  }

  function startEdit(index, goal) {
    setEditingIndex(index);
    setGoalText(goal);
  }

  async function updateGoal() {
    if (goalText.trim() === "") {
      setMessage("[ Goal cannot be empty ]");
      return;
    }

    const response = await fetch(`${API_BASE}/goals/${currentUser}/${editingIndex}`, {
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
    <div className="app-card">
      <img
        src="/profile-icon.png"
        alt="Profile"
        className="profile-icon"
        onClick={() => setShowLogin(true)}
      />

      {showLogin && (
        <div className="modal-overlay">
          <div className="login-modal">
            <button className="close-button" onClick={() => setShowLogin(false)}>
              ×
            </button>

            <h2>Login</h2>

            <input
              type="text"
              placeholder="Enter username"
              value={loginInput}
              onChange={(event) => setLoginInput(event.target.value)}
            />

            <button onClick={loginUser}>Login</button>
          </div>
        </div>
      )}

      <h1>Goal Tracker</h1>

      <p className="subtitle">
        Add, edit, and delete your goals as you build better habits.
      </p>

      {isLoggedIn ? (
        <div className="user-row">
          <p className="logged-in-text">Logged in as: "<span className="all-caps">{currentUser[0]}</span>{currentUser.slice(1)}"</p>
          <button onClick={logoutUser}>Logout</button>
        </div>
      ) : (
        <p className="logged-out-text">Click the profile icon to log in.</p>
      )}

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
        <button
          onClick={() => {
            setEditingIndex(null);
            setGoalText("");
          }}
        >
          Cancel Edit
        </button>
      )}

      <p className="message">{message}</p>

      <h2>Your Goals</h2>

      {goals.length === 0 ? (
        <p className="empty-message">No goals yet... Add your first one above!</p>
      ) : (
        <ul>
          {goals.map((goal, index) => (
            <li key={index}>
              <button onClick={() => startEdit(index, goal)}>Edit</button>
              <span>{goal}</span>
              <button onClick={() => deleteGoal(index)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;