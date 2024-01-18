import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        // UserService,
        {
          provide: UserService,
          useValue: {},
        },
        // Mock ConfigService
        {
          provide: ConfigService,
          useValue: {}, // Replace this with an appropriate mock implementation
        },
        // Mock JwtService
        {
          provide: JwtService,
          useValue: {}, // Replace this with an appropriate mock implementation
        },
<<<<<<< HEAD
        {
          provide: 'UserRepository',
          useValue: {},
        },
=======
>>>>>>> a915b433089cdfdde58b53670da308cfe2b4a570
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
