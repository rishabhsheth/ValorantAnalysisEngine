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
$$;
-- DROP function teamandplayersbyevent(say text);

-- create or replace function teamearningsbyevent(say text)
-- returns table (org_name text, event_name text, winnings int)
-- language sql 
-- as $$
--     select 
--         o.org_name,
--         e.event_name,
--         eo.winnings
--     from organizations o
--     join eventorgs eo on eo.org_id = o.org_id
--     join events e on e.event_id = eo.event_id
--     join winnings eo on eo.org_id = eo.event_id
--     where say = o.org_name
-- $$;

-- event placements by organization id

DROP function eventplacementsbyorgid(say int);

create or replace function eventplacementsbyorgid(say int)
returns table (event_id int, event_name text, placement_start int, placement_end int, event_start_date date, end_date date)
language sql
as $$
    select 
        eo.event_id,
        e.event_name,
        eo.placement_start,
        eo.placement_end,
        e.event_start_date,
        e.end_date
    from events e
    join eventorgs eo on eo.event_id = e.event_id
    where say = eo.org_id
$$;
-- DROP function eventplacementsbyorgid(say int);

-- Select e.event_id, e.event_name, o.org_name 
-- from organizations o
-- join eventorgs eo on eo.org_id = o.org_id
-- join events e on e.event_id = eo.event_id
-- where org_region = 'Other'

DROP function resultsbyevent(say int);

create or replace function resultsbyevent(say int)
returns table (
    org_name text,
    org_region text,
    placement_start int,
    placement_end int,
    winnings int,
    vct_points int,
    org_link text
)
language sql
as $$
    select 
        o.org_name,
        o.org_region,
        eo.placement_start,
        eo.placement_end,
        eo.winnings,
        eo.vct_points,
        o.org_link
    from EventOrgs eo
    join Organizations o on eo.org_id = o.org_id
    where eo.event_id = say
    order by eo.placement_start, o.org_region, o.org_name;
$$;