import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

GOALS_FILE = "goals.json"
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Goal(BaseModel):
    goal_text: str


def load_goals_from_file():
    with open(GOALS_FILE, "r") as file:
        return json.load(file)
def save_goals_to_file():
    with open(GOALS_FILE, "w") as file:
        json.dump(goals, file)
goals = load_goals_from_file()


@app.get("/")
def read_root():
    return {"message": "Welcome to your goal tracker!"}

@app.post("/goals")
def add_goal(goal: Goal):
    goals.append(goal.goal_text)
    save_goals_to_file()
    return {"message": f"Goal added: {goal.goal_text}"}

@app.get("/goals")
def get_goal():
    return goals

@app.put("/goals/{index}")
def update_goal(index: int, goal: Goal):
    if index < 0 or index >= len(goals):
        return {"error": "Goal not found"}
    goals[index] = goal.goal_text
    save_goals_to_file()
    return {"message": f"Goal updated to: {goal.goal_text}"}

@app.delete("/goals/{index}")
def delete_goal(index: int):
    if index < 0 or index >= len(goals):
        return {"error": "Goal not found"}
    removed_goal = goals.pop(index)
    save_goals_to_file()
    return {"message": f"Goal deleted: {removed_goal}"}

