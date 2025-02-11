def create_ticket(content):
    import json
    from openai import OpenAI
    from logger import ticket_generator_log
    from hubspot_connect import hubspot_send_data

    client = OpenAI()

    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": """ You help summarize the content that the user provides. The content is a list of interactions between a user and a help desk bot. 
                Your job is to relay this information in a professional way to a systems administrator. The admin will want to know what happened and
                at least one recommendation for how to resolve the issue.
                The only thing you respond is a json object formatted like the following schema:
                {
                    "properties": {
                        "requestor_name": string | this is the name of the user,
                        "requestor_email": string: | this is the email of the user,
                        "hs_ticket_priority": string | this will be one of the values from the following list: ['LOW', 'MEDIUM', 'HIGH']. Determine the appropriate value based on the user content,
                        "subject": string | this is an appropriate title of the task,
                        "content": string | this is a comprehensive description of the task,
                        "problem_recommendation": string | this is a recommendation that you will provide for the end user based on the user content. Be thorough and provide any sample code if appliable,
                        "hs_pipeline": 0,
                        "hs_pipeline_stage": 1
                    }
                }"""
            },
            {
                "role": "user",
                "content": content,
            }
        ],
        model="gpt-4o",
    )

    response = chat_completion.choices[0].message.content
    ticket_generator_log(f"ticket generator triggered with a response of type {type(response)} - {response}")
    response_clean = response_cleaner(response)
    formatted_response = json.loads(response_clean)
    if formatted_response['properties']['content'] != "":
        hubspot_send_data(formatted_response)    

def response_cleaner(res):
    from logger import ticket_generator_log
    if res[:7] == '```json':
        res = res[7:-3]
        ticket_generator_log(f"cleaned response with type {type(res)} {res}")
        return res
    return res