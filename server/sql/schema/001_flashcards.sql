-- +goose Up
CREATE TABLE flashcards(
    id      UUID,
    front   varchar(255),
    back    varchar(255) 
);

-- +goose Down
DROP TABLE flashcards;
