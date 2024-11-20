-- +goose Up
ALTER TABLE flashcards
DROP CONSTRAINT flashcards_set_id_fkey,
ADD CONSTRAINT flashcards_set_id_fkey
FOREIGN KEY (set_id) REFERENCES sets(id) ON DELETE CASCADE;
