import { Injectable } from '@nestjs/common';
import { SysConfigService } from 'src/infra/services/config/sys.config.service';
import { ClientUserService } from '../../bu/client/client.user/client.user.service';
import { OrderService } from '../../bu/client/order/order.service';
import { MenuPromptService } from '../../bu/business/menu/menu.prompt/menu.prompt.service';
import { GithubService } from 'src/infra/services';

@Injectable()
export class PromptsService {
  constructor(
    private readonly sysConfigService: SysConfigService,
    private readonly clientUserService: ClientUserService,
    private readonly orderService: OrderService,
    private readonly menuPromptService: MenuPromptService,
    private readonly githubService: GithubService,
  ) {}

  async getSystemPrompt(
    userId: string,
    businessId: string,
    businessName: string,
  ): Promise<string> {
    const user = await this.clientUserService.get(userId);
    const orders = await this.orderService.getByUserId(userId, 20);
    //Get latest 10 ordered item names
    const orderHistory = Array.from(
      new Set(orders?.flatMap((x) => x.detail.map((y) => y.itemName))),
    )?.slice(0, 10);
    const prompt = await this.githubService.getSysPrompt();
    const systemPrompt = prompt.replace('${businessName}', businessName);
    const costumerPrompt = `
    # 客人資訊
    1. 客人姓名: ${user.userName}
    2. 客人電話: ${user.phone}
    3. 客人地址: ${user.address}
    4. 客人點餐歷史紀錄: ${orderHistory?.join(', ')}`;

    const menuPrompt = await this.menuPromptService.getActiveCategory(
      businessId,
      businessName,
    );
    return `${systemPrompt} ${costumerPrompt} ${menuPrompt}`;
  }
}
