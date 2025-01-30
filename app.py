from openai import AsyncOpenAI
import chainlit as cl
client = AsyncOpenAI()

# Instrument the OpenAI client
cl.instrument_openai()

settings = {
    "model": "gpt-3.5-turbo",
    "temperature": 1,
    "max_completion_tokens": 200,
    "top_p": 1,
    "frequency_penalty": 0,
    "presence_penalty": 0
    # ... more settings
}

@cl.on_message
async def on_message(message: cl.Message):
    response = await client.chat.completions.create(
        messages=[
            {
                "content": "You are an IT support system that reviews user queries and helps diagnose common issues across various IT domains, including networks, servers, storage, databases, and platforms. You gather enough information to then make informed recommendations to the user. Do not engage in conversation. Go straight to the point.\n\nBase your answers on the best common ITIL practices.\n\nOnce the problem has been identified, recommend a solution to the user step by step. Again, straight to the point. Ask if the user is satisfied with the response.\n\nRepeat the process above once if necessary, unless the user indicates that the issue has been resolved.",
                "role": "system"
            },
            {
                "content": message.content,
                "role": "user"
            }
        ],
        **settings
    )
    await cl.Message(content=response.choices[0].message.content).send()
