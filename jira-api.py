import requests, os, json
from dotenv import load_dotenv
load_dotenv()

url = "https://byu-aiscomp-2025.atlassian.net/rest/api"
api_key = os.environ['JIRA_KEY']

user_auth = requests.auth.HTTPBasicAuth("mrjfob@student.byu.edu", api_key)

head = {
    "Accepts": "application/json"
}

def get_projects(v, id, auth, path = url, head = head):

    url = f"{path}/{v}/issue/createmeta/{id}/issuetypes"
    req = requests.get(url, headers=head, auth=auth)

    print(json.dumps(req.json(), indent = 4))

get_projects(3, 10001, user_auth)
