import { Octokit } from 'octokit';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

export async function fetchCommits(owner: string, repo: string) {
  const commits = await octokit.rest.repos.listCommits({
    owner,
    repo,
    per_page: 5,
  });
  return commits.data.map(commit => commit.commit.message);
}
