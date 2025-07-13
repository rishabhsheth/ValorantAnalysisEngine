import os
import json
import psycopg2
import subprocess
from dotenv import load_dotenv

def load_env():
    load_dotenv()
    return {
        "dbname": os.getenv("DB_NAME"),
        "user": os.getenv("DB_USER"),
        "password": os.getenv("DB_PASSWORD"),
        "host": os.getenv("DB_HOST"),
        "port": os.getenv("DB_PORT")
    }

def connect_db(config):
    return psycopg2.connect(**config)

def execute_schema(conn, schema_path="src/schema.sql"):
    with conn.cursor() as cur, open(schema_path, "r") as f:
        cur.execute(f.read())
    conn.commit()

def run_data_generator(script="src/__init__.py"):
    result = subprocess.run(["./.venv/Scripts/python.exe", script], capture_output=True, text=True)
    if result.returncode != 0:
        print("❌ Error in data generation script:\n", result.stderr)
        exit(1)
    print("✅ Data generation completed.")

def parse_prize(prize):
    if not prize:
        return None
    return int(prize.replace("$", "").replace(",", "").strip())

def insert_events(conn, json_path="src/data/events.json"):
    with open(json_path, "r", encoding="utf-8") as f:
        events = json.load(f)

    with conn.cursor() as cur:
        for event in events:
            try:
                cur.execute("""
                    INSERT INTO Events (event_name, event_start_date, end_date, participants, prize_pool, event_link)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (event_name, participants) DO NOTHING
                """, (
                    event['eventName'],
                    event['startDate'],
                    event['endDate'],
                    int(event.get('participants') or 0),
                    event['prizePool'],
                    event['eventLink']
                ))
            except Exception as e:
                print(f"❌ Failed to insert {event['eventName']}: {e}")
    conn.commit()
    print("✅ Events inserted successfully.")

def insert_event_details(conn, json_path="src/data/event_details3.json"):
    with open(json_path, "r", encoding="utf-8") as f:
        event_details = json.load(f)

    with conn.cursor() as cur:
        for detail in event_details:
            if not detail.get('event_name') or not detail.get('event_link') or not detail.get('placements') or not detail.get('teams'):
                print(f"⚠️ Skipping incomplete event detail: {detail}")
                continue
            for team in detail['teams']:
                try:
                    cur.execute("""
                        INSERT INTO Organizations (org_name, org_link)
                        VALUES (%s, %s)
                        ON CONFLICT (org_name) DO NOTHING
                    """, (team['team'], team['org_link']))
                except Exception as e:
                    print(f"❌ Failed to insert organization {team['team']} for event {detail['event_name']}: {e}")
    conn.commit()
    print("✅ Event details inserted successfully.")


if __name__ == "__main__":
    print("🚀 Initializing project...")
    config = load_env()
    conn = connect_db(config)
    execute_schema(conn)
    run_data_generator()  # <-- This runs the scrape script
    insert_events(conn)
    insert_event_details(conn)
    conn.close()
    print("🎉 All done.")
