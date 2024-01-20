import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT  
    mi.business_id AS business_id,
    mi.id AS menu_item_id,
    mi.name AS menu_item_name,
    mi.description AS menu_item_description,
    mi.price AS menu_item_price,
    mi.note AS menu_item_notes,
    mi.enable AS menu_item_enable,
    mi.promoted AS menu_item_promoted,
    mi.picture_url AS menu_item_picture_url,
    mi.created_at AS menu_item_created_at,
    mi.updated_at AS menu_item_updated_at,
    mf.id AS modification_id,
    mf.name AS modification_name,
    mf.options AS modification_options,
    mf.max_choices AS modification_max_choices,
    mf.created_at AS modification_created_at,
    mf.updated_at AS modification_updated_at
    FROM public.menu_item mi
    LEFT JOIN public.menu_item_mapping mim ON mim.menu_item_id = mi.id
    LEFT JOIN public.modification mf ON mim.modification_id = mf.id
  `,
})
export class ViewItemModification {
  @ViewColumn({ name: 'business_id' })
  businessId: string;

  @ViewColumn({ name: 'menu_item_id' })
  menuItemId: string;

  @ViewColumn({ name: 'menu_item_name' })
  menuItemName: string;

  @ViewColumn({ name: 'menu_item_description' })
  menuItemDescription: string;

  @ViewColumn({ name: 'menu_item_price' })
  menuItemPrice: string;

  @ViewColumn({ name: 'menu_item_notes' })
  menuItemNotes: string;

  @ViewColumn({ name: 'menu_item_enable' })
  menuItemEnable: string;

  @ViewColumn({ name: 'menu_item_promoted' })
  menuItemPromoted: string;

  @ViewColumn({ name: 'menu_item_picture_url' })
  menuItemPictureUrl: string;

  @ViewColumn({ name: 'menu_item_created_at' })
  menuItemCreatedAt: Date | null;

  @ViewColumn({ name: 'menu_item_updated_at' })
  menuItemUpdatedAt: Date | null;

  @ViewColumn({ name: 'modification_id' })
  modificationId: string;

  @ViewColumn({ name: 'modification_name' })
  modificationName: string;

  @ViewColumn({ name: 'modification_options' })
  modificationOptions: Map<string, number>;

  @ViewColumn({ name: 'modification_max_choices' })
  modificationMaxChoices: number;

  @ViewColumn({ name: 'modification_created_at' })
  modificationCreatedAt: Date | null;

  @ViewColumn({ name: 'modification_updated_at' })
  modificationUpdatedAt: Date | null;
}
