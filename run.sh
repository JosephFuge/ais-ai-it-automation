#!/bin/bash

set -e

# Function to cleanup on script exit
function cleanup {
    echo "Shutting down services..."
    # Stop the Redis container
    docker stop $(docker ps -q --filter ancestor=redis) 2>/dev/null || true
    # Kill the background processes
    kill $(jobs -p) 2>/dev/null || true
    exit 0
}

# Function to start all services
function startservices {
    # Set up trap for cleanup on script exit
    trap cleanup SIGINT SIGTERM

    # Start Redis container
    echo "Starting Redis container..."
    docker run -d -p 6379:6379 redis

    # Start FastAPI backend
    echo "Starting FastAPI backend..."
    uvicorn app:app --reload &
    FLASK_PID=$!

    # Start React frontend
    echo "Starting React frontend..."
    cd frontend
    npm run start &
    REACT_PID=$!

    # Wait for all background processes
    wait
}
