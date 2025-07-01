from src.scraper_v2 import scrape_website
import requests_cache

if __name__ == "__main__":
    # Create a cached session
    testing_session = requests_cache.CachedSession('cache', backend='filesystem', expire_after=30)

    # URL to scrape
    url = "https://liquipedia.net/valorant/VALORANT_Champions_Tour"

    # Scrape the website using the cached session
    html_content = scrape_website(url, session=testing_session, checkCache=True)

    if html_content:
        print("Successfully retrieved HTML content.")
        # You can further process the html_content as needed
    else:
        print("Failed to retrieve HTML content.")