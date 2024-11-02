-- name: CreateSet :one
INSERT INTO sets (id, title, description, email)
VALUES (
    $1,
    $2,
    $3,
    $4
)
RETURNING *;

