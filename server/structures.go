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
	ID    string `json:"id"`
	Front string `json:"front"`
	Back  string `json:"back"`
}

type cardPreferences struct {
	terms   bool
	course  *string
	unit    *string
	content *string
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

	if userPref.terms {
		prompt += `Convert the following User notes into Flashcards using the format provided. The id starts with 1 and goes to n. Put a term or word on the front. Put the definition on the back.`
		if userPref.course != nil {
			prompt += fmt.Sprintf("The course subject is: %v. ", *userPref.course)
		}
		if userPref.unit != nil {
			prompt += fmt.Sprintf("The concept or unit is: %v. ", *userPref.unit)
		}
		if userPref.content != nil {
			prompt += "The user has provided the following specifications for creating the flashcards: " + *userPref.content
		}
	} else {
		prompt += `Convert the following User notes into Flashcards using the format provided. The id starts with 1 and goes to n. Put a question on the front. Put the answer to the question on the back. `
		if userPref.course != nil {
			prompt += fmt.Sprintf("The course subject is: %v. ", *userPref.course)
		}
		if userPref.unit != nil {
			prompt += fmt.Sprintf("The concept or unit is: %v. ", *userPref.unit)
		}
		if userPref.content != nil {
			prompt += "The user has provided the following specifications for creating the flashcards: " + *userPref.content
		}
	}
	print(prompt)
	return prompt
}

var userNotes string = `hardcode notes here`

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
				Content: "for the following flashcards, Use an exaggerated Southern accent, full of colloquialisms, slang, and phonetic spellings that make it hard to understand. Make sure the characters sound like they're straight outta the deep South, with plenty of humor and charm. Use phrases like 'y’all,' 'fixin’ to,' and drop a lot of consonants for that thick drawl.",
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
