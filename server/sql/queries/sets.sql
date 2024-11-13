-- name: CreateSet :one
INSERT INTO sets (id, title, description, email)
VALUES (
    $1,
    $2,
    $3,
    $4
)
RETURNING *;

-- name: GetSetsByAccount :many
SELECT * FROM sets
WHERE (email = $1);

-- name: GetSetOwner :one
SELECT email FROM sets
WHERE (id = $1);

-- name: DeleteSet :exec
DELETE FROM sets WHERE (id = $1);

-- name: EditSet :exec
UPDATE sets SET title = $2, description = $3 WHERE (id = $1);