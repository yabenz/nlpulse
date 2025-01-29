# nltk.download('punkt_tab')
# import nltk.tokenize
import nltk
from nltk.tokenize import word_tokenize

import nltk
from nltk.sentiment import SentimentIntensityAnalyzer

# nltk.download('vader_lexicon')


sia = SentimentIntensityAnalyzer()

def classify_sentiment(compound_score):
    if compound_score >= 0.05:
        return "Positive"
    elif compound_score <= -0.05:
        return "Negative"
    else:
        return "Neutral"


from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

corpus_path = "./sources/"
with open(corpus_path+"test.txt", encoding="utf-8") as f:
    raw_text = f.read()

tokens = nltk.word_tokenize(raw_text, language= "english")


origins = [
    # "http://localhost",
    "http://127.0.0.1:8000/",
    "http://localhost:8080",
    "http://localhost:3000",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Hello World"}


@app.get("/tokenize")
async def root():
    # for token in tokens:
    #     print(token)
    return {"tokens": tokens}

#uvicorn main:app --reload

@app.get("/append/")
async def append_string(word: str):
    return {"result": word + " World"}


@app.get("/sentiment/")
async def append_string(text: str):

    # Get sentiment scores
    sentiment_scores = sia.polarity_scores(text)
    # Add sentiment compound literal score
    sentiment_scores['sentiment'] = classify_sentiment(sentiment_scores['compound'])

    return {"sentiment": sentiment_scores}