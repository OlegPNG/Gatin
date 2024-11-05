package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"strings"

	"github.com/joho/godotenv"
	openai "github.com/sashabaranov/go-openai"
	"github.com/sashabaranov/go-openai/jsonschema"
	"github.com/tiktoken-go/tokenizer"
)

type Flashcard struct {
	Front string `json:"front"`
	Back  string `json:"back"`
}

type GenerateRequest struct {
	Notes       string          `json:"notes"`
	Preferences cardPreferences `json:"preferences"`
	Title       string          `json:"title"`
	Description string          `json:"description"`
}

type cardPreferences struct {
	Terms   bool    `json:"terms"`
	Course  *string `json:"course"`
	Unit    *string `json:"unit"`
	Content *string `json:"content"`
}

type Quiz struct {
	Question string `json:"question"`
	Correct  string `json:"correct"`
	Option2  string `json:"option2"`
	Option3  string `json:"option3"`
	Option4  string `json:"option4"`
}

func promptBuilder(userPref cardPreferences) (prompt string) {
	prompt = ``

	if userPref.Terms {
		prompt += `Convert the following User notes into Flashcards using the format provided. The id starts with 1 and goes to n. Put a term or word on the front. Put the definition on the back.`
		if userPref.Course != nil {
			prompt += fmt.Sprintf("The course subject is: %v. ", *userPref.Course)
		}
		if userPref.Unit != nil {
			prompt += fmt.Sprintf("The concept or unit is: %v. ", *userPref.Unit)
		}
		if userPref.Content != nil {
			prompt += "The user has provided the following specifications for creating the flashcards: " + *userPref.Content
		}
	} else {
		prompt += `Convert the following User notes into Flashcards using the format provided. The id starts with 1 and goes to n. Put a question on the front. Put the answer to the question on the back. `
		if userPref.Course != nil {
			prompt += fmt.Sprintf("The course subject is: %v. ", *userPref.Course)
		}
		if userPref.Unit != nil {
			prompt += fmt.Sprintf("The concept or unit is: %v. ", *userPref.Unit)
		}
		if userPref.Content != nil {
			prompt += "The user has provided the following specifications for creating the flashcards: " + *userPref.Content
		}
	}
	print(prompt)
	return prompt
}

const (
	MaxTokens    = 4096
	BufferTokens = 200
)

func generateSet(notes string, userPref cardPreferences) ([]Flashcard, error) {
	chunks, err := splitIntoChunks(notes)
	if err != nil {
		return nil, fmt.Errorf("error splitting notes: %v", err)
	}

	prompt := promptBuilder(userPref)

	var flashcardSet []Flashcard

	for _, chunk := range chunks {
		cards, err := GenerateFlashcards(chunk, prompt)
		if err != nil {
			return nil, fmt.Errorf("error generating flashcards: %v", err)
		}

		flashcardSet = append(flashcardSet, cards...)
	}
	return flashcardSet, nil
}

func GenerateFlashcards(notes string, prompt string) ([]Flashcard, error) {
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
				Content: prompt,
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

	return result.Flashcards, nil
}

func splitIntoChunks(notes string) ([]string, error) {
	enc, err := tokenizer.Get(tokenizer.Cl100kBase)
	if err != nil {
		return nil, fmt.Errorf("failed to get tokenizer: %v", err)
	}

	//splitting string into paragraphs
	var chunks []string
	paragraphs := strings.Split(notes, "\n\n")
	currentChunk := ""
	currentTokens := 0

	for _, para := range paragraphs {
		//encoding each paragraph and checking len() to get amount of tokens
		paraTokens, _, _ := enc.Encode(para)
		paraTokenCount := len(paraTokens)

		if currentTokens+paraTokenCount > MaxTokens-BufferTokens {
			//appends currentChunk to chunks slice
			if currentChunk != "" {
				chunks = append(chunks, currentChunk)
			}
			//sets current chunk equal to paragraph we are on
			currentChunk = para
			currentTokens = paraTokenCount
		} else {
			if currentChunk != "" {
				currentChunk += "\n\n"
			}
			currentChunk += para
			currentTokens += paraTokenCount
		}
	}

	//in case for loop ends on half a chunk
	if currentChunk != "" {
		chunks = append(chunks, currentChunk)
	}

	return chunks, nil
}

func CreateQuiz(flashcards string) ([]Quiz, error) {
	godotenv.Load(".env")
	key := os.Getenv("OPENAI_API_KEY")
	client := openai.NewClient(key)
	ctx := context.Background()

	type Result struct {
		Quiz []Quiz `json:"Quiz"`
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
				Content: "For the following flashcards make a quiz. Use the back as the correct answer, make other optionsbe related to the question",
			},
			{
				Role:    openai.ChatMessageRoleUser,
				Content: flashcards,
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

	return result.Quiz, nil
}
