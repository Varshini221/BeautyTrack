# BeautyTrack

A web app for tracking beauty appointments and discovering new services, built with Flask and SQLite.

## Features

- Book and view beauty appointments
- Delete appointments you no longer need
- Discover page for browsing salons 

## Tech Stack

- **Backend:** Python, Flask
- **Database:** SQLite
- **Frontend:** HTML, CSS, JavaScript

## Getting Started

### Prerequisites

- Python 3.8+

### Installation

```bash
git clone https://github.com/Varshini221/BeautyTrack.git
cd BeautyTrack
pip install flask
python app.py
```

Then open http://127.0.0.1:5000 in your browser.

## Project Structure

```
BeautyTrack/
├── app.py          # Flask server and routes
├── database.db     # SQLite database
├── index.html      # Main appointments page
├── discover.html   # Discover page
├── script.js       # Appointments page logic
├── discover.js     # Discover page logic
└── styles.css      # Styling
```

## Future Improvements

- Google authentication
- Appointment reminders
- Saved Places
