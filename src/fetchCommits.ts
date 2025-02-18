import { Octokit } from 'octokit';
import dotenv from 'dotenv';

dotenv.config();
interface CommitData {
  commit: {
    message: string;
    author: {
      date: string;
    };
  };
}
const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function fetchCommits() {
  try {
    const repos = await octokit.rest.repos.listForAuthenticatedUser({ per_page: 1, sort: 'updated' });

    if (!repos.data.length) {
      throw new Error('No repositories found.');
    }
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const commitsToday = [];

    // Process only the first (most recently updated) repository
    const repo = repos.data[0];
    const owner = repo.owner.login;
    const repoName = repo.name;

    console.log(`Fetching commits from ${owner}/${repoName}`);

    const commits = await octokit.rest.repos.listCommits({
      owner,
      repo: repoName,
      since: today.toISOString(), // Only fetch commits from today
      per_page: 5,
    });

    commitsToday.push(...commits.data.map((commit: CommitData) => ({
      message: commit.commit.message,
      date: commit.commit.author.date
    })));

    return commitsToday;
  } catch (error) {
    console.error('Error fetching commits:', error);
    return [];
  }
}
