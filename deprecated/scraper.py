import requests
from bs4 import BeautifulSoup
import os


def scrape_website(url, checkCache=True):    
    """
    Scrape the website at the given URL and return the HTML content.
    
    Args:
        url (str): The URL of the website to scrape.
    
    Returns:
        str: The HTML content of the website.
    """

    # Pseudo-code
    # if checkCache is True (default), check if the content is cached in a file in assets
    # if cached, read from the file and return the content
    # if not cached, fetch the content from the URL, save it to a file, and return the content
    # if checkCache is False, always fetch new content from the URL, even if cached content exists



    # if checkCache:
    #     try:
    #         with open("output.html", "r", encoding="utf-8") as file:
    #             return file.read()
    #     except FileNotFoundError:
    #         pass
    # else:
    #     print("Cache disabled, fetching new content.")
    #     try:
    #         response = requests.get(url)
    #         response.raise_for_status()  # Raise an error for bad responses
    #         with open("output.html", "w", encoding="utf-8") as file:
    #             file.write(response.text)
    #         return response.text
    #     except requests.RequestException as e:
    #         print(f"Error fetching {url}: {e}")
    #         return None

    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an error for bad responses
        with open("output.html", "w", encoding="utf-8") as file:
            file.write(response.text)
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None

def parse_html(html):
    soup = BeautifulSoup(html, "html.parser")

    # Extract data (e.g., all links on the page)
    for link in soup.find_all("a"):
        print(link.get("href"))

if __name__ == "__main__":

    baseurl = "https://liquipedia.net/valorant/"
    url = "https://liquipedia.net/valorant/VALORANT_Champions_Tour"  # Replace with the URL you want to scrape
    html_content = scrape_website(url, checkCache=False)
    
    if html_content:
        parse_html(html_content)