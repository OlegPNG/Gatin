-- name: CreateFlashcard :one
INSERT INTO flashcards (set_id, front, back)
VALUES (
    $1,
    $2,
    $3
)
RETURNING *;

-- name: CreateFlashcards :copyfrom
INSERT INTO flashcards (set_id, front, back)
VALUES ($1, $2, $3);

-- name: GetAllFlashcards :many
SELECT * FROM flashcards;

-- name: GetFlashcardsBySetId :many
SELECT * FROM flashcards
WHERE (set_id = $1);

-- name: EditFlashcards :exec
UPDATE flashcards SET front = $3, back = $4 WHERE (set_id = $1 AND id =$2);

-- name: DeleteFlashcards :exec
DELETE FROM flashcards WHERE (set_id = $1 AND id =$2);