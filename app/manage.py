from fastapi import FastAPI, Depends
from schemas.schema import TextInput, TextResponse
from fastapi.middleware.cors import CORSMiddleware
from genai.main import GenAI
app = FastAPI()
genai = GenAI()


origins = [
    "http://localhost:3000", # Адрес твоего фронтенда
    "http://127.0.0.1:3000",
    "http://192.168.147.130:3000",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Разрешенные источники
    allow_credentials=True, # Разрешить куки (если нужно)
    allow_methods=["*"],    # Разрешить все методы (включая POST, OPTIONS)
    allow_headers=["*"],    # Разрешить все заголовки (включая Content-Type)
)


@app.post("/text/", response_model=TextResponse)
async def create_text(text_input: TextInput):
    response_data = genai.gen_text(text_input.text)
    return response_data
