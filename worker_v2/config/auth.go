package config

import (
	"net/http"
	"strings"

	"go.uber.org/zap"
)

type AuthService struct {
	config *Config
	logger *zap.Logger
}

func NewAuthService(config *Config, logger *zap.Logger) *AuthService {
	return &AuthService{
		config: config,
		logger: logger,
	}
}

func (a *AuthService) Authenticate(req *http.Request) bool {
	if !a.config.IsAuthEnabled() {
		// Authentication Disabled
		return true
	}
	api_key := a.config.GetApiKey()
	if api_key == "" {
		return false
	}
	auth_header := req.Header.Get("Authorization")
	if auth_header == "" {
		api_key_header := req.Header.Get("X-API-Key")
		if api_key_header != api_key {
			return false
		}
		return true
	}
	var token string
	if strings.HasPrefix(auth_header, "Bearer ") {
		token = auth_header[7:]
	} else {
		token = auth_header
	}
	if token != api_key {
		return false
	}
	return true
}
