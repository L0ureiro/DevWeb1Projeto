create table users (
    id integer primary key autoincrement,
    name text not null,
    email text not null,
    password text not null,
    rank text
);

insert into users (name, email, password, rank)
values ('Fulano', 'fulano@email.com', '1234', 'Advanced'),
       ('Cicrano', 'cicrano@email.com', '123456', 'Intermidiate'),
       ('Meu pau', 'meupau@email.com', '123478', 'Newbie'),
       ('Fini', 'fini@email.com', '1234asv', 'Newbie'),
       ('Depressao', 'triste@email.com', '1234defg', 'Intermidiate'),
       ('Ansiedade', 'desespero@email.com', '1234hij', 'Intermidiate');