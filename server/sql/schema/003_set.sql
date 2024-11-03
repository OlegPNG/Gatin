-- +goose Up
CREATE TABLE sets(
    id UUID NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    email TEXT NOT NULL REFERENCES account (email),
    PRIMARY KEY(id)
);

-- +goose Down
DROP TABLE sets;
