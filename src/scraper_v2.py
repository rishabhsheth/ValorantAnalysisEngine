import requests
import requests_cache
from datetime import timedelta
from time import sleep
import json

# Now requires session is always passed to the scrape_website function
# session = requests_cache.CachedSession('cache', backend='filesystem', expire_after=timedelta(days=30))
# This code sets up a cached session using requests_cache, which allows for caching HTTP requests.

# session.cache.remove_expired_responses()
# Remove expired responses from the cache to ensure we only have fresh data.

def scrape_website(url, session, checkCache=True, wait=0):
    """
    Scrape the website at the given URL and return the HTML content.
    This function uses a cached session to avoid repeated requests to the same URL.
    If checkCache is True, it will use cached content if available.
    If checkCache is False, it will always fetch new content from the URL.

    Args:
        url (str): The URL of the website to scrape.
    
    Returns:
        str: The HTML content of the website.

    Raises:
        requests.exceptions.Timeout: If the request times out.
        requests.RequestException: For other request-related errors.
    """

    if checkCache:
        print("Read-through cache enabled.")
    else:
        session.cache.delete(urls=[url])
        print("Cache disabled, fetching new content.")

    try:
        response = session.get(url, allow_redirects=False, timeout=10)
        response.raise_for_status()  # Raise an error for bad responses
        if getattr(response, 'from_cache', False):
            print("Response was returned from cache.")
        else:
            print("Response was fetched from the network. Waiting for", wait, "seconds before returning the response.")
            sleep(wait)
        return response.text
    except requests.exceptions.Timeout:
        print(f"Request to {url} timed out.")
        return None
    except requests.RequestException as e:
        print(f"An error occurred: {e}")
        return None



if __name__ == "__main__":
    

    events_url = "https://liquipedia.net/valorant/VALORANT_Champions_Tour"

    session = requests_cache.CachedSession('cache.sqlite', backend='sqlite', expire_after=timedelta(days=30))

    # test_url = "https://httpbin.org/delay/1"

    html_content = scrape_website(events_url, session=session)

    # with open("./src/data/events.json", "r", encoding="utf-8") as file:
    #     events = json.load(file)

    # for event in events:
    #     print(f"Event: {event['eventName']:<60.60} -- {event['eventLink']}")
    #     # Scrape each event page for details
    #     response = scrape_website(event['eventLink'], wait = 1, session=session)




    # if html_content:
    #     print("Storing response in file.")
    #     with open("output.html", "w", encoding="utf-8") as file:
    #         file.write(html_content)
