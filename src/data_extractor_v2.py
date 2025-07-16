from bs4 import BeautifulSoup
from scraper_v2 import scrape_website
import time
import os
import json
from datetime import datetime
import re

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

def parse_money(text):
    cleaned = re.sub(r"[^\d]", "", text)
    return int(cleaned) if cleaned else 0


def parse_placement(place_str):
    match = re.match(r"(\d+)(?:[a-z]{2})?(?:-(\d+)[a-z]{2})?", place_str.replace(" ", ""))
    if match:
        start = int(match.group(1))
        end = int(match.group(2)) if match.group(2) else start
        return start, end
    return None, None

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

def extract_event_details(soup: BeautifulSoup, event_name = None, event_link = None) -> dict:
    """
    Extract detailed information about events from the given BeautifulSoup object.
    
    Args:
        soup (BeautifulSoup): The BeautifulSoup object containing the HTML content.
    
    Returns:
        dict: A dictionary containing detailed event information.
    """

    # Step 1: Find the div container for participating teams
    teams_div = soup.find_all("div", class_="teamcard toggle-area toggle-area-1")

    # Step 2: Find the div container for team placements
    placement_div = soup.find("div", class_="prizepool-section-tables")
    if not placement_div:
        return []

    rows = placement_div.find_all("div", class_="csstable-widget-row")
    placements = []

    # Step 3: Extract team placements
    for row in rows:
        cells = row.find_all("div", class_="csstable-widget-cell")
        if len(cells) < 4:
            continue

        # Placement
        place_text = cells[0].get_text(strip=True).replace("\n", "")
        placement_start, placement_end = parse_placement(place_text)

        # Winnings
        winnings_text = cells[1].get_text(strip=True)
        winnings = parse_money(winnings_text)

        # VCT Points
        vct_text = cells[2].get_text(strip=True)
        vct_points = int(vct_text) if vct_text.isdigit() else None

        # Team name(s) – one or two per row
        team_cells = cells[3:]
        for team_cell in team_cells:
            team_name_tag = team_cell.find("span", class_="name")
            if team_name_tag and team_name_tag.a:
                org_name = team_name_tag.a.get_text(strip=True)
                org_link = "https://liquipedia.net" + team_name_tag.a["href"] if team_name_tag.a else ""
                placements.append({
                    "placement_start": placement_start,
                    "placement_end": placement_end,
                    "winnings": winnings,
                    "vct_points": vct_points,
                    "org_name": org_name,
                    "org_link": org_link
                })

    # Step 4: Extract team players and coaches
    teams = []
    for team_div in teams_div:
        team_info = extract_team_info(team_div)
        if team_info:
            teams.append(team_info)



    event_data = {
        "event_name": event_name,
        "event_link": event_link,
        "placements": placements,
        "teams": teams
    }


    return event_data

def extract_team_info(team_div):
    team_data = {}

    # Get team name and org link
    anchors = team_div.find("center").find_all("a", href=True)
    team_anchor = None
    if anchors:
        if anchors[-1]["href"].startswith("#"):
            # Last one is a citation, use second-last
            team_anchor = anchors[-2] if len(anchors) >= 2 else None
        else:
            # Last one is the team
            team_anchor = anchors[-1]


    team_data["team"] = team_anchor.get_text(strip=True) if team_anchor else "Unknown"
    team_data["org_link"] = "https://liquipedia.net" + team_anchor["href"] if team_anchor else ""

    players = []
    substitutes = []
    coaches = []

    tables = team_div.find_all("table", class_="wikitable wikitable-bordered list")

    for table in tables:
        for row in table.find_all("tr"):
            td = row.find("td")
            if not td:
                continue

            a_tags = td.find_all("a", href=True)
            if not a_tags:
                continue

            # Extract all people in the row (can be multiple, like 0bi and Zeus)
            people = []
            for a_tag in a_tags:
                name = a_tag.get_text(strip=True)
                link = a_tag["href"]
                if name:
                    people.append({
                        "name": name,
                        "link": "https://liquipedia.net" + link
                    })

            if not people:
                continue

            # Determine the role
            th = row.find("th")
            classes = row.get("class", [])

            is_coach = False
            is_sub = False

            # --- Identify coaches ---
            # Method 1: Image title contains "Coach" or "Analyst"
            if row.find("img", title=lambda t: t and ("Coach" in t or "Analyst" in t)):
                is_coach = True
            # Method 2: <abbr title="Coaches">
            elif th and th.find("abbr", title=lambda t: t and "Coach" in t):
                is_coach = True

            # --- Identify substitutes ---
            elif row.find("abbr", title="Substitute") or "teamcard-bg-dnp" in classes:
                is_sub = True

            # --- Identify players ---
            elif th and th.get_text(strip=True).isdigit():
                # Regular player row
                for person in people:
                    players.append(person)
                continue  # skip the rest

            # Append to appropriate list
            if is_coach:
                coaches.extend(people)
            elif is_sub:
                substitutes.extend(people)

    team_data["players"] = players
    team_data["substitutes"] = substitutes
    team_data["coaches"] = coaches

    return team_data



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



    # url = "https://liquipedia.net/valorant/VALORANT_Champions_Tour"
    
    # # Scrape the website
    # html_content = scrape_website(url, session=session)
    
    # if not html_content:
    #     print("Failed to retrieve HTML content.")
    #     exit(1)
    
    # soup = html_to_soup(html_content)
    # if soup:

    #     save_to_file("./src/data/html/webpage.html", format_html(soup))

    #     test = extract_events(soup)

    #     save_to_file("./src/data/events.json", json.dumps(test, indent=4, ensure_ascii=False))


    # else:
    #     print("Failed to retrieve HTML content.")

    # url = "https://liquipedia.net/valorant/VCT/2025/Stage_2/Masters"
    # url = "https://liquipedia.net/valorant/VALORANT_Champions_Tour/2021/Stage_2/Masters"
    url = "https://liquipedia.net/valorant/VCT/2024/Pacific_League/Stage_2"

    # Scrape the website
    html_content = scrape_website(url, session=session)

    if not html_content:
        print("Failed to retrieve HTML content.")
        exit(1)

    soup = html_to_soup(html_content)
    if soup:
        obj = extract_event_details(soup)
        save_to_file("./src/data/placements.json", json.dumps(obj, indent=4, ensure_ascii=False))