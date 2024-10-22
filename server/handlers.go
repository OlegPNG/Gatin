package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	"gatin-server/internal/database"
	gMiddleware "gatin-server/middleware"

	"github.com/google/uuid"
	openai "github.com/sashabaranov/go-openai"
)

func GenerateFlashcards(notes string) (string, error) {
	client := openai.NewClient(os.Getenv("OPENAI_API_KEY"))

	resp, err := client.CreateChatCompletion(
		context.Background(),
		openai.ChatCompletionRequest{
			Model: openai.GPT4oMini,
			Messages: []openai.ChatCompletionMessage{
				{
					Role: openai.ChatMessageRoleUser,
					Content: `These are class notes, convert them into flashcards using the 
							  following JSON structure {ID: "1", Front: "Term/Concept", Back: "Explanation"}. 
							  Only include the flashcards in your response. Here are the notes:` + notes,
				},
			},
		},
	)

	if err != nil {
		fmt.Printf("ChatCompletion error: %v/n", err)
	}

	flashcards := resp.Choices[0].Message.Content

	return flashcards, nil
}

func (s *State) setupHandlers() {
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
			ID:    uuid.New(),
			Front: body.Front,
			Back:  body.Back,
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

	s.R.Get("/api/generate", func(w http.ResponseWriter, req *http.Request) {
		//PUT NOTES HERE
		notes := `POST YOUR NOTES HERE FOR NOW`

		flashcards, err := GenerateFlashcards(notes)
		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		objects := []Flashcard{}
		err = json.Unmarshal([]byte(flashcards), &objects)
		if err != nil {
			log.Println("Error marshalling chatpgt responses")
		}

		w.Header().Add("Content-type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(flashcards))
	})

}
