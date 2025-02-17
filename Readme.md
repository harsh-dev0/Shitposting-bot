# Twitter Bot

A bot to turn GitHub commits into humorous shitposts and tweet them.

## Table of Contents

- [Setup](#setup)
- [Usage](#usage)
- [Configuration](#configuration)
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
- **Setup and leave**: When you clone this repository and push changes on your github and add env secrets to Github Actions, the bot will be set up to operate. Make sure to check Github workflow to see if it is working or no.

## Environment Variables

The following environment variables are required and used in `.yml`:

```env
TWITTER_CLIENT_ID=your_twitter_client_id
TWITTER_CLIENT_SECRET=your_twitter_client_secret
OPENAI_API_KEY=your_openai_api_key
GTOKEN=your_google_token
MONGODB_URI=your_mongodb_connection_string
```

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
OPENAI_API_KEY=
GTOKEN=
MONGODB_URI=
```
