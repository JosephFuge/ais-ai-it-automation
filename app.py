from openai import AsyncOpenAI
from ticket_generator import create_ticket
from hubspot_connect import hubspot_send_data
from logger import chainlit_log
import chainlit as cl
client = AsyncOpenAI()

# Instrument the OpenAI client
cl.instrument_openai()

settings = {
    "model": "gpt-3.5-turbo",
    "temperature": 1,
    "max_completion_tokens": 2048,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0
    # ... more settings
}

sys_definition = """You are an IT help desk support system that reviews user queries, 
helps diagnose common IT issues and provides tailored recommendations. 
You help a number of IT domains, including networks, servers, storage, databases, 
and platforms. Among the things that you want to know are:
1. Who the user is: you need their name and email address. If they have not provided it, ask it until they provide it.
2. What the issue is and where it is originating.
3. What the expected outcome is (ie. what is not happening that should be happening).
4. Any other useful information that you would like to know based on the context.

After gathering enough information, you will ask if the user wants a recommendation to troubleshoot the problem themselves. 
If they say yes, provide a troubleshooting recommendation. If they say no, just recap what you collected and after they confirmed it, 
respond saying that you will send the information over to the ticketing system to log a new job that needs to be done.
"""

client = AsyncOpenAI()

ticket_message_history = []


@cl.on_chat_start
def start_chat():
    cl.user_session.set(
        "message_history",
        [{"role": "system", "content": f"{sys_definition}"}],
    )

@cl.on_chat_end
async def end():
    # send the message history to ticket_generator.py
    chainlit_log(f"session {cl.user_session.get('id')} ended.")
    chainlit_log(f"sending the following data to ticket-generator: {ticket_message_history}")
    create_ticket(str(ticket_message_history))
    
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
