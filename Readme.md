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
   - Store your API keys in a `.env` file in the root of your project:
     ```env
     GITHUB_TOKEN=your_github_token
     TWITTER_API_KEY=your_twitter_api_key
     TWITTER_API_SECRET=your_twitter_api_secret
     TWITTER_ACCESS_TOKEN=your_twitter_access_token
     TWITTER_ACCESS_SECRET=your_twitter_access_secret
     OPENAI_API_KEY=your_openai_api_key
     ```

## Usage

1. **Run the Bot**:

   ```bash
   npx ts-node src/index.ts -r owner/repo
   ```

   - Replace `owner/repo` with the GitHub repository you want to monitor.

2. **Verify**:
   - Ensure the bot fetches commits, generates a shitpost, and posts a tweet.

## Configuration

- **GitHub Repository**: Specify the owner and repo using the `-r` option.
- **API Keys**: Store your API keys in the `.env` file.
- **Tweet Frequency**: Customize the frequency of tweets by setting up a cron job or scheduler.

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
