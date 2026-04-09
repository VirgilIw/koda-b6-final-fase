create table if not exists users (
    id int generated always as identity primary key,
    name varchar(255),
    password varchar(255) not null,
    email varchar(255) unique not null,
    image text,
    created_at timestamp default now(),
    updated_at timestamp default now(),
    deleted_at timestamp
);

create table if not exists links(
    id int generated always as identity primary key,
    user_id int not null references users(id),
    original_url text not null,
    slug varchar(50) unique not null,
    click_count int default 0,
    created_at timestamp default now(),
    updated_at timestamp default now(),
    deleted_at timestamp
);
