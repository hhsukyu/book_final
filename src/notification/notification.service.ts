import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Notification } from 'src/entity/notification.entity';
import { UserService } from 'src/user/user.service';
import { Book } from 'src/entity/book.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,
    private readonly userService: UserService,
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  //알림 저장
  //유저아이디/책id/가게id => 프론트에서 유저명/책이름/가게이름
  async createNotification(bookid: number, storeid: number) {
    //해당bookid의 책제목찾기

    const Book = await this.bookRepository.findOne({
      where: { id: bookid },
    });

    const BookTitle = Book.title;
    console.log(BookTitle);

    //bookid책을 위시리스트로 가지고있는 user 추출
    const userIds = await this.userService.UsersByWishedBook(BookTitle);

    //해당유저의 배열
    console.log(userIds);

    // userIds 배열에서 각각의 userId를 순회하면서 데이터를 저장
    for (const userId of userIds) {
      // 각 userId와 관련된 storeid와 bookid를 사용하여 데이터를 생성
      const notificationData = {
        user: { id: userId },
        storeid: storeid, // 여기에 적절한 storeid 값을 지정해야 합니다.
        bookid: bookid, // 여기에 적절한 bookid 값을 지정해야 합니다.
      };
      // notificationRepository를 사용하여 데이터 저장
      await this.notificationRepository.save(notificationData);
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
