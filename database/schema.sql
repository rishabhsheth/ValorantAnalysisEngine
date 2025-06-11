CREATE TABLE IF NOT EXISTS Events (
    id INT PRIMARY KEY ,
    EventName TEXT NOT NULL,
    EventDate TIMESTAMP NOT NULL,
    Tier TEXT NOT NULL,
    Location TEXT NOT NULL,
);  

CREATE TABLE IF NOT EXISTS Organizations (
    id INT PRIMARY KEY,
    OrganizationName TEXT NOT NULL,
    Region TEXT NOT NULL,
    FoundedYear INT NOT NULL
);

CREATE TABLE IF NOT EXISTS Players (
    id INT PRIMARY KEY,
    PlayerName TEXT NOT NULL,
    Age INT NOT NULL,
    OrgID INT NOT NULL,
    FOREIGN KEY (OrgID) REFERENCES Organizations(id)
);


CREATE TABLE IF NOT EXISTS Roster (
    id INT PRIMARY KEY,
    TeamName TEXT NOT NULL,
    Placement TEXT NOT NULL,
    EventID INT NOT NULL,
    OrgID INT NOT NULL,
    FOREIGN KEY (EventID) REFERENCES Events(id),
    FOREIGN KEY (OrgID) REFERENCES Organizations(id)
);

