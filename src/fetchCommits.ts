import { Octokit } from 'octokit';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function fetchCommits() {
  try {
    // Fetch user repositories (sorted by latest activity)
    const repos = await octokit.rest.repos.listForAuthenticatedUser({ per_page: 5, sort: 'updated' });

    if (!repos.data.length) {
      throw new Error('No repositories found.');
    }

    const latestRepo = repos.data[0].name;
    const owner = repos.data[0].owner.login;

    console.log(`Fetching commits from ${owner}/${latestRepo}`);

    // Fetch recent commits from the latest updated repo
    const commits = await octokit.rest.repos.listCommits({
      owner,
      repo: latestRepo,
      per_page: 5,
    });

    return commits.data.map(commit => commit.commit.message);
  } catch (error) {
    console.error('Error fetching commits:', error);
    return [];
  }
}
