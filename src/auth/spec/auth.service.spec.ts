import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { UserService } from '../../user/user.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from '../../configs/redis/redis.service';
import { EmailService } from '../../configs/mailer/email.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        // UserService,
        RedisService,
        {
          provide: EmailService,
          useValue: {},
        },
        {
          provide: UserService,
          useValue: {},
        },
        // Mock ConfigService
        {
          provide: ConfigService,
          useValue: {}, // Replace this with an appropriate mock implementation
        },
        // Mock ConfigService
        {
          provide: 'UserRepository',
          useValue: {}, // Replace this with an appropriate mock implementation
        },
        // Mock JwtService
        {
          provide: JwtService,
          useValue: {}, // Replace this with an appropriate mock implementation
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
