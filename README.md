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

1. The chatbot behavior is dictated by `chainlit_app.py`. Once a user is done interacting with the bot and the session is interrupted by closing/refreshing the window or starting a new chat, the message history is sent to `jira_ticket.py`.

2. `jira_ticket.py` is chat completions script with functions that use the message history to create a new issue in Jira.
