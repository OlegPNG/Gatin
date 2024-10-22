-- +goose Up
ALTER TABLE flashcards
ADD set_id UUID;

-- +goose Down
ALTER TABLE flashcards
DROP COLUMN set_id;
