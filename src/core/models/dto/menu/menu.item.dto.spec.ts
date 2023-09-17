import { MenuItemDto } from './menu.item.dto';

describe('Item', () => {
  it('should be defined', () => {
    expect(new MenuItemDto()).toBeDefined();
  });
});
