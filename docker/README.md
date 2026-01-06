# Docker Deployment for Antigravity Tools

Bu klasör, Antigravity Tools uygulamasının Docker ile dağıtımı için gerekli dosyaları içerir.

## İçerik

- `Dockerfile.backend` - Rust/Tauri backend proxy sunucusu için Dockerfile
- `Dockerfile.frontend` - React/Vite frontend için Dockerfile
- `docker-compose.yml` - Her iki servisi birlikte orkestre etmek için Docker Compose yapılandırması
- `nginx.conf` - Frontend için nginx yapılandırması
- `.dockerignore` - Docker build sürecinden hariç tutulacak dosyalar

## Kullanım

### Docker Compose ile (Önerilen)

Hem backend hem de frontend'i birlikte çalıştırmak için:

```bash
# Proje kök dizininde
docker-compose -f docker/docker-compose.yml up -d
```

Servisleri durdurmak için:

```bash
docker-compose -f docker/docker-compose.yml down
```

Servisleri yeniden oluşturmak için:

```bash
docker-compose -f docker/docker-compose.yml up -d --build
```

### Servisleri Ayrı Ayrı Çalıştırma

#### Backend

```bash
# Proje kök dizininde
docker build -f docker/Dockerfile.backend -t antigravity-backend .
docker run -d -p 8045:8045 -v antigravity-data:/app/data --name antigravity-backend antigravity-backend
```

#### Frontend

```bash
# Proje kök dizininde
docker build -f docker/Dockerfile.frontend -t antigravity-frontend .
docker run -d -p 3000:80 --name antigravity-frontend antigravity-frontend
```

## Erişim

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8045

## Önemli Notlar

- Backend servisi port `8045` üzerinden çalışır
- Frontend servisi port `3000` (nginx port 80'den yönlendirilir) üzerinden çalışır
- Backend verileri `backend-data` volume'ünde saklanır
- Her iki servis de otomatik olarak yeniden başlar (restart: unless-stopped)
- Health check'ler ile servis sağlığı kontrol edilir

## Geliştirme

Docker imajlarını yeniden oluşturmak için:

```bash
# Sadece backend
docker-compose -f docker/docker-compose.yml build backend

# Sadece frontend
docker-compose -f docker/docker-compose.yml build frontend

# Her ikisi
docker-compose -f docker/docker-compose.yml build
```

## Log İzleme

```bash
# Tüm servislerin loglarını görüntüle
docker-compose -f docker/docker-compose.yml logs -f

# Sadece backend logları
docker-compose -f docker/docker-compose.yml logs -f backend

# Sadece frontend logları
docker-compose -f docker/docker-compose.yml logs -f frontend
```

---

# Docker Deployment for Antigravity Tools (English)

This folder contains files needed for Docker deployment of the Antigravity Tools application.

## Contents

- `Dockerfile.backend` - Dockerfile for Rust/Tauri backend proxy server
- `Dockerfile.frontend` - Dockerfile for React/Vite frontend
- `docker-compose.yml` - Docker Compose configuration to orchestrate both services
- `nginx.conf` - Nginx configuration for frontend
- `.dockerignore` - Files to exclude from Docker build process

## Usage

### With Docker Compose (Recommended)

To run both backend and frontend together:

```bash
# In project root directory
docker-compose -f docker/docker-compose.yml up -d
```

To stop services:

```bash
docker-compose -f docker/docker-compose.yml down
```

To rebuild and restart services:

```bash
docker-compose -f docker/docker-compose.yml up -d --build
```

### Running Services Separately

#### Backend

```bash
# In project root directory
docker build -f docker/Dockerfile.backend -t antigravity-backend .
docker run -d -p 8045:8045 -v antigravity-data:/app/data --name antigravity-backend antigravity-backend
```

#### Frontend

```bash
# In project root directory
docker build -f docker/Dockerfile.frontend -t antigravity-frontend .
docker run -d -p 3000:80 --name antigravity-frontend antigravity-frontend
```

## Access

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8045

## Important Notes

- Backend service runs on port `8045`
- Frontend service runs on port `3000` (nginx redirects from port 80)
- Backend data is stored in `backend-data` volume
- Both services automatically restart (restart: unless-stopped)
- Health checks monitor service health

## Development

To rebuild Docker images:

```bash
# Backend only
docker-compose -f docker/docker-compose.yml build backend

# Frontend only
docker-compose -f docker/docker-compose.yml build frontend

# Both
docker-compose -f docker/docker-compose.yml build
```

## Log Monitoring

```bash
# View logs from all services
docker-compose -f docker/docker-compose.yml logs -f

# Backend logs only
docker-compose -f docker/docker-compose.yml logs -f backend

# Frontend logs only
docker-compose -f docker/docker-compose.yml logs -f frontend
```
