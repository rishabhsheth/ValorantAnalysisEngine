from bs4 import BeautifulSoup
from scraper_v2 import scrape_website
import time
import os


def extract_events(soup: BeautifulSoup) -> dict:
    """
    Extract event details from the given BeautifulSoup object.
    
    Args:
        soup (BeautifulSoup): The BeautifulSoup object containing the HTML content.
    
    Returns:
        dict: A dictionary containing extracted event details.
    """
    events = {}
    
    # Example extraction logic

    
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
    url = "https://liquipedia.net/valorant/VALORANT_Champions_Tour"
    
    # Scrape the website
    html_content = scrape_website(url)
    
    if not html_content:
        print("Failed to retrieve HTML content.")
        exit(1)
    
    soup = html_to_soup(html_content)
    if soup:
        # Extract data from the page soup
        # data = extract_events(soup=soup)
        
        # Optionally, save the formatted HTML to a file
        save_to_file("output.html", format_html(soup))
        
    else:
        print("Failed to retrieve HTML content.")