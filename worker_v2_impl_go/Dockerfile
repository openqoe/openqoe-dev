FROM golang:1.25-bookworm AS builder
WORKDIR /app

# Copy only necessary files
COPY go.mod go.sum ./
RUN go mod download
COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags="-s -w" -o openqoe-worker .

FROM scratch
USER 65532:65532
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=builder /app/openqoe-worker /openqoe-worker
ENTRYPOINT ["/openqoe-worker"]
