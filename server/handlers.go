package main

import (
	"context"
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"gatin-server/internal/database"
	gMiddleware "gatin-server/middleware"

	"github.com/google/uuid"
	"github.com/joho/godotenv"
	openai "github.com/sashabaranov/go-openai"
	"github.com/sashabaranov/go-openai/jsonschema"
)

type Flashcard struct {
	ID    string `json:"id"`
	Front string `json:"front"`
	Back  string `json:"back"`
}

func GenerateFlashcards(notes string) []Flashcard {
	godotenv.Load(".env")
	key := os.Getenv("OPENAI_API_KEY")
	client := openai.NewClient(key)
	ctx := context.Background()

	type Result struct {
		Flashcards []Flashcard `json:"flashcards"`
	}

	var result Result
	schema, err := jsonschema.GenerateSchemaForType(result)
	if err != nil {
		log.Fatalf("GenerateSchemaForType error: %v", err)
	}

	resp, err := client.CreateChatCompletion(ctx, openai.ChatCompletionRequest{
		Model: openai.GPT4oMini,
		Messages: []openai.ChatCompletionMessage{
			{
				Role:    openai.ChatMessageRoleSystem,
				Content: "Convert the following notes into Flashcards using the format provided. The front is the term or concept. The back is the definition",
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: notes,
			},
		},
		ResponseFormat: &openai.ChatCompletionResponseFormat{
			Type: openai.ChatCompletionResponseFormatTypeJSONSchema,
			JSONSchema: &openai.ChatCompletionResponseFormatJSONSchema{
				Name:   "flash_cards",
				Schema: schema,
				Strict: true,
			},
		},
	})
	if err != nil {
		log.Fatalf("CreateChatCompletion error: %v", err)
	}
	err = schema.Unmarshal(resp.Choices[0].Message.Content, &result)
	if err != nil {
		log.Fatalf("Unmarshal schema error: %v", err)
	}

	return result.Flashcards
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
		notes := `POST NOTES`

		flashcards := GenerateFlashcards(notes)

		/*
			objects := []Flashcard{}
			err = json.Unmarshal([]byte(flashcards), &objects)
			if err != nil {
				log.Println("Error Unmarshalling chatpgt responses %v", err)
			}
		*/

		data, err := json.Marshal(flashcards)
		if err != nil {
			log.Printf("Failed to marshal JSON response: %v", flashcards)
			w.WriteHeader(500)
			return
		}

		w.Header().Add("Content-type", "application/json")
		w.WriteHeader(http.StatusOK)
		w.Write(data)
	})

}
