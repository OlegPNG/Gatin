package main

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"io"
	"log"
	"net/http"
	"time"

	"gatin-server/internal/database"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"
)

type Credentials struct {
    Email string `json:"email"`
    Password string `json:"password"`
}

func(s *State) setupHandlers() {
    s.R.Post("/api/flashcard", s.TestFlashcardPostHandler)

    s.R.Get("/api/flashcard", s.TestFlashcardGetHandler)

    s.R.Post("/api/register", s.RegisterHandler)
    s.R.Post("/api/signin", s.SigninHandler)
    s.R.Post("/api/refresh", s.RefreshHandler)
    s.R.Post("/api/logout", s.LogoutHandler)

    s.R.Get("/api/welcome", s.WelcomeHandler)
}

func(s *State) TestFlashcardPostHandler(w http.ResponseWriter, req *http.Request) {
	raw, err := io.ReadAll(req.Body)
	if err != nil {
	    log.Printf("Error reading request body: %v", err)
	    return
	}
	body := database.Flashcard{}

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
}

func(s *State) TestFlashcardGetHandler(w http.ResponseWriter, req *http.Request) {
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
}

func(s *State) RegisterHandler(w http.ResponseWriter, r *http.Request) {
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

func(s *State) SigninHandler(w http.ResponseWriter, r *http.Request) {
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
	email: creds.Email,
	expiry:	expiresAt,
    }

    http.SetCookie(w, &http.Cookie{
	Name:	    "session_token",
	Value:	    sessionToken,
	Expires:    expiresAt,
    })
}

func(s *State) RefreshHandler(w http.ResponseWriter, r *http.Request) {
    c, err := r.Cookie("session_token")
    if err != nil {
	if err == http.ErrNoCookie {
	    w.WriteHeader(http.StatusUnauthorized)
	    return
	}
    }

    sessionToken := c.Value

    userSession, err := s.verifySessionToken(sessionToken)
    if err != nil {
	w.WriteHeader(http.StatusUnauthorized)
	return
    }

    newToken := uuid.NewString()
    expiresAt := time.Now().Add(120 * time.Second)

    s.sessions[newToken] = session{
	email: userSession.email,
	expiry: expiresAt,
    }

    delete(s.sessions, sessionToken)

    http.SetCookie(w, &http.Cookie{
	Name: "session_token",
	Value: newToken,
	Expires: expiresAt,
    })
}

func(s *State) LogoutHandler(w http.ResponseWriter, r *http.Request) {
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
	Name: "session_token",
	Value: "",
	Expires: time.Now(),
    })
}

// Test handler for session cookies
func(s *State) WelcomeHandler(w http.ResponseWriter, r *http.Request) {
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

    userSession, err := s.verifySessionToken(sessionToken)
    if err != nil {
	w.WriteHeader(http.StatusUnauthorized)
	return
    }

    w.Write([]byte("Welcome " + userSession.email))
}

func(s *State) verifySessionToken(token string) (session, error) {
    userSession, exists := s.sessions[token]
    if !exists{
	return session{}, errors.New("Invalid Token")
    }

    if userSession.isExpired() {
	delete(s.sessions, token)
	return session{}, errors.New("Token Expired")
    }

    return userSession, nil
}
