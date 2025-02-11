# ais-ai-it-automation

### TODO

- [x] Get documentation to interact with Hubspot API and document here, specifically to use the [tickets object](https://developers.hubspot.com/docs/reference/api/crm/objects/tickets).
- [x] Learn about using the [actions](https://docs.chainlit.io/concepts/action) feature in Chainlit and assess if that will help us send POST request to Hubspot (as of now, we are not implementing actions)
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

### initialize project

Create a `.env` file and store your Openai API key in a variable called `OPENAI_API_KEY`

```sh
OPENAI_API_KEY=<<the-key>>
```

Then, run the program with:

```sh
chainlit run app.py -w
```

> [!NOTE]
> The app runs by default on port 8000. If the port is taken, run `chainlit run app.py --port 3000 -w` or try a different port.


### how the app works

1. The chainlit interface and behavior is dictated by `app.py`. Once a user is done interacting with the bot and the session is interrupted by closing/refreshing the window or starting a new chat, the message history is sent to `ticket_generator.py`.

2. The `ticket_generator.py` file receives the user history as input and passes it to another chat completions object, which summarizes the conversation and formats it as a json object which we will send to the Hubspot API.

3. Once the response is cleaned, summarized, and formatted appropriately, it is sent to `hubspot_connect.py` which sends the data in a request to post it to the Hubspot Tickets app via the API.

4. `logger.py` is just a set of functions that log some of the behavior of the three different steps from above. Mostly just used for debugging, might deprecate or improve later on...