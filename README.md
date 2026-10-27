# Final Project

## Project Overview
An AI-based web application that performs emotion detection using the **Watson NLP Library** and is deployed via **Flask**.

## Description
This application analyzes a given text input and returns the dominant emotions detected — including anger, disgust, fear, joy, and sadness — along with a dominant emotion label.

## Technologies Used
- Python 3
- Flask (Web Framework)
- IBM Watson NLP Library (`watson_nlp`)
- Requests (HTTP calls)
- PyLint (Static Code Analysis)

## Project Structure
```
python flask/
├── EmotionDetection/
│   ├── __init__.py
│   └── emotion_detection.py
├── static/
│   └── mywebscript.js
├── templates/
│   └── index.html
├── server.py
├── test_emotion_detection.py
└── README.md
```

## Setup & Usage

### Install Dependencies
```bash
pip install flask requests pylint
```

### Run the Flask Server
```bash
python server.py
```

### Run Unit Tests
```bash
python -m pytest test_emotion_detection.py -v
```

### Run Static Code Analysis
```bash
pylint server.py --disable=C0301
```

## Author
**Aryan**  
Final Project – Emotion Detector (IBM AI Application Development with Python)
