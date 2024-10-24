package main

import (
	//"context"
	"database/sql"
	//"encoding/json"
	//"io"
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"

	//"github.com/google/uuid"
	"github.com/joho/godotenv"

	"gatin-server/internal/database"
	//gMiddleware "gatin-server/middleware"

	_ "github.com/lib/pq"
)

type State struct {
	Db *database.Queries
	R  *chi.Mux
}

type Flashcardz struct {
	Id    *int
	Front string
	Back  string
}

type FlashcardMsg struct {
	Flashcards []Flashcard
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Fatalf("Error loading the .env file: %v", err)
	}

	state := State{}

	dbURL := os.Getenv("PSQL_URL")

	port := os.Getenv("GATIN_PORT")

	db, err := sql.Open("postgres", dbURL)
	if err != nil {
		log.Fatalf("Error connecting to database: %v", err)
	}

	dbQueries := database.New(db)

	state.Db = dbQueries

	r := chi.NewRouter()

	r.Use(middleware.Logger)

	state.R = r

	state.setupHandlers()

	log.Print("Server listening on http:/localhost:" + port)
	if err := http.ListenAndServe("0.0.0.0:"+port, r); err != nil {
		log.Fatalf("There was an error with the http server: %v", err)
	}
}
