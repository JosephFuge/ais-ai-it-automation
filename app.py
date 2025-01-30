from flask import Flask, render_template, jsonify
import csv
import os

app = Flask(__name__)

# deployment_name = os.getenv("AZURE_OPENAI_MODEL_NAME")
# azure_api_key = os.getenv("AZURE_OPENAPI_KEY")
# openai_client = AzureOpenAI(api_key=azure_api_key, azure_endpoint=os.getenv("AZURE_OPENAI_ENDPOINT"), api_version="2024-10-21")

@app.route('/')
def home():
    return render_template('index.html')


if __name__ == '__main__':
    app.run(debug=True)