from bs4 import BeautifulSoup
from scraper_v2 import scrape_website
import time
import os
import json
from datetime import datetime

def ensure_dir_exists(directory: str):
    """
    Ensure that the specified directory exists. If it does not, create it.
    
    Args:
        directory (str): The path to the directory to check or create.
    """
    if not os.path.exists(directory):
        os.makedirs(directory)
        print(f"Directory created: {directory}")
    else:
        print(f"Directory already exists: {directory}")

# Ensure the data directory exists
ensure_dir_exists("./src/data")

def parse_event_dates(date_str):
    try:
        date_str = date_str.replace("–", "-").replace(",", "")  # Normalize en dash and commas
        parts = date_str.split("-")

        if len(parts) == 1:
            # Case: "Jul 5 2025"
            single = parts[0].strip()
            start_date = datetime.strptime(single, "%b %d %Y").date().isoformat()
            return start_date, start_date

        elif len(parts) == 2:
            part1 = parts[0].strip()       # e.g., "Jun 7"
            part2 = parts[1].strip()       # e.g., "22 2025" or "Jun 22 2025" or "Jul 22 2025"

            # Case: "Jun 7 - 22 2025"
            if len(part2.split()) == 2 and part1.count(" ") == 1:
                start_month, start_day = part1.split()
                end_day, year = part2.split()
                start = f"{start_month} {start_day} {year}"
                end = f"{start_month} {end_day} {year}"

            # Case: "Sep 12 - Oct 5 2025"
            elif len(part2.split()) == 2 and part1.count(" ") == 2:
                start = part1
                end = part2
                # just continue to parsing

            # Case: "Jul 1 - Jul 3 2025"
            elif len(part2.split()) == 3:
                start = part1 + " " + part2.split()[2]
                end = part2

            else:
                return None, None

            start_date = datetime.strptime(start, "%b %d %Y").date().isoformat()
            end_date = datetime.strptime(end, "%b %d %Y").date().isoformat()
            return start_date, end_date

    except Exception as e:
        print(f"Date parsing failed for: '{date_str}' with error: {e}")
        return None, None

    return None, None

def parse_prize(prize):
    if not prize:
        return None
    return int(prize.replace("$", "").replace(",", "").strip())


def extract_events(soup: BeautifulSoup) -> dict:
    """
    Extract event details from the given BeautifulSoup object.
    
    Args:
        soup (BeautifulSoup): The BeautifulSoup object containing the HTML content.
    
    Returns:
        dict: A dictionary containing extracted event details.
    """    
    event_links = soup.find_all("a", href=True)


    # # Step 1: Find the main div container
    # tournament_div = soup.find("div", class_="gridTable tournamentCard Tierless NoGameIcon")

    # # Step 2: Find all <a> tags inside it
    # event_links = tournament_div.find_all("a", href=True) if tournament_div else []


    # # Step 3: Extract URLs and link text
    # events = []
    # for link in event_links:
    #     href = link["href"]
    #     text = link.get_text(strip=True)
    #     if ("/valorant/VCT/" in href or "valorant/VALORANT_Champions_Tour/" in href) and text:# Only keep non-empty text links
    #         events.append({
    #             "eventName": text,
    #             "eventLink": "https://liquipedia.net" + href
    #         })


    # Step 1: Find the main div container
    tournament_div = soup.find("div", class_="gridTable tournamentCard Tierless NoGameIcon")

    # Step 2: Find all event rows
    event_rows = tournament_div.find_all("div", class_="gridRow") if tournament_div else []

    # print(f"Found {len(event_rows)} event rows.")

    # Step 3: Extract event data
    events = []
    for row in event_rows:
        tournament_cell = row.find("div", class_="gridCell Tournament Header")
        prize_cell = row.find("div", class_="gridCell EventDetails Prize Header")
        participant_cell = row.find("div", class_="gridCell EventDetails PlayerNumber Header")
        date_cell = row.find("div", class_="gridCell EventDetails Date Header")

        if not tournament_cell:
            print("No tournament cell found, skipping row.")
            continue

        # Extract the anchor with event info
        # print(tournament_cell)
        event_link_tag = tournament_cell.find("a", href=lambda href: "/valorant/VCT/" in href or "valorant/VALORANT_Champions_Tour/2021" in href)


        if not event_link_tag:
            print("No event link tag found, skipping row.")
            continue

        href = event_link_tag["href"]
        print(f"Processing event link: {href}")
        text = event_link_tag.get_text(strip=True)

        # Filter to VCT events only and skip filler rows
        if ("/valorant/VCT/" in href or "valorant/VALORANT_Champions_Tour/" in href) and text:
            # Extract prize
            prize = prize_cell.get_text(strip=True) if prize_cell else None
            prize = parse_prize(prize) if prize else None

            # Extract number of participants
            if participant_cell:
                number_text = participant_cell.get_text(strip=True)
                number = ''.join(filter(str.isdigit, number_text))  # just digits
            else:
                number = None

            start_date, end_date = None, None
            if date_cell:
                date_text = date_cell.get_text(strip=True)
                start_date, end_date = parse_event_dates(date_text)


            events.append({
                "eventName": text,
                "eventLink": "https://liquipedia.net" + href,
                "prizePool": prize,
                "participants": number,
                "startDate": start_date,
                "endDate": end_date
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

    # Step 1: Find the div container for participating teams
    tournament_div = soup.find("div", class_="gridTable tournamentCard Tierless NoGameIcon")

    # Step 2: Find all event rows
    event_rows = tournament_div.find_all("div", class_="gridRow") if tournament_div else []



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

    session = requests_cache.CachedSession(backend='sqlite', expire_after=timedelta(days=30))



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