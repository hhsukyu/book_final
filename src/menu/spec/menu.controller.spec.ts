import { Test, TestingModule } from "@nestjs/testing";
import { MenuController } from "../menu.controller";
import { MenuService } from "../menu.service";
import { UserService } from "../../user/user.service";
import { ConfigService } from "@nestjs/config";

describe("MenuController", () => {
    let controller: MenuController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [MenuController],
            providers: [
                MenuService,
                UserService,
                ConfigService,
                { provide: "MenuRepository", useValue: {} },
                { provide: "StoreRepository", useValue: {} },
                { provide: "UserRepository", useValue: {} },
            ],
        }).compile();

        controller = module.get<MenuController>(MenuController);
    });

    it("should be defined", () => {
        expect(controller).toBeDefined();
    });
});
