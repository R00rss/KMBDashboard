from google.cloud import speech_v1p1beta1 as speech
from os import path

client = speech.SpeechClient()
name = "audio2.wav"
path_name = path.join(path.dirname(path.realpath(__file__)), name)

with open(path_name, "rb") as audio_file:
    content = audio_file.read()

audio = speech.RecognitionAudio(content=content)

diarization_config = speech.SpeakerDiarizationConfig(
  enable_speaker_diarization=True,
  min_speaker_count=2,
  max_speaker_count=10,
)

config = speech.RecognitionConfig(
    encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
    sample_rate_hertz=8000,
    language_code="en-US",
    diarization_config=diarization_config,
)

print("Waiting for operation to complete...")
response = client.recognize(config=config, audio=audio)

# The transcript within each result is separate and sequential per result.
# However, the words list within an alternative includes all the words
# from all the results thus far. Thus, to get all the words with speaker
# tags, you only have to take the words list from the last result:
result = response.results[-1]

words_info = result.alternatives[0].words

# Printing out the output:
for word_info in words_info:
    print(
        u"word: '{}', speaker_tag: {}".format(word_info.word, word_info.speaker_tag)
    )