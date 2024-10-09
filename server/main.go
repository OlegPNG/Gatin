package main

import (
	"log"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"

	gMiddleware "gatin-server/middleware"
)

func main() {
    if err := godotenv.Load(); err != nil {
	log.Fatalf("Error loading the .env file: %v", err)
    }

    r := chi.NewRouter()

    r.Use(middleware.Logger)

    setupHandlers(r)

    log.Print("Server listening on http:/localhost:3010")
    if err := http.ListenAndServe("0.0.0.0:3010", r); err != nil {
	log.Fatalf("There was an error with the http server: %v", err)
    }
}


func setupHandlers(r *chi.Mux) {
    r.Get("/api/public", func(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": Hello from a public endpoint. No authentication required"}`))
    })

    r.Handle("/api/private", gMiddleware.EnsureValidToken()(
	http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	    w.Header().Set("Access-Control-Allow-Credential", "true")
	    w.Header().Set("Access-Control-Allow-Origin", "http://localhost:3000")
	    w.Header().Set("Access-Control-Allow-Headers", "Authorization")
	    w.Header().Set("Content-Type", "application/json")
	    w.WriteHeader(http.StatusOK)
	    w.Write([]byte(`{"message":"Hello from a private endpoint! You have been authenticated."}`))
	}),
    ))
}
