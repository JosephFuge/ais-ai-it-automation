from openai import AsyncOpenAI
import chainlit as cl
import subprocess

client = AsyncOpenAI()

# Instrument the OpenAI client
cl.instrument_openai()

# settings for client
settings = {"model": "gpt-4o"}

# system definition
sys_definition = """You are a knowledgeable and professional IT help desk support chatbot that interacts with IT systems employees,
helps diagnose common IT issues and provides tailored recommendations. 
You help a number of IT domains, including networks, servers, storage, databases, 
and platforms. Among the things that you want to know are:
1. Who the user is: Ask for their name and mention that it is to follow up with them.
2. What the issue is and where it is originating.
4. Any other useful information that you would like to know based on the context.
5. DO NOT ASK MULTIPLE QUESTIONS AT ONCE. Your responses must be succint and clear.

After gathering enough information, you inform the user that a new ticket will be created for reporting or escalation purposes.
Ask the user to close the window, or click on the button to initiate a new chat if they have a different question.
"""
# list to store the message history that is sent to the ticket generator
ticket_message_history = []

@cl.on_chat_start
async def start_chat(): # set user history for chainlit to track messages
    cl.user_session.set(
        "message_history",
        [{"role": "system", "content": sys_definition}], 
    )

    actions = [
        cl.Action(
            name="file 1",
            icon="logs",
            payload={"value": "example_value"},
            label="run health check #1"
        ),
        cl.Action(
            name="file 2",
            icon="logs",
            payload={"value": "example_value"},
            label="run health check #2"
        )
    ]

    await cl.Message(content="Check system health:", actions=actions).send()

@cl.action_callback("file 1")
async def on_action(action: cl.Action):
    action_definition = """read the latest logs provided to you. First, determine if the logs describe
    any errors in the system. If there is no error, indicate the part of the system that was examined and mention that all systems are healthy, and nothing else. If they do describe an error, follow these instructions:
    1. indicate that there is an error, and determine the severity level.
    2. explain what the errors are
    3. indicate where the errors originated
    4. provide a step-by-step guide to solve them. If applicable, provide code samples.
    5. do not add more wording or explanations than necessary. Make your response as useful for an admin to know exactly what they should do."""
    with open('clean_log.txt', 'r') as file:
        content = file.read()
        message =  [{'role': 'system', 'content': action_definition},{'role': 'user', 'content': str(content)}]
    stream = await client.chat.completions.create(messages=message, stream=True, **settings)

    msg = cl.Message(content="")
    async for part in stream:
        if token := part.choices[0].delta.content or "":
            await msg.stream_token(token)


@cl.action_callback("file 2")
async def on_action(action: cl.Action):
    action_definition = """read the latest logs provided to you. First, determine if the logs describe
    any errors in the system. If there is no error, indicate the part of the system that was examined and mention that all systems are healthy, and nothing else. If they do describe an error, follow these instructions:
    1. indicate that there is an error, and determine the severity level.
    2. explain what the errors are
    3. indicate where the errors originated
    4. provide a step-by-step guide to solve them. If applicable, provide code samples.
    5. do not add more wording or explanations than necessary. Make your response as useful for an admin to know exactly what they should do."""
    with open('error_log.txt', 'r') as file:
        content = file.read()
        message =  [{'role': 'system', 'content': action_definition},{'role': 'user', 'content': str(content)}]
    stream = await client.chat.completions.create(messages=message, stream=True, **settings)

    msg = cl.Message(content="")
    async for part in stream:
        if token := part.choices[0].delta.content or "":
            await msg.stream_token(token)

@cl.on_chat_end
def end():
    global ticket_message_history
    # send the message history to ticket_generator.py
    if ticket_message_history != []:
        subprocess.run(["python", "jira_ticket.py", str(ticket_message_history)])
        ticket_message_history = [] # reset message history for new chats
    
@cl.on_message
async def main(message: cl.Message):
    message_history = cl.user_session.get("message_history")
    message_history.append({"role": "user", "content": message.content})

    ticket_message_history.append({"role": "user", "content": message.content})

    msg = cl.Message(content="")

    stream = await client.chat.completions.create(messages=message_history, stream=True, **settings)

    async for part in stream:
        if token := part.choices[0].delta.content or "":
            await msg.stream_token(token)

    message_history.append({"role": "system", "content": msg.content})
    ticket_message_history.append({"role": "system", "content": msg.content})
    await msg.update()
