package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/google/uuid"
	"github.com/joho/godotenv"

	"gatin-server/internal/database"
	gMiddleware "gatin-server/middleware"

	_ "github.com/lib/pq"
)

type state struct {
    db *database.Queries
}

type Flashcard struct {
    Id	    *int
    Front   string
    Back    string
}

type FlashcardMsg struct {
    Flashcards []Flashcard
}

func main() {
    if err := godotenv.Load(); err != nil {
	log.Fatalf("Error loading the .env file: %v", err)
    }

    state := state{}

    dbURL := os.Getenv("PSQL_URL")

    db, err := sql.Open("postgres", dbURL)
    if err != nil {
	log.Fatalf("Error connecting to database: %v", err)
    }

    dbQueries := database.New(db)

    state.db = dbQueries

    r := chi.NewRouter()

    r.Use(middleware.Logger)

    /* HANDLERS */
    r.Get("/api/public", func(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": Hello from a public endpoint. No authentication required"}`))
    })

    r.Handle("/api/private", gMiddleware.EnsureValidToken()(
	http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	    w.Header().Set("Access-Control-Allow-Credential", "true")
	    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	    w.Header().Set("Access-Control-Allow-Headers", "Authorization")
	    w.Header().Set("Content-Type", "application/json")
	    w.WriteHeader(http.StatusOK)
	    w.Write([]byte(`{"message":"Hello from a private endpoint! You have been authenticated."}`))
	}),
    ))

    r.Post("/api/flashcard", func(w http.ResponseWriter, req *http.Request) {
	raw, err := io.ReadAll(req.Body)
	if err != nil {
	    log.Printf("Error reading request body: %v", err)
	    return
	}
	body := Flashcard{}

	err = json.Unmarshal(raw, &body)
	if err != nil {
	    log.Printf("Error Unmarshalling Flashcard: %v", err)
	    return
	}

	_, err = state.db.CreateFlashcard(context.Background(), database.CreateFlashcardParams{
	    ID: uuid.New(),
	    Front: body.Front,
	    Back: body.Back,
	})
	if err != nil {
	    log.Printf("Error inserting flashcard into database: %v", err)
	    return
	}

	w.WriteHeader(http.StatusOK)
    })

    r.Get("/api/flashcard", func(w http.ResponseWriter, req *http.Request) {
	data, err := state.db.GetAllFlashcards(context.Background())
	if err != nil {
	    log.Printf("Error getting flashcards from database: %v", err)
	    return
	}
	raw, err := json.Marshal(data)
	if err != nil {
	    log.Printf("Error marshalling flashcards from database: %v")
	}
	w.WriteHeader(http.StatusOK)
	w.Write(raw)
    })

    /* END HANDLERS */

    log.Print("Server listening on http:/localhost:3010")
    if err := http.ListenAndServe("0.0.0.0:3010", r); err != nil {
	log.Fatalf("There was an error with the http server: %v", err)
    }
}

