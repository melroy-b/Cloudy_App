# 🌥️ Cloudy App

Cloudy App is a Node.js + Express application that retrieves real-time weather data using the OpenWeather API. 
Dynamic search is possible for all the places around the world

---

## 🚀 Features

- Fetch real-time weather data from OpenWeather API
- Secure API key management using `.env`
- API usage tracking (1000 request limit)
- Docker support for containerized deployment
- Lightweight Express server

---

## 🛠 Tech Stack

- Node.js
- Express.js
- EJS
- OpenWeather API
- Docker

---

## 📂 Project Structure
```bash
Cloudy_App/
│
├── server.js
├── package.json
├── components/api-call-limit.json # Tracks API usage (limit: 1000)
├── .env # Stores OpenWeather API key (not committed)
└── README.md
```
---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

⚠️ Do not commit your `.env` file to version control.

---

## 📊 API Call Limit Handling

The application uses `api-call-limit.json` to:

- Track number of API requests made
- Prevent exceeding the 1000 request free-tier limit
- Block further calls once the limit is reached

You may reset this file manually for testing purposes.

---

## ✅ Prerequisites

Ensure the following are installed:

- Node.js (latest recommended)
- npm
- Docker (for publishing)

Check versions:

```bash
node -v
npm -v
docker -v
```
---

## 📥 Installation

Clone the repository:

```bash
git clone https://github.com/melroy-b/Cloudy_App.git
cd Cloudy_App
```
Install dependencies:

```bash
npm install
```
--- 

## ▶️ Running the Application

If you have nodemon installed globally:
```bash
nodemon server.js
```
Otherwise:
```bash
node server.js
```
The server will start on the configured port. ex. hhtp://localhost:3000

--- 

## 🐳 Docker

Build the image:
```bash
docker build -t cloudy-app .
```
Run the container:
```bash
docker run -p 3000:3000 --env-file .env cloudy-app
```
---

## 🌍 Live Demo 

https://cloudy-app-y7nf.onrender.com

