import { Test, TestingModule } from "@nestjs/testing";
import { StoreService } from "../store.service";
import { Store } from "../../entity/store.entity";
import { UserService } from "../..//user/user.service";
import { ConfigService } from "@nestjs/config";

describe("StoreService", () => {
    let service: StoreService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [Store],
            providers: [
                StoreService,
                {
                    provide: UserService,
                    useValue: {},
                },
                // Mock ConfigService
                {
                    provide: ConfigService,
                    useValue: {}, // Replace this with an appropriate mock implementation
                },
                {
                    provide: "StoreRepository",
                    useValue: {},
                },
                {
                    provide: "UserRepository",
                    useValue: {
                        // UserRepository의 mock 메소드를 여기에 구현
                    },
                },
            ],
        }).compile();

        service = module.get<StoreService>(StoreService);
    });

    it("should be defined", () => {
        expect(service).toBeDefined();
    });
});
