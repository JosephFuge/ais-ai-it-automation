from fastapi import FastAPI, Request, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from jinja2 import Environment, FileSystemLoader
from chainlit.utils import mount_chainlit
from celery import Celery
from requests.auth import HTTPBasicAuth
import time
import json
import logging
import os, requests

app = FastAPI()

# Update static files configuration
app.mount("/static", StaticFiles(directory="static"), name="static")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:8000", "http://127.0.0.1:3000", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

templates = Environment(loader=FileSystemLoader("templates"))

# Cache Busting
CACHE_BUST = str(int(time.time()))

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    template = templates.get_template("index.html")
    return HTMLResponse(template.render(request=request, cache_bust=CACHE_BUST))

def fetch_issues():
    api_key=os.environ['JIRA_API_KEY']
    headers={"content-type": "application/json"}
    auth = HTTPBasicAuth("jfob.mail@gmail.com", api_key)
    url = 'https://it-automation-challenge.atlassian.net/rest/api/3/search/jql'
    raw = requests.get(url=url, headers=headers, auth=auth, params={'jql': 'project = SC', 'fields': ['*all']})

    response = raw.json()
    # print(json.dumps(response))
    issues = response['issues']

    urgencies = {'Critical': 0, 'High': 0, 'Medium': 0, 'Low': 0}
    
    for issue in issues:
        urgency = str(issue['fields']['customfield_10042']['value'])
        urgencies[urgency] = urgencies.get(urgency, 0) + 1
        print(urgency)
        
    print(urgencies['Critical'])
    return urgencies

@app.get("/tickets", response_class=JSONResponse)
async def fetch_tickets(request: Request):
    print('TICKETS HIT')
    tickets = fetch_issues()
    return JSONResponse(content=tickets)

mount_chainlit(app=app, target="chainlit_app.py", path="/chainlit")

# Celery Configuration
celery_app = Celery(
    'tasks',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0'
)
celery_app.config_from_object('celeryconfig')

@celery_app.task
def cleanup_logs():
    time.sleep(2)  # Simulating some work
    print("Performing log cleanup...")
    return "Log cleanup completed!"

@celery_app.task
def system_monitoring():
    time.sleep(2)  # Simulating some work
    print("Performing system monitoring...")
    return "System monitoring completed!"

@celery_app.task
def resource_management():
    time.sleep(2)  # Simulating some work
    print("Performing resource management...")
    return "Resource management completed!"

# Task Definitions Management
TASKS_FILE = 'tasks.json'

def load_tasks():
    if os.path.exists(TASKS_FILE):
        try:
            with open(TASKS_FILE, 'r') as file:
                return json.load(file)
        except json.JSONDecodeError as e:
            logging.error(f"Error decoding JSON from {TASKS_FILE}: {e}")
            return []
    return []

def save_tasks(tasks):
    with open(TASKS_FILE, 'w') as file:
        json.dump(tasks, file)

@app.get("/tasks")
async def get_tasks():
    try:
        print("RETURNING TASKS")
        tasks = load_tasks()
        return JSONResponse(tasks)
    except Exception as e:
        logging.error(f"Error fetching tasks: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/add-task")
async def add_task(request: Request):
    try:
        task = await request.json()
        tasks = load_tasks()
        tasks.append(task)
        save_tasks(tasks)
        return JSONResponse({"message": "Task added successfully!"})
    except Exception as e:
        logging.error(f"Error adding task: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.delete("/remove-task")
async def remove_task(request: Request):
    try:
        data = await request.json()
        task_id = data.get('task_id')
        tasks = load_tasks()
        tasks = [task for task in tasks if task['id'] != task_id]
        save_tasks(tasks)
        return JSONResponse({"message": "Task removed successfully!"})
    except Exception as e:
        logging.error(f"Error removing task: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.post("/run-task")
async def run_task(request: Request):
    try:
        data = await request.json()
        task_type = data.get('task_type')
        if task_type == 'cleanup_logs':
            task = cleanup_logs.delay()
        elif task_type == 'system_monitoring':
            task = system_monitoring.delay()
        elif task_type == 'resource_management':
            task = resource_management.delay()
        else:
            raise HTTPException(status_code=400, detail="Invalid task type")
        return JSONResponse({"message": "Task scheduled!", "task_id": task.id})
    except Exception as e:
        logging.error(f"Error running task: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.get("/task-status/{task_id}")
async def task_status(task_id: str):
    try:
        task = celery_app.AsyncResult(task_id)
        return JSONResponse({"task_status": task.status, "result": task.result})
    except Exception as e:
        logging.error(f"Error fetching task status: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
