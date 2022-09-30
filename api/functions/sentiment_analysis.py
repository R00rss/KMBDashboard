import nltk
# from googletrans import Translator
from nltk.sentiment.vader import SentimentIntensityAnalyzer
import translators as ts

sid = SentimentIntensityAnalyzer()

def get_polarity_from_string(sentence):
    return sid.polarity_scores(ts.google(sentence , to_language = 'en'))
