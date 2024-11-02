-- name: CreateFlashcard :one
INSERT INTO flashcards (id, set_id, front, back)
VALUES (
    $1,
    $2,
    $3,
    $4
)
RETURNING *;

-- name: GetAllFlashcards :many
SELECT * FROM flashcards;

-- name: GetFlashcardsBySetId :many
SELECT * FROM flashcards
WHERE (set_id = $1) AND (id = $2);
