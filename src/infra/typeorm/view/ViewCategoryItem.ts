import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT mc.business_id AS business_id,
      mc.id AS category_id,
      mc.name AS category_name,
      mc.description AS category_description,
      mc.picture_url AS category_pictureurl,
      mc.created_at AS category_created_at,
      mc.updated_at AS category_updated_at,
      mi.id AS item_id,
      mi.name AS item_name,
      mi.description AS item_description,
      mi.price AS item_price,
      mi.note AS item_note,
      mi.enable AS item_enable,
      mi.picture_url AS item_pictureurl,
      mi.created_at AS item_created_at,
      mi.updated_at AS item_updated_at
    FROM menu_category AS mc
    LEFT JOIN menu_category_mapping AS mcm ON mc.id = mcm.menu_category_id
    LEFT JOIN menu_item AS mi ON mi.id = mcm.menu_item_id;
  `,
})
export class ViewCategoryItem {
  @ViewColumn({ name: 'business_id' })
  businessId: string;

  @ViewColumn({ name: 'category_id' })
  categoryId: string;

  @ViewColumn({ name: 'category_name' })
  categoryName: string;

  @ViewColumn({ name: 'category_description' })
  categoryDescription: string;

  @ViewColumn({ name: 'category_pictureurl' })
  categoryPictureUrl: string;

  @ViewColumn({ name: 'category_created_at' })
  categoryCreatedAt: string;

  @ViewColumn({ name: 'category_updated_at' })
  categoryUpdatedAt: string;

  @ViewColumn({ name: 'item_id' })
  itemId: string;

  @ViewColumn({ name: 'item_name' })
  itemName: string;

  @ViewColumn({ name: 'item_description' })
  itemDescription: string;

  @ViewColumn({ name: 'item_price' })
  itemPrice: number;

  @ViewColumn({ name: 'item_note' })
  itemNote: string;

  @ViewColumn({ name: 'item_enable' })
  itemEnable: boolean;

  @ViewColumn({ name: 'item_pictureurl' })
  itemPictureUrl: string;

  @ViewColumn({ name: 'item_created_at' })
  itemCreatedAt: Date | null;

  @ViewColumn({ name: 'item_updated_at' })
  itemUpdatedAt: Date | null;
}
