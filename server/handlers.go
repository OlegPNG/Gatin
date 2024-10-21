package main

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"

	"gatin-server/internal/database"
	gMiddleware "gatin-server/middleware"

	"github.com/google/uuid"
)

func(s *State) setupHandlers() {
    s.R.Get("/api/public", func(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": Hello from a public endpoint. No authentication required"}`))
    })

    s.R.Handle("/api/private", gMiddleware.EnsureValidToken()(
	http.HandlerFunc(func(w http.ResponseWriter, req *http.Request) {
	    w.Header().Set("Access-Control-Allow-Credential", "true")
	    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	    w.Header().Set("Access-Control-Allow-Headers", "Authorization")
	    w.Header().Set("Content-Type", "application/json")
	    w.WriteHeader(http.StatusOK)
	    w.Write([]byte(`{"message":"Hello from a private endpoint! You have been authenticated."}`))
	}),
    ))

    s.R.Post("/api/flashcard", func(w http.ResponseWriter, req *http.Request) {
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

	_, err = s.Db.CreateFlashcard(context.Background(), database.CreateFlashcardParams{
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

    s.R.Get("/api/flashcard", func(w http.ResponseWriter, req *http.Request) {
	data, err := s.Db.GetAllFlashcards(context.Background())
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
    
}
