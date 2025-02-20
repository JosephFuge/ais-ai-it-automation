# ais-ai-it-automation

### TODO

- [ ] Build the interface for chatbot
- [ ] others...



### set up

Create a virtual environment that installs the required dependencies

```sh
conda create --name chainlit-project python=3.0
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

Create a `.env` file and store your Openai API key in a variable called `OPENAI_API_KEY` and another one called `HUBSPOT_KEY`

```sh
OPENAI_API_KEY=<<openai-key>>
JIRA_API_KEY=<<jira-key>>
```

Then, run the program with:

```sh
uvicorn app:app --reload
```

> [!NOTE]
> The app runs by default on port 8000. If the port is taken, run `chainlit run app.py --port 3000 -w` or try a different port.
> UPDATE: Need to figure out how to change ports with uvicorn.


### how the app works

1. The chainlit behavior is dictated by `chainlit_app.py`. Once a user is done interacting with the bot and the session is interrupted by closing/refreshing the window or starting a new chat, the message history is sent to `jira_ticket.py`.

2. `jira_ticket.py` is chat completions script with functions that use the message history to send a post request to the Jira API and create a new issue.

3. The task system is managed via the React interface. Tasks are stored (for demo purposes) 
in tasks.json and executed through the Celery workers
