from bs4 import BeautifulSoup
from scraper_v2 import scrape_website
import time
import os



def extract_data_from_html(html, execution_time=False):
    """
    Extract data from the given HTML content.

    Args:
        html (str): The HTML content to extract data from.

    Returns:
        dict: A dictionary containing extracted data.
    """
    if execution_time:
    # Measure the execution time of the extraction process
        start = time.perf_counter()

    soup = BeautifulSoup(html, "html.parser")
    
    # Example extraction logic
    data = {
        "title": soup.title.string if soup.title else None,
        "links": [a['href'] for a in soup.find_all('a', href=True)],
        "headings": [h.get_text() for h in soup.find_all(['h1', 'h2', 'h3'])],
    }

    if execution_time:
        # Calculate and print the execution time
        end = time.perf_counter()
        execution_time = end - start
        print(f"Execution time: {execution_time} seconds")

    
    return data


def format_HTML(html):
    """
    Format the HTML content for better readability.

    Args:
        html (str): The HTML content to format.

    Returns:
        str: Formatted HTML content.
    """
    soup = BeautifulSoup(html, "html.parser")
    return soup.prettify()

if __name__ == "__main__":
    url = "https://liquipedia.net/valorant/VALORANT_Champions_Tour"
    
    # Scrape the website
    html_content = scrape_website(url)
    
    if html_content:
        # Save HTML content to output.html if it does not exist
        if not os.path.exists("output.html"):
            print("Saving prettified HTML content to output.html")
            with open("output.html", "w", encoding="utf-8") as f:
                f.write(format_HTML(html_content))

        # Extract data from the HTML content
        extracted_data = extract_data_from_html(html_content)
        
        # Print or process the extracted data
        # print(extracted_data)
    else:
        print("Failed to retrieve HTML content.")
