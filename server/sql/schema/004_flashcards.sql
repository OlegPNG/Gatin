-- +goose Up
DROP TABLE flashcards;
CREATE TABLE flashcards(
    set_id  UUID    NOT NULL,
    id      SERIAL NOT NULL,
    front   TEXT NOT NULL,
    back    TEXT NOT NULL,
    PRIMARY KEY (id, set_id),
    FOREIGN KEY (set_id) REFERENCES sets(id)
);

-- +goose Down
ALTER TABLE flashcards
DROP COLUMN set_id;
