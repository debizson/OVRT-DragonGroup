from flask import Flask
from .db import db  # triggers MongoDB connection

app = Flask(__name__)

@app.get("/api/health")
def health():
    return {"status": "ok"}

if __name__ == "__main__":
    app.run(debug=True, port=8000)
