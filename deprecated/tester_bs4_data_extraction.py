from bs4 import BeautifulSoup

from scraper_v2 import scrape_website
import json


url = "https://liquipedia.net/valorant/VALORANT_Champions_Tour"
    
# Scrape the website
html_content = scrape_website(url)

soup = BeautifulSoup(html_content, "html.parser")

# print(soup.find("span", id="International"))
# # print(soup.find_next)

# print(soup.find("span", id="International").find_next("span", class_="mw-headline").get_text(strip=True))

print(soup.find("div", class_="gridTable tournamentCard Tierless NoGameIcon").find_all("a")["href"])




# # Step 1: Find the main div container
# tournament_div = soup.find("div", class_="gridTable tournamentCard Tierless NoGameIcon")

# # Step 2: Find all <a> tags inside it
# links = tournament_div.find_all("a", href=True) if tournament_div else []

# # Step 3: Extract URLs and link text
# events = []
# for link in links:
#     href = link["href"]
#     text = link.get_text(strip=True)
#     if text:  # Only keep non-empty text links
#         events.append({
#             "eventName": text,
#             "eventLink": "https://liquipedia.net" + href
#         })

# print(f"Extracted {len(events)} events.")
# json.dump(events, indent=4, fp=open("correct_test_events_excludeRepeat.json", "w", encoding="utf-8"))
