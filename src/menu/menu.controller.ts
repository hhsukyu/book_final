import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from "@nestjs/common";
import { MenuService } from "./menu.service";
import { ApiBearerAuth } from "@nestjs/swagger";
import { accessTokenGuard } from "..//auth/guard/access-token.guard";
import { UserId } from "../auth/decorators/userId.decorator";
import { CreateMenuDto } from "./dto/create-menu.dto";
import { UpdateMenuDto } from "./dto/update-menu.dto";

@Controller("menu")
export class MenuController {
    constructor(private readonly menuService: MenuService) {}

    //지점 메뉴 조회
    @Get("/storeid/:storeid/")
    async menulist(@Param("storeid") storeid: number) {
        return await this.menuService.menulist(storeid);
    }

    //메뉴 등록
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Post("/storeid/:storeid")
    async findMyStoreMenu(
        @Param("storeid") storeid: number,
        @UserId() userid: number,
        @Body() createMenuDto: CreateMenuDto,
    ) {
        return await this.menuService.findMyStoreMenu(
            storeid,
            userid,
            createMenuDto,
        );
    }

    //메뉴 수정.
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Put("/storeid/:storeid/:menuid")
    async updateStoreMenu(
        @Param("storeid") storeid: number,
        @Param("menuid") menuid: number,
        @Body() updateMenuDto: UpdateMenuDto,
    ) {
        return await this.menuService.updateStoreMenu(
            storeid,
            menuid,
            updateMenuDto,
        );
    }

    //메뉴 삭제
    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Delete("/storeid/:storeid/:menuid")
    async deleteStoreMenu(
        @Param("storeid") storeid: number,
        @Param("menuid") menuid: number,
    ) {
        return await this.menuService.deleteStoreMenu(storeid, menuid);
    }
}
