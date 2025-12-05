# LyrIQ Backend API Documentation

## Table of Contents
- [Project Overview](#project-overview)
- [Setup Instructions](#setup-instructions)
- [Environment Configuration](#environment-configuration)
- [Running the Server](#running-the-server)
- [API Endpoints](#api-endpoints)
- [Testing the API](#testing-the-api)
- [Database Models](#database-models)
- [Troubleshooting](#troubleshooting)

---

## Project Overview

LyrIQ is a lyric-guessing game where users create and complete "Finish the Lyric" challenges. The backend is built with Django and Django REST Framework, integrated with the Genius API for fetching song lyrics.

**Tech Stack:**
- Python 3.8+
- Django 5.0
- Django REST Framework
- Genius API (lyricsgenius)
- SQLite (development database)

---

## Setup Instructions

### Prerequisites

Make sure you have the following installed:
- Python 3.8 or higher
- pip (Python package manager)
- Git

### Step 1: Clone the Repository

```bash
git clone https://github.com/your-username/lyriq.git
cd lyriq/backend
```

### Step 2: Create Virtual Environment

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

You should see `(venv)` at the beginning of your terminal prompt.

### Step 3: Install Dependencies

```bash
pip install --upgrade pip
pip install -r requirements.txt
```

### Step 4: Set Up Environment Variables

Create a `.env` file in the `backend` directory:

```bash
touch .env
```

Add the following to `.env`:

```
DEBUG=True
SECRET_KEY=your-django-secret-key-here
GENIUS_API_KEY=your-genius-api-key-here
```

**Getting a Genius API Key:**
1. Go to https://genius.com/api-clients
2. Sign in or create an account
3. Click "New API Client"
4. Fill out the form:
   - App Name: LyrIQ
   - App Website: http://localhost:3000
   - Redirect URI: http://localhost:3000/callback
5. Copy your **Client Access Token** and paste it in `.env`

### Step 5: Run Database Migrations

```bash
python manage.py migrate
```

### Step 6: Create a Superuser (Admin Account)

```bash
python manage.py createsuperuser
```

Follow the prompts to create your admin account.

### Step 7: Start the Development Server

```bash
python manage.py runserver
```

The server will start at: **http://127.0.0.1:8000/**

---

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DEBUG` | Enable debug mode | `True` (dev) / `False` (production) |
| `SECRET_KEY` | Django secret key | Random string |
| `GENIUS_API_KEY` | Genius API token | Your API token from Genius |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | SQLite (local file) |

---

## Running the Server

### Daily Workflow

Every time you work on the project:

```bash
# 1. Navigate to backend directory
cd lyriq/backend

# 2. Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate  # Windows

# 3. Start server
python manage.py runserver

# 4. When done, deactivate
deactivate
```

### Common Django Commands

```bash
# Create new migrations after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Open Django shell
python manage.py shell

# Run tests
python manage.py test
```

---

## API Endpoints

Base URL: `http://127.0.0.1:8000/api/`

### Lyrics Endpoints

#### 1. Search for Songs
**GET** `/api/lyrics/search/`

Search for songs by title or artist.

**Query Parameters:**
- `q` (required): Search query
- `max_results` (optional): Number of results (default: 10)

**Example:**
```
GET /api/lyrics/search/?q=shape%20of%20you&max_results=5
```

**Response:**
```json
{
  "songs": [
    {
      "id": 3039923,
      "title": "Shape of You",
      "artist": "Ed Sheeran",
      "album": "÷ (Divide)",
      "release_date": "January 6, 2017",
      "thumbnail": "https://...",
      "url": "https://genius.com/..."
    }
  ]
}
```

---

#### 2. Fetch Song Lyrics
**POST** `/api/lyrics/fetch/`

Get complete lyrics for a specific song.

**Request Body:**
```json
{
  "title": "Shape of You",
  "artist": "Ed Sheeran"
}
```

**Response:**
```json
{
  "id": 3039923,
  "title": "Shape of You",
  "artist": "Ed Sheeran",
  "lyrics": "Full lyrics text here...",
  "lines": ["Line 1", "Line 2", "Line 3"],
  "url": "https://genius.com/..."
}
```

---

### Challenge Endpoints

#### 3. List All Challenges
**GET** `/api/challenges/`

Get all public challenges.

**Response:**
```json
[
  {
    "id": 1,
    "song_title": "Shape of You",
    "artist": "Ed Sheeran",
    "genre": "Pop",
    "blanked_lyric": "I'm in love with ____ ____",
    "creator": 1,
    "creator_name": "john_doe",
    "created_at": "2025-11-26T12:00:00Z"
  }
]
```

---

#### 4. Get Single Challenge
**GET** `/api/challenges/{id}/`

Get details of a specific challenge.

**Response:**
```json
{
  "id": 1,
  "song_title": "Shape of You",
  "artist": "Ed Sheeran",
  "genre": "Pop",
  "original_lyric": "I'm in love with the shape of you",
  "blanked_lyric": "I'm in love with ____ ____",
  "correct_answer": "the shape",
  "creator": 1,
  "creator_name": "john_doe",
  "created_at": "2025-11-26T12:00:00Z"
}
```

---

#### 5. Create Challenge
**POST** `/api/challenges/`

**Authentication Required**

**Request Body:**
```json
{
  "song_title": "Blinding Lights",
  "artist": "The Weeknd",
  "genre": "Pop",
  "original_lyric": "I've been trying to call",
  "blanked_lyric": "I've been ____ to call",
  "correct_answer": "trying"
}
```

**Response:** Returns created challenge object (201 Created)

---

#### 6. Create Challenge from Lyrics (Helper Endpoint)
**POST** `/api/challenges/create_from_lyrics/`

**Authentication Required**

Automatically creates a challenge from song lyrics.

**Request Body:**
```json
{
  "title": "Blinding Lights",
  "artist": "The Weeknd",
  "line_index": 3,
  "words_to_blank": 2,
  "genre": "Pop"
}
```

**Response:** Returns created challenge (201 Created)

---

#### 7. Submit Answer
**POST** `/api/challenges/{id}/submit_answer/`

Submit an answer to a challenge.

**Request Body:**
```json
{
  "answer": "the shape",
  "hints_used": 0
}
```

**Response:**
```json
{
  "is_correct": true,
  "correct_answer": null,
  "score": 100,
  "message": "Correct!"
}
```

If incorrect:
```json
{
  "is_correct": false,
  "correct_answer": "the shape",
  "score": 0,
  "message": "Incorrect. Try again!"
}
```

---

#### 8. Reveal Answer
**POST** `/api/challenges/{id}/reveal_answer/`

Show the correct answer for a challenge.

**Response:**
```json
{
  "correct_answer": "the shape",
  "original_lyric": "I'm in love with the shape of you"
}
```

---

#### 9. Get My Challenges
**GET** `/api/challenges/my_challenges/`

**Authentication Required**

Get all challenges created by the logged-in user.

**Response:** Array of challenge objects

---

#### 10. Delete Challenge
**DELETE** `/api/challenges/{id}/`

**Authentication Required**

Delete a challenge (only your own challenges).

**Response:** 204 No Content

---

### Leaderboard Endpoint

#### 11. Get Leaderboard
**GET** `/api/leaderboard/`

Get top 10 users by score.

**Response:**
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "username": "john_doe",
      "score": 1500,
      "challenges_completed": 25,
      "challenges_created": 10
    }
  ]
}
```

---

## Testing the API

### Using Django Admin Panel

1. Go to http://127.0.0.1:8000/admin
2. Login with your superuser credentials
3. You can create/view/edit:
   - Challenges
   - Challenge Attempts
   - User Profiles

### Using Browser (GET Requests)

Django REST Framework provides a browsable API:

```
http://127.0.0.1:8000/api/challenges/
http://127.0.0.1:8000/api/lyrics/search/?q=hello
http://127.0.0.1:8000/api/leaderboard/
```

### Using cURL (Command Line)

**Search Songs:**
```bash
curl "http://127.0.0.1:8000/api/lyrics/search/?q=hello"
```

**Fetch Lyrics:**
```bash
curl -X POST http://127.0.0.1:8000/api/lyrics/fetch/ \
  -H "Content-Type: application/json" \
  -d '{"title": "Hello", "artist": "Adele"}'
```

**Submit Answer:**
```bash
curl -X POST http://127.0.0.1:8000/api/challenges/1/submit_answer/ \
  -H "Content-Type: application/json" \
  -d '{"answer": "your answer here", "hints_used": 0}'
```

### Using Postman or Thunder Client (VS Code)

1. Install Thunder Client extension in VS Code
2. Create a new request
3. Set method (GET, POST, etc.)
4. Enter URL: `http://127.0.0.1:8000/api/...`
5. For POST requests, add JSON body in the "Body" tab

---

## Database Models

### Challenge Model

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key (auto) |
| creator | ForeignKey | User who created it |
| song_title | CharField | Song name |
| artist | CharField | Artist name |
| genre | CharField | Music genre |
| original_lyric | TextField | Complete lyric line |
| blanked_lyric | TextField | Lyric with blanks |
| correct_answer | CharField | The missing words |
| created_at | DateTime | Creation timestamp |
| updated_at | DateTime | Last update timestamp |

### ChallengeAttempt Model

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key (auto) |
| user | ForeignKey | User who attempted |
| challenge | ForeignKey | Challenge attempted |
| answer_submitted | CharField | User's answer |
| is_correct | Boolean | Whether correct |
| hints_used | Integer | Number of hints used |
| created_at | DateTime | Attempt timestamp |

### UserProfile Model

| Field | Type | Description |
|-------|------|-------------|
| id | Integer | Primary key (auto) |
| user | OneToOne | Django User |
| firebase_uid | CharField | Firebase user ID |
| display_name | CharField | Display name |
| total_score | Integer | Total points |
| challenges_created | Integer | Challenges made |
| challenges_completed | Integer | Challenges finished |
| created_at | DateTime | Account creation |

---

## Troubleshooting

### Virtual Environment Not Activating

**macOS/Linux:**
```bash
source venv/bin/activate
```

**Windows:**
```bash
venv\Scripts\activate
```

### "Command not found: python"

Use `python3` instead:
```bash
python3 manage.py runserver
```

### Port Already in Use

Kill the process or use a different port:
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9

# OR use different port
python manage.py runserver 8001
```

### Module Not Found Errors

Make sure virtual environment is activated and dependencies installed:
```bash
source venv/bin/activate
pip install -r requirements.txt
```

### Genius API Not Working

1. Check your API key in `.env`
2. Make sure there are no spaces around the `=` sign
3. Verify key at https://genius.com/api-clients

### Database Errors

Reset database (⚠️ deletes all data):
```bash
rm db.sqlite3
python manage.py migrate
python manage.py createsuperuser
```

---

## Development Tips

### Code Style

- Follow PEP 8 guidelines
- Use meaningful variable names
- Add docstrings to functions
- Comment complex logic

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Description of changes"

# Push to GitHub
git push origin feature/your-feature-name

# Create Pull Request on GitHub
```

### Testing

Always test your endpoints after making changes:
1. Start server
2. Test in browser/Postman
3. Check Django admin panel
4. Verify database updates

---

## Contact

For questions or issues, contact the backend team:
- **Backend Lead:** [Your Name]
- **GitHub Issues:** [Repository URL]/issues

---

## Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Genius API Docs](https://docs.genius.com/)
- [Python Decouple](https://pypi.org/project/python-decouple/)

FRONT END REQUIREMENTS

cd frontend

nano ~/.zshrc

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"       # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

(CTRL + O, press enter, CTRL + X to exit, enter)

cd ~
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash


source ~/.zshrc

command -v nvm

nvm install 22
nvm use 22
node -v

cd ~/Lyriq/LyrIQ/frontend
npm install
npm run dev





Loading the front end and back end do the backend first

cd backend
source venv/bin/activate
python3 manage.py runserver

cd frontend
npm run dev


leave both running