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

    event_map = {}

    with conn.cursor() as cur:
        for event in events:
            try:
                cur.execute("""
                    INSERT INTO Events (event_name, event_start_date, end_date, participants, prize_pool, event_link)
                    VALUES (%s, %s, %s, %s, %s, %s)
                    ON CONFLICT (event_name, participants) DO NOTHING
                    RETURNING event_id
                """, (
                    event['eventName'],
                    event['startDate'],
                    event['endDate'],
                    int(event.get('participants') or 0),
                    event['prizePool'],
                    event['eventLink']
                ))
                result = cur.fetchone()
                if result:
                    event_id = result[0]
                    event_map[event['eventName'].casefold()] = event_id
                    print(f"✅ Inserted event: {event['eventName']} with ID {event_id}")
            except Exception as e:
                print(f"❌ Failed to insert {event['eventName']}: {e}")
    conn.commit()
    print("✅ Events inserted successfully.")
    return event_map

def insert_event_details(conn, json_path="src/data/event_details3.json", event_map={}):
    with open(json_path, "r", encoding="utf-8") as f:
        event_details = json.load(f)

    with conn.cursor() as cur:
        for detail in event_details:
            if not detail.get('event_name') or not detail.get('event_link') or not detail.get('placements') or not detail.get('teams'):
                print(f"⚠️ Skipping incomplete event detail: {detail.get('event_name', 'Unknown')}")
                continue
            event_id = event_map.get(detail['event_name'].casefold())
            if not event_id:
                print(f"⚠️ Event {detail['event_name']} not found in event map, skipping.")
                continue
            
            org_map = {}

            player_map = {}

            for team in detail['teams']:
                try:
                    cur.execute("""
                        INSERT INTO Organizations (org_name, org_link)
                        VALUES (%s, %s)
                        ON CONFLICT (org_link) DO NOTHING
                        RETURNING org_id
                    """, (team['team'], team['org_link']))

                    result = cur.fetchone()

                    if result:
                        org_map[team['org_link'].casefold()] = result[0]  # Store org_id for later use
                    else:
                        # If conflict occurred, fetch the existing org_id
                        cur.execute("""
                            SELECT org_id FROM Organizations WHERE org_link = %s
                        """, (team['org_link'],))
                        org_map[team['org_link'].casefold()] = cur.fetchone()[0]             
                    
                except Exception as e:
                    print(f"❌ Failed to insert organization {team['team']} for event {detail['event_name']}: {e}")

                for player in team['players']:
                    try:
                        cur.execute("""
                            INSERT INTO Players (player_name, player_link)
                            VALUES (%s, %s)
                            ON CONFLICT (player_link) DO NOTHING
                            RETURNING player_id
                        """, (player['name'], player['link']))
                        result = cur.fetchone()
                        if result:
                            player_map[player['link'].casefold()] = result[0]
                        else:
                            # If conflict occurred, fetch the existing player_id
                            cur.execute("""
                                SELECT player_id FROM Players WHERE player_link = %s
                            """, (player['link'],))
                            player_map[player['link'].casefold()] = cur.fetchone()[0]
                    except Exception as e:
                        print(f"❌ Failed to insert player {player['name']} for team {team['team']}: {e}")

            eventorg_map = {}

            for placement in detail['placements']:
                org_id = org_map.get(placement['org_link'].casefold())
                if not org_id:
                    print(f"⚠️ Organization {placement['org_name']} not found for event {detail['event_name']}, skipping placement.")
                    continue
                try:
                    cur.execute("""
                        INSERT INTO EventOrgs (event_id, org_id, placement_start, placement_end, winnings, vct_points)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        ON CONFLICT (event_id, org_id) DO NOTHING
                        RETURNING event_org_id
                    """, (
                        event_id,
                        org_id,
                        placement['placement_start'],
                        placement['placement_end'],
                        placement.get('winnings', 0),
                        placement.get('vct_points', 0)
                    ))
                    result = cur.fetchone()
                    if result:
                        eventorg_map[placement['org_link'].casefold()] = result[0]  # Store org_id for later use
                    else:
                        # If conflict occurred, fetch the existing org_id
                        cur.execute("""
                            SELECT event_org_id FROM EventOrgs WHERE event_id = %s AND org_id = %s
                        """, (event_id, org_id))
                        eventorg_map[team['org_link'].casefold()] = cur.fetchone()[0]             



                except Exception as e:
                    print(f"❌ Failed to insert event detail for {detail['event_name']} - {placement['org_name']}: {e}")

            for team in detail['teams']:
                eventorg_id = eventorg_map.get(team['org_link'].casefold())
                if not eventorg_id:
                    print(eventorg_map)
                    print(f"⚠️ EventOrg ID not found for {team['org_link']} in event {detail['event_name']}, skipping team players.")
                    continue
                for player in team['players']:
                    player_id = player_map.get(player['link'].casefold())
                    if not player_id:
                        print(f"⚠️ Player ID not found for {player['name']} in event {detail['event_name']}, skipping.")
                        continue
                    try:
                        cur.execute("""
                            INSERT INTO EventOrgPlayers (event_org_id, player_id)
                            VALUES (%s, %s)
                            ON CONFLICT (event_org_id, player_id) DO NOTHING
                        """, (eventorg_id, player_id))
                    except Exception as e:
                        print(f"❌ Failed to insert player {player['name']} for team {team['team']} in event {detail['event_name']}: {e}")


            print(f"✅ Inserted event details for {detail['event_name']} with ID {event_id}")

    conn.commit()
    print("✅ Event details inserted successfully.")


if __name__ == "__main__":
    print("🚀 Initializing project...")
    config = load_env()
    conn = connect_db(config)
    execute_schema(conn)
    run_data_generator()  # <-- This runs the scrape script
    event_map = insert_events(conn)
    insert_event_details(conn, event_map=event_map)
    conn.close()
    print("🎉 All done.")
