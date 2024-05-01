import { Injectable } from '@nestjs/common';
// import { Octokit } from '@octokit/core';
import { SysConfigService } from '../config/sys.config.service';
import axios from 'axios';
import * as fs from 'node:fs/promises';

@Injectable()
export class GithubService {
  // private octokit: Octokit;
  constructor(private readonly sysConfigService: SysConfigService) {
    // this.octokit = new Octokit({
    //   auth: this.sysConfigService.thirdParty.githubToken,
    // });
  }

  async getSysPrompt() {
    return await this.#getPromptContent(
      'prompt.md',
      this.sysConfigService.thirdParty.githubBranchName,
    );
  }

  async getFunctionCallings() {
    return await this.#getPromptContent(
      'function.calling.json',
      this.sysConfigService.thirdParty.githubBranchName,
    );
  }

  //get content from github with axios
  async #getPromptContent(fileName: string, branch: string) {
    try {
      if (this.sysConfigService.common.environment === 'local') {
        return await fs.readFile(
          `${this.sysConfigService.common.localPromptPath}/${fileName}`,
          'utf8',
        );
      }

      const response = await axios.get(
        `https://api.github.com/repos/OrderGPT/Prompts/contents/${fileName}?ref=${branch}`,
        {
          headers: {
            Authorization: `Bearer ${this.sysConfigService.thirdParty.githubToken}`,
          },
        },
      );

      return Buffer.from(response.data['content'], 'base64').toString('utf8');
    } catch (error) {
      console.error(error);
    }
  }

  // get content from github with Octokit
  // async #getPromptContent(fileName: string) {
  //   const response = await this.octokit.request(
  //     'GET /repos/{owner}/{repo}/contents/{path}',
  //     {
  //       owner: 'OrderGPT',
  //       repo: 'Prompts',
  //       path: fileName,
  //     },
  //   );
  //   return Buffer.from(response.data['content'], 'base64').toString('utf8');
  // }
}
