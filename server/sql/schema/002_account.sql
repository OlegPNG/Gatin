-- +goose Up
CREATE TABLE account(
    email text NOT NULL,
    password text NOT NULL,
    PRIMARY KEY(email)
);

-- +goose Down
DROP TABLE user;
