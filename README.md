# HNG14 Backend Stage 0 Task

API intergration & Data Processing Assessment using [Genderize.io](https://genderize.io/) API.

## Features

- GET `/api/classify?name=John`
- Proper input validation
- Clean processed response with confidence score
- Good error handling
- CORS enabled

## Tech Stack

- Node.js + Express

## API Endpoint

**GET** `/api/classify`

**Query Parameter:**

- `name` (required) - The name to classify
