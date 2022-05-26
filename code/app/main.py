from fastapi import FastAPI

app = FastAPI()

@app.get('/')
async def root():
    return {"detail": "Hello FastAPI World."}
