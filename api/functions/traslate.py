from googletrans import Translator
from googletrans import Translator
import translators as ts

def traslate(text):
  translator = Translator(service_urls=['translate.googleapis.com'])
  resp = translator.translate("Der Himmel ist blau und ich mag Bananen", dest='en')
  return resp;

def traslate2(text):
  return ts.google('ejemplo de traduccion' , to_language = 'en')