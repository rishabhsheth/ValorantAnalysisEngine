from scraper_v2 import scrape_website
from data_extractor_v2 import extract_events, extract_event_details, html_to_soup, save_to_file
import requests_cache
from datetime import timedelta
from slugify import slugify
import json


def replace_in_file(file_path, old_string, new_string):
    with open(file_path, 'r', encoding='utf-8') as file:
        file_contents = file.read()

    file_contents = file_contents.replace(old_string, new_string)

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(file_contents)

def replace_multiple_in_file(file_path, replacements):
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()

    for old, new in replacements.items():
        content = content.replace(old, new)

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)



events_page = "https://liquipedia.net/valorant/VALORANT_Champions_Tour"

session = requests_cache.CachedSession(backend='sqlite', expire_after=timedelta(days=30))
data = scrape_website(events_page, session=session)

if data:
    events = extract_events(html_to_soup(data))
    save_to_file("./src/data/events.json", json.dumps(events, indent=4, ensure_ascii=False))

print(events)

print("Extracted Events:")

details = []

for event in events:
    print(f"Event: {event['eventName']:<60.60} -- {event['eventLink']}")
    # Scrape each event page for details
    # 
    session = requests_cache.CachedSession(backend='sqlite', expire_after=timedelta(days=30))

    response = scrape_website(event['eventLink'], session=session, checkCache=True)

    # eventName = event['eventName'].replace(" ", "_").replace("/", "_")

    # file_name_string = base64.urlsafe_b64encode(eventName.encode('utf-8')).decode('utf-8')
    
    # print(file_name_string)
    # save_to_file(f"./src/data/{file_name_string}", response)


    if response:
        # Commented out to avoid saving large files - can be uncommented if files are needed locally by user
        # save_to_file(f"./src/data/html/{slugify(event['eventName'])}.html", html_to_soup(response).prettify())
        # print("Content saved successfully.")


        event_details = extract_event_details(html_to_soup(response), event_name=event['eventName'], event_link=event['eventLink'])
        if event_details:
            details.append(event_details)
            print(f"Details for {event['eventName']} extracted successfully.")
        else:
            print(f"No details found for {event['eventName']}.")


save_to_file("./src/data/event_details3.json", json.dumps(details, indent=4, ensure_ascii=False))


replacements = {
    "https://liquipedia.net/valorant/FURIA_Esports": "https://liquipedia.net/valorant/FURIA",
    "https://liquipedia.net/valorant/ArtziN": "https://liquipedia.net/valorant/Artzin",
    "https://liquipedia.net/valorant/2ge": "https://liquipedia.net/valorant/2GE",
    "https://liquipedia.net/valorant/KeznitdeuS": "https://liquipedia.net/valorant/Keznit",
    "https://liquipedia.net/valorant/Profek": "https://liquipedia.net/valorant/PROFEK"
}

replace_in_file("./src/data/event_details3.json", "https://liquipedia.net/valorant/FURIA_Esports", "https://liquipedia.net/valorant/FURIA")