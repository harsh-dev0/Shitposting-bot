# Shitposting Bot

A bot to turn GitHub commits into humorous shitposts and tweet them.

## Table of Contents

- [Setup](#setup)
- [Usage](#usage)
- [Configuration](#configuration)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)
- [License](#license)

## Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/harsh-dev0/twitter-bot.git
   cd twitter-bot
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Create a `.env` File**:
   - Copy the `.env.example` file and fill in your credentials.
   - Update `.env` with your API keys and tokens.

## Usage

1. **Run the Bot**:

   ```bash
   npm start
   ```

2. **Verify**:
   - Ensure the bot fetches commits, generates a shitpost, and posts a tweet.

## Configuration

- **API Keys**: Store your API keys in the `.env` file.
- **Tweet Frequency**: Customize the frequency of tweets using GitHub Actions (`.github/workflows/tweet.yml`).
- **Setup and Leave**: Once you push your changes to GitHub and add your environment secrets to GitHub Actions, the bot will be set up to operate. Make sure to check the GitHub workflow to ensure it’s working correctly.

## Environment Variables

The following environment variables are required and used in `.yml`:

```env
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
GROQ_API_KEY=your_groq_api_key
GTOKEN=your_google_token
MONGODB_URI=your_mongodb_connection_string
```

**Note:** This bot uses the **Groq API** for AI-powered tweet generation. Make sure to obtain an API key from Groq and update the `GROQ_API_KEY` variable accordingly.

## Contributing

1. **Fork the Repository**:

   - Fork the project to your own GitHub account.

2. **Create a Branch**:

   ```bash
   git checkout -b feature/your-feature
   ```

3. **Commit Your Changes**:

   ```bash
   git commit -m 'Add some feature'
   ```

4. **Push to the Branch**:

   ```bash
   git push origin feature/your-feature
   ```

5. **Open a Pull Request**:
   - Open a pull request against the `main` branch of the original repository.

---

## `.env.example`

Create a `.env` file based on the following template:

```env
TWITTER_CLIENT_ID=
TWITTER_CLIENT_SECRET=
GROQ_API_KEY=
GTOKEN=
MONGODB_URI=
```
