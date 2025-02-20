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
