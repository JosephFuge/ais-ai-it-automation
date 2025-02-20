# ais-ai-it-automation

### TODO

- [x] others...



### set up

Create a virtual environment and install dependencies from `requrements.txt`

```sh
conda create --name chainlit-project
conda activate chainlit-project
pip install -r ./requirements.txt # run with venv activated
```

check that chainlit was installed correctly by running `chainlit --version`

### Redis and Celery Setup

1. Start Redis server:
```sh
redis-server
```

2. Start Celery worker in a new terminal:
```sh
celery -A celery_config worker --loglevel=info
```
3. Start Celery beat for scheduled tasks (optional):
```sh
celery -A celery_config beat --loglevel=info
```

### initialize project

Create a `.env` file and store your API keys

```sh
OPENAI_API_KEY=<<openai-key>>
JIRA_API_KEY=<<jira-key>>
```

To start up the application, start the back-and and the front-end separately.

```sh
uvicorn app:app --reload
```
On another terminal, run:
```sh
cd frontend
npm install # only the first time
npm run start
```

### how the app works

1. The application runs on FastAPI on the backend and React on the Front end

2. `jira_ticket.py` is chat completions script with functions that use the message history to send a post request to the Jira API and create a new issue.

3. The task system is managed via the React interface. Tasks are stored (for demo purposes) 
in tasks.json and executed through the Celery workers

