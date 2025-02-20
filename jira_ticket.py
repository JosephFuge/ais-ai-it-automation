from openai import OpenAI
import os, requests, json, sys
from requests.auth import HTTPBasicAuth
from dotenv import load_dotenv

load_dotenv()

user_content = sys.argv[1]

client = OpenAI()

def create_issue(summary,description,priority,impact,urgency):
    ticket_data = {
        "fields": {
            "project": {"id": "10000"},
            "summary": summary,
            "description": description,
            "issuetype":{"id": "10001"},
            "priority": {"id": priority},
            "customfield_10004": {"value": impact},
            "customfield_10042": {"value": urgency}
        }
    }
    api_key=os.environ['JIRA_API_KEY']
    headers={"content-type": "application/json"}
    auth = HTTPBasicAuth("jfob.mail@gmail.com", api_key)
    url = 'https://it-automation-challenge.atlassian.net/rest/api/2/issue/'
    raw = requests.post(url=url, headers=headers, auth=auth, json=ticket_data)
    return raw



tools = [
{
    "type": "function",
    "function": {
        "name": "create_issue",
        "description": "use messages to create an issue for a Jira ticket.",
        "parameters": {
            "type": "object",
            "properties": {
                "summary": {
                    "type": "string",
                    "description": "the title for the issue which explains concisely what happened"
                },
                "description": {
                    "type": "string",
                    "description": "a summary of the issue with enough information for a systems admin to replicate and resolve. Include the name of the creator of the issue"
                },
                "priority":{
                    "type": "string",
                    "enum": ["1", "2", "3", "4", "5"],
                    "description": "a number from 1 to 5, with 1 being highest priority to 5 being lowest priority"
                },
                "impact":{
                    "type": "string",
                    "enum": ["Extensive / Widespread", "Significant / Large", "Moderate / Limited", "Minor / Localized"],
                    "description": "level of impact of issue"
                },
                "urgency":{
                    "type": "string",
                    "enum": ["Critical", "High", "Medium", "Low"],
                    "description": "level of urgency of issue"
                }
            }
        },
        "required": ["summary", "description", "priority", "impact", "urgency"],
        "additionalParameters": False
    },
    "strict": True
}]

messages = [
    {"role": "developer", "content":"You analyze user content use it to create a ticket in an IT ticketing system."},
    {"role": "user", "content": user_content}
    ]

completion = client.chat.completions.create(
    model="gpt-4o",
    messages=messages,
    tools=tools
)

if completion.choices[0].message.tool_calls is not None:
    tool_call = completion.choices[0].message.tool_calls[0]
    args = json.loads(tool_call.function.arguments)

    result = create_issue(args["summary"],args["description"],args["priority"],args["impact"],args["urgency"])
    if result.status_code == 201:
        print("JIRA TICKET: ticket was created successfully...")
    if result.status_code == 401:
        print("JIRA TICKET: there was a problem creating a ticket...")
