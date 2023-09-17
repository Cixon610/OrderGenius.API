// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Param,
//   Post,
//   Put,
//   Query,
//   Res,
// } from '@nestjs/common';
// import { ApiResponse } from '@nestjs/swagger';
// import { MenuAddReqVo, MenuAddResVo } from 'src/core/models';
// import { CategoryService } from 'src/core/services';

// @Controller('category')
// export class CategoryController {
//   constructor(private readonly menuService: CategoryService) {}

//   @Post()
//   @ApiResponse({ status: 200, type: MenuAddResVo })
//   async Add(@Body() menuDto: MenuAddReqVo, @Res() res) {
//     const menu = await this.menuService.add(menuDto);
//     const vo = new MenuAddResVo({
//       id: menu.id,
//       businessId: menu.businessId,
//       name: menu.name,
//       description: menu.description,
//     });
//     res.json(vo);
//   }

//   @Put()
//   @ApiResponse({ status: 200, type: MenuUpdateReqVo })
//   async Update(@Body() menuDto: MenuUpdateReqVo, @Res() res) {
//     const menu = await this.menuService.update(menuDto);
//     const vo = new MenuAddResVo({
//       id: menu.id,
//       businessId: menu.businessId,
//       name: menu.name,
//       description: menu.description,
//     });
//     res.json(vo);
//   }

//   @Delete(':menuId')
//   @ApiResponse({ status: 200, type: MenuAddResVo })
//   async Delete(@Param('menuId') menuId: string, @Res() res) {
//     const sucess = await this.menuService.delete(menuId);
//     res.json(sucess);
//   }

//   @Get()
//   @ApiResponse({ status: 200, type: MenuAddResVo })
//   async Get(@Query('id') id: string, @Res() res) {
//     const menu = await this.menuService.get(id);
//     const vo = new MenuAddResVo({
//       id: menu.id,
//       businessId: menu.businessId,
//       name: menu.name,
//       description: menu.description,
//     });
//     res.json(vo);
//   }

//   @Get(':businessId')
//   @ApiResponse({ status: 200, type: [MenuAddResVo] })
//   async GetByBusiness(@Param('businessId') id: string, @Res() res) {
//     const menu = await this.menuService.getByBusinessId(id);
//     const vos = menu.map(
//       (x) =>
//         new MenuAddResVo({
//           id: x.id,
//           businessId: x.businessId,
//           name: x.name,
//           description: x.description,
//         }),
//     );
//     res.json(vos);
//   }
// }
