import { ViewEntity, ViewColumn } from 'typeorm';

@ViewEntity({
  expression: `
    SELECT  
      m.business_id AS business_id,
      m.id AS menu_id,
      m.name AS menu_name,
      m.description AS menu_description,
      m.picture_url AS menu_picture_url,
      mc.id AS category_id,
      mc.name AS category_name,
      mc.description AS category_description,
      mc.picture_url AS category_picture_url
    FROM public.menu m
    LEFT JOIN public.menu_mapping mcm ON mcm.menu_id = m.id
    LEFT JOIN public.menu_category mc ON mcm.menu_category_id = mc.id
  `
})
export class ViewMenuCategory {
  @ViewColumn({name:'business_id'})
  businessId: string;

  @ViewColumn({name:'menu_id'})
  menuId: string;

  @ViewColumn({name:'menu_name'})
  menuName: string;

  @ViewColumn({name:'menu_description'})
  menuDescription: string;

  @ViewColumn({name:'menu_picture_url'})
  menuPictureUrl: string;

  @ViewColumn({name:'category_id'})
  categoryId: string;

  @ViewColumn({name:'category_name'})
  categoryName: string;

  @ViewColumn({name:'category_description'})
  categoryDescription: string;

  @ViewColumn({name:'category_picture_url'})
  categoryPictureUrl: string;
}