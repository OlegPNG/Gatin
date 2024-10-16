-- +goose Up
CREATE TABLE flashcards(
    id      UUID NOT NULL,
    front   text NOT NULL,
    back    text NOT NULL,
    PRIMARY KEY(id)
);

-- +goose Down
DROP TABLE flashcards;
