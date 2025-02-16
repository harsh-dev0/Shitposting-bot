import { Command } from 'commander';
import { runBot } from './runbot';

const program = new Command();

program
  .version('1.0.0')
  .description('A bot to turn GitHub commits into shitposts and tweet them.')
  .requiredOption('-r, --repo <repo>', 'GitHub repository (e.g., owner/repo)')
  .parse(process.argv);

const { repo } = program.opts();
const [owner, repoName] = repo.split('/');

runBot(owner, repoName);
