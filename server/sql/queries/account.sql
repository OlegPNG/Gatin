-- name: RegisterAccount :one
INSERT INTO account(email, password)
VALUES(
    $1,
    $2
)
RETURNING *;

-- name: GetAccount :one
SELECT * FROM account WHERE email = $1 LIMIT 1;
