import { ViewEntity, DataSource, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: (dataSource: DataSource) =>
    dataSource
      .createQueryBuilder()
      .select('mc.business_id', 'business_id')
      .addSelect('mc.id', 'category_id')
      .addSelect('mc.name', 'category_name')
      .addSelect('mc.description', 'category_description')
      .addSelect('mc.picture_url', 'category_pictureurl')
      .addSelect('mi.id', 'item_id')
      .addSelect('mi.name', 'item_name')
      .addSelect('mi.description', 'item_description')
      .addSelect('mi.price', 'item_price')
      .addSelect('mi.modification', 'item_modification')
      .addSelect('mi.note', 'item_note')
      .addSelect('mi.enable', 'item_enable')
      .addSelect('mi.picture_url', 'item_pictureurl')
      .from('menu_category', 'mc')
      .leftJoin('menu_category_mapping', 'mcm', 'mc.id = mcm.menu_category_id')
      .leftJoin('menu_item', 'mi', 'mi.id = mcm.menu_item_id'),
})
export class ViewCategoryItem {
  @ViewColumn({name:'business_id'})
  businessId: string;

  @ViewColumn({name:'category_id'})
  categoryId: string;

  @ViewColumn({name:'category_name'})
  categoryName: string;

  @ViewColumn({name:'category_description'})
  categoryDescription: string;

  @ViewColumn({name:'category_pictureurl'})
  categoryPictureUrl: string;

  @ViewColumn({name:'item_id'})
  itemId: string;

  @ViewColumn({name:'item_name'})
  itemName: string;

  @ViewColumn({name:'item_description'})
  itemDescription: string;

  @ViewColumn({name:'item_price'})
  itemPrice: number;

  @ViewColumn({name:'item_modification'})
  itemModification: string;

  @ViewColumn({name:'item_note'})
  itemNote: string;
  
  @ViewColumn({name:'item_enable'})
  itemEnable: boolean;

  @ViewColumn({name:'item_pictureurl'})
  itemPictureUrl: string;
}
