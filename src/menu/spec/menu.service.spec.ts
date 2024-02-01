import { Test, TestingModule } from "@nestjs/testing";
import { MenuService } from "../menu.service";
import { UserService } from "../../user/user.service";
import { ConfigService } from "@nestjs/config";

describe("MenuService", () => {
    let service: MenuService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                MenuService,
                UserService,
                ConfigService,
                { provide: "MenuRepository", useValue: {} },
                { provide: "StoreRepository", useValue: {} },
                { provide: "UserRepository", useValue: {} },
            ],
        }).compile();

        service = module.get<MenuService>(MenuService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
