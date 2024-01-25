import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entity/notification.entity';
import { UserService } from 'src/user/user.service';
import { Book } from 'src/entity/book.entity';
import { StoreService } from 'src/store/store.service';
import { SseService } from 'src/sse/sse.service';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
    private readonly storeService: StoreService,
    private readonly sseService: SseService,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  //알림 저장
  //유저아이디/책id/가게id => 프론트에서 유저명/책이름/가게이름
  async createNotification(bookid: number, storeid: number) {
    //해당bookid의 책제목찾기

    const book = await this.bookRepository.findOne({
      where: { id: bookid },
    });

    if (!book) {
      throw new NotFoundException('책을 찾을 수 없습니다.');
    }
    const bookTitle = book.title;
    console.log('Noti 북타이틀', bookTitle);

    //bookid책을 위시리스트로 가지고있는 user 추출
    const userIds = await this.userService.UsersByWishedBook(bookTitle);

    if (!userIds || userIds.length === 0) {
      console.log('위시리스트에 해당 책을 원하는 유저가 없습니다.');
      return;
    }

    //해당유저의 배열
    console.log('Noti 유저배열', userIds);

    //지점이름가져오기
    const storeName = await this.storeService.StoreNameById(storeid);

    if (!storeName) {
      throw new NotFoundException('가게를 찾을 수 없습니다.');
    }

    console.log(storeName);
    // userIds 배열에서 각각의 userId를 순회하면서 데이터를 저장
    for (const userId of userIds) {
      // 각 userId와 관련된 storeid와 bookid를 사용하여 데이터를 생성
      const notificationData = {
        user: { id: userId },
        message: `${storeName}에 ${bookTitle} 서적이 입고되었습니다`,
      };
      // notificationRepository를 사용하여 데이터 저장
      await this.notificationRepository.save(notificationData);
      // 생성된 알림을 클라이언트에게 보냅니다.
      this.sseService.emitNotification(userId, notificationData.message);
    }
  }

  //알림 조회
  async readNotification(userId: number) {
    const notifications = await this.notificationRepository
      .createQueryBuilder('notification')
      .leftJoinAndSelect('notification.user', 'user')
      .where('notification.userId = :userId', { userId })
      .select([
        'notification.id',
        'notification.message',
        'notification.createdAt',
      ])
      .orderBy({ 'notification.createdAt': 'DESC' })
      .getMany();

    if (!notifications) {
      throw new NotFoundException('알림이 존재하지 않습니다.');
    }
    return notifications;
  }

  async deleteNotification(id: number, userId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: {
        user: true,
      },
    });

    if (notification.user.id !== userId) {
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    }

    if (!notification) {
      throw new NotFoundException('알림이 존재하지 않습니다.');
    }
    await this.notificationRepository.delete({ id });
    return {
      message: '알람 삭제',
    };
  }
}
