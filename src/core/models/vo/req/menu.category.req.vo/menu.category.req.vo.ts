export class MenuCategoryReqVo {
    constructor(init) {
        Object.assign(this, init);
    }

    id: string;
    businessId: string;
    name: string;
    description: string | null;
    pictureUrl: string | null;
    menuItemIds: string[];
}
