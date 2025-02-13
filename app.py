from flask import Flask, render_template, jsonify
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from jinja2 import Environment, FileSystemLoader
from chainlit.utils import mount_chainlit
import time

app = FastAPI()

templates = Environment(loader=FileSystemLoader("templates"))

app.mount("/static", StaticFiles(directory="static"), name="static")

# Cache Busting
CACHE_BUST = str(int(time.time()))

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    template = templates.get_template("index.html")
    return HTMLResponse(template.render(request=request, cache_bust=CACHE_BUST))

mount_chainlit(app=app, target="chainlit_app.py", path="/chainlit")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000, reload=True)
