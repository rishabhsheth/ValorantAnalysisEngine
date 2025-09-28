--POSTGRESSQL RUN STEP: psql -h <hostname> -U <username> -d <dbname>

create or replace function teamandplayersbyevent(say text)
returns table (org_name text, player_name text, event_name text)
language sql
as $$
    select
        o.org_name,
        p.player_name,
        e.event_name
    from organizations o
    join eventorgs eo on eo.org_id = o.org_id
    join events e on e.event_id = eo.event_id
    join eventorgplayers eop on eop.event_org_id = eo.event_org_id
    join players p on p.player_id = eop.player_id
    where say = o.org_name
$$
-- DROP function teamandplayersbyevent(say text);

create or replace function teamearningsbyevent(say text)
returns table (org_name text, event_name text, winnings int)
language sql 
as $$
    select 
        o.org_name,
        e.event_name,
        eo.winnings
    from organizations o
    join eventorgs eo on eo.org_id = o.org_id
    join events e on e.event_id = eo.event_id
    join winnings eo on eo.org_id = eo.event_id
    where say = o.org_name
$$