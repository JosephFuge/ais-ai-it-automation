# ais-ai-it-automation

### TODO

- [ ] Get documentation to interact with Hubspot API and document here, specifically to use the [tickets object](https://developers.hubspot.com/docs/reference/api/crm/objects/tickets).
- [ ] Learn about using the [actions](https://docs.chainlit.io/concepts/action) feature in Chainlit and assess if that will help us send POST request to Hubspot
- [ ] Build the interface for chatbot
- [ ] others...



### set up

Create a virtual environment that installs the required dependencies

```sh
conda create --name chainlit-project python=3.0
conda activate chainlit-project
pip install -r ./requirements.txt # might be incorrect. Try it and update readme if needed!
```

check that chainlit was installed correctly by running `chainlit --version`

### initialize project

According to the [Chainlit documentation](https://docs.chainlit.io/integrations/openai), create a `.env` file and store your Openai API key in a variable called `OPENAI_API_KEY`

```sh
OPENAI_API_KEY=<<the-key>>
```

Then, run the program with:

```sh
chainlit run app.py -w
```

