def hubspot_send_data(data):
    import os, requests
    from dotenv import load_dotenv
    from logger import hubspot_log

    load_dotenv()

    api_key = os.environ['HUBSPOT_KEY']

    url = 'https://api.hubapi.com/crm/v3/objects/tickets'

    header = {
        'Authorization': f'Bearer {api_key}',
        'content-type': 'application/json'
    }

    new_ticket = requests.post(url=url, json=data, headers=header) # send data to Hubspot Tickets
    hubspot_log(f"data sent to hubspot, {new_ticket.text}") # log successful request
