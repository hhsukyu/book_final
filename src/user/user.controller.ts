import { Controller, Get, UseGuards } from "@nestjs/common";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserService } from "./user.service";
import { accessTokenGuard } from "../auth/guard/access-token.guard";
import { UserId } from "../auth/decorators/userId.decorator";

@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("")
    findAll() {
        return this.userService.findAll();
    }

    @ApiBearerAuth("accessToken")
    @UseGuards(accessTokenGuard)
    @Get("me")
    findUserById(@UserId() id: string) {
        return this.userService.findUserById(+id);
    }
}
