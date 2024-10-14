-- name: CreateFlashcard :one
INSERT INTO flashcards (id, front, back)
VALUES (
    $1,
    $2,
    $3
)
RETURNING *;

-- name: GetAllFlashcards :many
SELECT * FROM flashcards;
