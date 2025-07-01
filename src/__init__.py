from scraper_v2 import scrape_website
from data_extractor_v2 import extract_events, extract_event_details, html_to_soup, save_to_file
import requests_cache
from datetime import timedelta
from slugify import slugify


events_page = "https://liquipedia.net/valorant/VALORANT_Champions_Tour"

session = requests_cache.CachedSession(backend='sqlite', expire_after=timedelta(days=30))
data = scrape_website(events_page, session=session)

if data:
    events = extract_events(html_to_soup(data))


print("Extracted Events:")
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
        # Commented out to avoid saving large files 
        # save_to_file(f"./src/data/{slugify(event['eventName'])}.html", html_to_soup(response).prettify())
        print("Content saved successfully.")

    

    
