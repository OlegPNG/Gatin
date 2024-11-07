package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"io"

	//"io"
	"log"
	"net/http"
	"time"

	"gatin-server/internal/database"

	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type Credentials struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func (s *State) setupHandlers() {
	//s.R.Post("/api/flashcard", s.TestFlashcardPostHandler)

	s.R.Get("/api/flashcard", s.TestFlashcardGetHandler)
	s.R.Get("/api/sets", s.SetGetHandler)
	s.R.Post("/api/sets", s.SetPostHandler)

	s.R.Get("/api/flashcards", s.FlashcardGetHandler)
	s.R.Post("/api/flashcards", s.FlashcardPostHandler)

	s.R.Post("/api/register", s.RegisterHandler)
	s.R.Post("/api/signin", s.SigninHandler)
	s.R.Post("/api/refresh", s.RefreshHandler)
	s.R.Post("/api/logout", s.LogoutHandler)

	s.R.Get("/api/welcome", s.WelcomeHandler)

	s.R.Post("/api/generate", s.GeneratePostHandler)
	s.R.Get("/api/quiz", s.QuizGetHandler)

}

// Creates Sets
func (s *State) SetPostHandler(w http.ResponseWriter, req *http.Request) {
	userSession, err := s.validateSessionToken(req)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	raw, err := io.ReadAll(req.Body)
	if err != nil {
		log.Println("SetPostHandler error: " + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	body := struct {
		title       string
		description string
	}{}

	err = json.Unmarshal(raw, &body)
	if err != nil {
		log.Println("SetPostHandler error: " + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	s.Db.CreateSet(
		context.Background(),
		database.CreateSetParams{
			ID:          uuid.New(),
			Title:       body.title,
			Description: body.description,
			Email:       userSession.email,
		},
	)
}

func (s *State) SetGetHandler(w http.ResponseWriter, req *http.Request) {
	userSession, err := s.validateSessionToken(req)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	sets, err := s.Db.GetSetsByAccount(context.Background(), userSession.email)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	// Creates struct to generate json response from, contains list of ids
	setResponse := struct {
		Sets []database.Set `json:"sets"`
	}{Sets: sets}

	raw, err := json.Marshal(setResponse)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Write(raw)
}

type ClientFlashcard struct {
	Front string `json:"front"`
	Back  string `json:"back"`
}

func createFlashcardDbObjects(set uuid.UUID, cards []ClientFlashcard) []database.CreateFlashcardsParams {
	dbCards := []database.CreateFlashcardsParams{}
	for _, card := range cards {
		dbCards = append(dbCards, database.CreateFlashcardsParams{
			SetID: set,
			Front: card.Front,
			Back:  card.Back,
		})
	}

	return dbCards
}

func (s *State) FlashcardPostHandler(w http.ResponseWriter, req *http.Request) {
	userSession, err := s.validateSessionToken(req)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	//"set" gets the url query parameter
	set := req.URL.Query().Get("set")
	set_id, err := uuid.Parse(set)
	if err != nil {
		log.Println("FlashcardPostHandler error: " + err.Error())
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	dbEmail, err := s.Db.GetSetOwner(context.Background(), set_id)
	if err != nil {
		log.Println("FlashcardpostHandler error: " + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if userSession.email != dbEmail {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	raw, err := io.ReadAll(req.Body)
	if err != nil {
		log.Println("FlashcardPostHandler error: " + err.Error())
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	fcRequest := struct {
		Flashcards []ClientFlashcard `json:"flashcards"`
	}{}

	err = json.Unmarshal(raw, &fcRequest)
	if err != nil {
		log.Println("FlashcardPostHandler error: " + err.Error())
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	dbCards := createFlashcardDbObjects(set_id, fcRequest.Flashcards)

	total, err := s.Db.CreateFlashcards(context.Background(), dbCards)
	if err != nil {
		log.Printf("FlashcardPostHandler error: %v\n", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	log.Printf("Created %v flashcards\n", total)

	return
}

func (s *State) FlashcardGetHandler(w http.ResponseWriter, req *http.Request) {
	userSession, err := s.validateSessionToken(req)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	set := req.URL.Query().Get("set")
	set_id, err := uuid.Parse(set)
	if err != nil {
		log.Println("FlashcardGetHandler error: " + err.Error())
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	dbEmail, err := s.Db.GetSetOwner(context.Background(), set_id)
	if err != nil {
		log.Println("FlashcardGetHandler error: " + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if userSession.email != dbEmail {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	fc, err := s.Db.GetFlashcardsBySetId(
		context.Background(),
		set_id,
	)
	if err != nil {
		log.Println("FlashcardGetHandler error: " + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	log.Printf("Responding with %v flashcards", len(fc))

	flashcardResponse := struct {
		Cards []database.Flashcard `json:"flashcards"`
	}{
		fc,
	}
	raw, err := json.Marshal(flashcardResponse)
	if err != nil {
		log.Println("FlashcardGetHandler error: " + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(raw)
}

func (s *State) QuizGetHandler(w http.ResponseWriter, req *http.Request) {
	userSession, err := s.validateSessionToken(req)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}
	//get flashcards from DB
	set := req.URL.Query().Get("set")
	set_id, err := uuid.Parse(set)
	if err != nil {
		log.Println("QuizGetHandler error: " + err.Error())
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	dbEmail, err := s.Db.GetSetOwner(context.Background(), set_id)
	if err != nil {
		log.Println("QuizGetHandler error: " + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if userSession.email != dbEmail {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	fc, err := s.Db.GetFlashcardsBySetId(
		context.Background(),
		set_id,
	)
	if err != nil {
		log.Println("QuizGetHandler error: " + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	//put cards into my struct
	Cards := []ClientFlashcard{}
	for _, card := range fc {
		Cards = append(Cards, ClientFlashcard{
			Front: card.Front,
			Back:  card.Back,
		})
	}

	raw, err := json.Marshal(Cards)
	if err != nil {
		log.Println("QuizGetHandler marshalling error: " + err.Error())
	}
	cardString := string(raw)

	quiz, err := CreateQuiz(cardString)
	if err != nil {
		log.Printf("Error creating set: %v", err)
	}

	data, err := json.Marshal(quiz)
	if err != nil {
		log.Printf("Failed to marshal JSON response: %v", err)
		w.WriteHeader(500)
		return
	}

	w.Header().Add("Content-type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func (s *State) GeneratePostHandler(w http.ResponseWriter, req *http.Request) {
	userSession, err := s.validateSessionToken(req)
	if err != nil {
		log.Println(err)
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	raw, err := io.ReadAll(req.Body)
	if err != nil {
		log.Println("GeneratePostHandler error: " + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	var generateRequest GenerateRequest

	err = json.Unmarshal(raw, &generateRequest)
	if err != nil {
		log.Println("GeneratePostHandler error: " + err.Error())
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	userNotes := generateRequest.Notes
	userPreferences := generateRequest.Preferences

	flashcards, err := generateSet(userNotes, userPreferences)
	if err != nil {
		log.Printf("Error creating set: %v", err)
	}

	//where do i pull setID from??????????????????????????????????????????
	setID := uuid.New()
	title := generateRequest.Title
	description := generateRequest.Description

	s.Db.CreateSet(
		context.Background(),
		database.CreateSetParams{
			ID:          setID,
			Title:       title,
			Description: description,
			Email:       userSession.email,
		},
	)

	for _, card := range flashcards {
		_, err := s.Db.CreateFlashcard(
			context.Background(),
			database.CreateFlashcardParams{
				SetID: setID,
				Front: card.Front,
				Back:  card.Back,
			},
		)
		if err != nil {
			log.Printf("Error creating flashcard: %v", err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
	}

	response := struct {
		SetID uuid.UUID `json:"setID"`
	}{
		SetID: setID,
	}

	w.Header().Add("Content-type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (s *State) TestFlashcardGetHandler(w http.ResponseWriter, req *http.Request) {
	data, err := s.Db.GetAllFlashcards(context.Background())
	if err != nil {
		log.Printf("Error getting flashcards from database: %v", err)
		return
	}
	raw, err := json.Marshal(data)
	if err != nil {
		log.Printf("Error marshalling flashcards from database: %v", err)
	}
	w.WriteHeader(http.StatusOK)
	w.Write(raw)
}

func (s *State) RegisterHandler(w http.ResponseWriter, r *http.Request) {
	creds := &Credentials{}

	err := json.NewDecoder(r.Body).Decode(creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), 8)

	if _, err = s.Db.RegisterAccount(context.Background(), database.RegisterAccountParams{
		Email: creds.Email, Password: string(hashedPassword),
	}); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

func (s *State) SigninHandler(w http.ResponseWriter, r *http.Request) {
	creds := &Credentials{}
	err := json.NewDecoder(r.Body).Decode(creds)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		return
	}

	account, err := s.Db.GetAccount(context.Background(), creds.Email)
	if err != nil {
		if err == sql.ErrNoRows {
			w.WriteHeader(http.StatusUnauthorized)
		} else {
			w.WriteHeader(http.StatusInternalServerError)
		}
		return
	}

	if err = bcrypt.CompareHashAndPassword([]byte(account.Password), []byte(creds.Password)); err != nil {
		w.WriteHeader(http.StatusUnauthorized)
	}

	sessionToken := uuid.NewString()
	expiresAt := time.Now().Add(120 * time.Second)

	s.sessions[sessionToken] = session{
		email:  creds.Email,
		expiry: expiresAt,
	}

	http.SetCookie(w, &http.Cookie{
		Name:    "session_token",
		Value:   sessionToken,
		Expires: expiresAt,
	})
}

func (s *State) RefreshHandler(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
	}

	sessionToken := c.Value

	userSession, err := s.validateSessionToken(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	newToken := uuid.NewString()
	expiresAt := time.Now().Add(120 * time.Second)

	s.sessions[newToken] = session{
		email:  userSession.email,
		expiry: expiresAt,
	}

	delete(s.sessions, sessionToken)

	http.SetCookie(w, &http.Cookie{
		Name:    "session_token",
		Value:   newToken,
		Expires: expiresAt,
	})
}

func (s *State) LogoutHandler(w http.ResponseWriter, r *http.Request) {
	c, err := r.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		w.WriteHeader(http.StatusBadRequest)
		return
	}
	sessionToken := c.Value

	delete(s.sessions, sessionToken)

	http.SetCookie(w, &http.Cookie{
		Name:    "session_token",
		Value:   "",
		Expires: time.Now(),
	})
}

// Test handler for session cookies
func (s *State) WelcomeHandler(w http.ResponseWriter, r *http.Request) {
	userSession, err := s.validateSessionToken(r)
	if err != nil {
		w.WriteHeader(http.StatusUnauthorized)
		return
	}

	w.Write([]byte("Welcome " + userSession.email))
}

func (s *State) validateSessionToken(req *http.Request) (session, error) {
	c, err := req.Cookie("session_token")
	if err != nil {
		if err == http.ErrNoCookie {
			return session{}, errors.New("No session_token cookie provided")
		}
		return session{}, errors.New("Bad request")
	}
	token := c.Value

	userSession, exists := s.sessions[token]
	if !exists {
		return session{}, errors.New("Invalid Token")
	}

	if userSession.isExpired() {
		delete(s.sessions, token)
		return session{}, errors.New("Token Expired")
	}

	userSession.extend()
	return userSession, nil
}
