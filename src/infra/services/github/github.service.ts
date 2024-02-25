import { Injectable } from '@nestjs/common';
import { Octokit } from '@octokit/core';
import { SysConfigService } from '../config/sys.config.service';

@Injectable()
export class GithubService {
  private octokit: Octokit;
  constructor(private readonly sysConfigService: SysConfigService) {
    this.octokit = new Octokit({
      auth: this.sysConfigService.thirdParty.githubToken,
    });
  }

  async getSysPrompt() {
    return await this.#getPromptContent('prompt.md');
  }

  async getFunctionCallings() {
    return await this.#getPromptContent('function.calling.json');
  }

  async #getPromptContent(fileName: string) {
    const response = await this.octokit.request(
      'GET /repos/{owner}/{repo}/contents/{path}',
      {
        owner: 'OrderGPT',
        repo: 'Prompts',
        path: fileName,
      },
    );
    return Buffer.from(response.data['content'], 'base64').toString('utf8');
  }
}
