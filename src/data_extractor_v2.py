from bs4 import BeautifulSoup
from scraper_v2 import scrape_website
import time
import os
import json





def extract_events(soup: BeautifulSoup) -> dict:
    """
    Extract event details from the given BeautifulSoup object.
    
    Args:
        soup (BeautifulSoup): The BeautifulSoup object containing the HTML content.
    
    Returns:
        dict: A dictionary containing extracted event details.
    """    
    event_links = soup.find_all("a", href=True)


    # Step 1: Find the main div container
    tournament_div = soup.find("div", class_="gridTable tournamentCard Tierless NoGameIcon")

    # Step 2: Find all <a> tags inside it
    event_links = tournament_div.find_all("a", href=True) if tournament_div else []


    # Step 3: Extract URLs and link text
    events = []
    for link in event_links:
        href = link["href"]
        text = link.get_text(strip=True)
        if ("/valorant/VCT/" in href or "valorant/VALORANT_Champions_Tour/" in href) and text:# Only keep non-empty text links
            events.append({
                "eventName": text,
                "eventLink": "https://liquipedia.net" + href
            })

    # Remove duplicates by converting to a set of event links
    events = list({e["eventLink"]: e for e in events}.values())
    print(f"Extracted {len(events)} events.")


    return events

def extract_event_details(soup: BeautifulSoup) -> dict:
    """
    Extract detailed information about events from the given BeautifulSoup object.
    
    Args:
        soup (BeautifulSoup): The BeautifulSoup object containing the HTML content.
    
    Returns:
        dict: A dictionary containing detailed event information.
    """
    event_details = {}
    
    # Example extraction logic
    for event in soup.find_all('div', class_='event-details'):
        event_name = event.find('h3').get_text(strip=True)
        event_info = {
            'location': event.find('span', class_='location').get_text(strip=True),
            'participants': [p.get_text(strip=True) for p in event.find_all('li', class_='participant')]
        }
        event_details[event_name] = event_info
    
    return event_details

def html_to_soup(html:str) -> BeautifulSoup:
    """
    Convert HTML content to a BeautifulSoup object for easier parsing.
    
    Args:
        html (str): The HTML content to convert.
    
    Returns:
        BeautifulSoup: A BeautifulSoup object representing the HTML content.
    """
    return BeautifulSoup(html, "html.parser")

def format_html(soup: BeautifulSoup) -> str:
    """
    Format the HTML content from the BeautifulSoup object.
    
    Args:
        soup (BeautifulSoup): The BeautifulSoup object containing the HTML content.
    
    Returns:
        str: A formatted string representation of the HTML content.
    """
    return soup.prettify()

def save_to_file(filename: str, content: str):
    """
    Save the given content to a file.
    
    Args:
        filename (str): The name of the file to save the content to.
        content (str): The content to save in the file.
    """
    with open(filename, "w", encoding="utf-8") as file:
        file.write(content)
    print(f"Content saved to {filename}")


if __name__ == "__main__":
    import requests_cache
    from datetime import timedelta

    session = requests_cache.CachedSession('cache.sqlite', backend='sqlite', expire_after=timedelta(days=30))



    url = "https://liquipedia.net/valorant/VALORANT_Champions_Tour"
    
    # Scrape the website
    html_content = scrape_website(url, session=session)
    
    if not html_content:
        print("Failed to retrieve HTML content.")
        exit(1)
    
    soup = html_to_soup(html_content)
    if soup:

        save_to_file("./src/data/webpage.html", format_html(soup))

        test = extract_events(soup)

        save_to_file("./src/data/events.json", json.dumps(test, indent=4, ensure_ascii=False))


    else:
        print("Failed to retrieve HTML content.")