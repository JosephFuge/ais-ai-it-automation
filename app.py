from openai import AsyncOpenAI
from ticket_generator import create_ticket
from hubspot_connect import hubspot_send_data
from logger import chainlit_log
import chainlit as cl

client = AsyncOpenAI()

# Instrument the OpenAI client
cl.instrument_openai()

# settings for client
settings = {
    "model": "gpt-3.5-turbo",
    "temperature": 1,
    "max_completion_tokens": 2048,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0
    # ... more settings
}

# system definition
sys_definition = """You are an IT help desk support system that reviews user queries, 
helps diagnose common IT issues and provides tailored recommendations. 
You help a number of IT domains, including networks, servers, storage, databases, 
and platforms. Among the things that you want to know are:
1. Who the user is: Ask for their name and mention that it is to follow up with them.
2. What the issue is and where it is originating.
4. Any other useful information that you would like to know based on the context.
5. DO NOT ask for multiple questions at once.

After gathering enough information, you will ask if the user wants a recommendation to troubleshoot the problem themselves. 
If they say yes, provide a troubleshooting recommendation. Include code snippets if applicable.
If they say no, just recap what you collected and mention that you will send the information over to the ticketing system
to log a new job that needs to be done.

At the end, instruct the user to close the window, or click on the button to initiate a new chat if they have a different question.
"""
# list to store the message history that is sent to the ticket generator
ticket_message_history = []

@cl.on_chat_start
def start_chat(): # set user history for chainlit to track messages
    cl.user_session.set(
        "message_history",
        [{"role": "system", "content": sys_definition}], 
    )

@cl.on_chat_end
def end():
    global ticket_message_history
    # send the message history to ticket_generator.py
    if ticket_message_history != []:
        chainlit_log(f"sending data to ticket-generator: \n {ticket_message_history}") # log data being successfully sent
        create_ticket(str(ticket_message_history))
        ticket_message_history = [] # reset message history for new chats
    
@cl.on_message
async def main(message: cl.Message):
    message_history = cl.user_session.get("message_history")
    message_history.append({"role": "user", "content": message.content})

    ticket_message_history.append({"role": "user", "content": message.content})

    msg = cl.Message(content="")

    stream = await client.chat.completions.create(
        messages=message_history, stream=True, **settings
    )

    async for part in stream:
        if token := part.choices[0].delta.content or "":
            await msg.stream_token(token)

    message_history.append({"role": "system", "content": msg.content})
    ticket_message_history.append({"role": "system", "content": msg.content})
    await msg.update()
