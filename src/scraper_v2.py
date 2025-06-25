import requests
import requests_cache
from datetime import timedelta

session = requests_cache.CachedSession('cache', backend='filesystem', expire_after=timedelta(days=30))
# This code sets up a cached session using requests_cache, which allows for caching HTTP requests.

# session.cache.remove_expired_responses()
# Remove expired responses from the cache to ensure we only have fresh data.

print(list(session.cache.paths()))


def scrape_website(url, session = session, checkCache=True):
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
        print("Using cached content.")
    else:
        session.cache.delete(urls=[url])
        print("Cache disabled, fetching new content.")

    try:
        response = session.get(url, allow_redirects=True, timeout=10)
        response.raise_for_status()  # Raise an error for bad responses
        return response.text
    except requests.exceptions.Timeout:
        print(f"Request to {url} timed out.")
        return None
    except requests.RequestException as e:
        print(f"An error occurred: {e}")
        return None



if __name__ == "__main__":

    base_url = "https://liquipedia.net/valorant/"
    events_url = "https://liquipedia.net/valorant/VALORANT_Champions_Tour"

    test_url = "https://httpbin.org/delay/1"

    html_content = scrape_website(events_url)

    if html_content:
        print("Storing response in file.")
        with open("output.html", "w", encoding="utf-8") as file:
            file.write(html_content)
