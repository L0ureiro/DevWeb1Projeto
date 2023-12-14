CREATE TABLE users (
    id integer primary key autoincrement,
    name text not null,
    email text not null,
    password text not null,
    rank text
);

INSERT INTO users (name, email, password, rank)
VALUES 
    ('John Doe', 'john.doe@example.com', 'password123', 'Advanced'),
    ('Alice Smith', 'alice.smith@example.com', 'securepass', 'Intermediate'),
    ('Bob Johnson', 'bob.johnson@example.com', 'letmein', 'Intermediate'),
    ('Emily Davis', 'emily.davis@example.com', 'pass123', 'Advanced'),
    ('Chris Wilson', 'chris.wilson@example.com', 'abc123', 'Intermediate'),
    ('Eva White', 'eva.white@example.com', 'userpass', 'Newbie'),
    ('Michael Brown', 'michael.brown@example.com', 'securepassword', 'Advanced'),
    ('Sophia Turner', 'sophia.turner@example.com', 'mypassword', 'Intermediate'),
    ('David Lee', 'david.lee@example.com', 'letmein123', 'Intermediate'),
    ('Olivia Miller', 'olivia.miller@example.com', 'qwerty', 'Advanced');
