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
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { User } from 'src/entity/user.entity';

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

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  //알림 저장
  //보유도서를 저장하면 자동으로 생성되므로 컨트롤러 없음
  //유저아이디/책id/가게id => 프론트에서 유저명/책이름/가게이름
  async createNotification(bookid: number, storeid: number) {
    //해당bookid의 책여부확인
    const book = await this.bookRepository.findOne({
      where: { id: bookid },
    });

    if (!book) {
      throw new NotFoundException('책을 찾을 수 없습니다.');
    }

    // const bookTitle = book.title; console.log('Noti 북타이틀', bookTitle);

    //bookid책을 위시리스트 & 관심지점으로 가지고있는 user 추출
    const userIds = await this.userService.UsersByWishedBook(bookid, storeid);

    if (!userIds || userIds.length === 0) {
      console.log(`${storeid}에 ${bookid}서적을 원하는 이용자가 없습니다.`);
    }

    //해당유저의 배열
    console.log('Noti 유저배열', userIds);

    // userIds 배열에서 각각의 userId를 순회하면서 데이터를 저장
    for (const userId of userIds) {
      // 각 userId와 관련된 storeid와 bookid를 사용하여 데이터를 생성
      const notificationData = {
        user: { id: userId },
        //sort: '입고알림',
        book_id: bookid,
        store_id: storeid,
        message: `'storeId${storeid}'에 'bookId${bookid}' 서적이 입고되었습니다`,
      };
      console.log(
        `'storeId${storeid}'에 'bookId${bookid}' 서적이 입고되었습니다`,
      );
      // notificationRepository를 사용하여 데이터 저장
      await this.notificationRepository.save(notificationData);
      // 생성된 알림을 클라이언트에게 보냅니다.
      //this.sseService.emitNotification(userId, notificationData.message);
    }
  }

  //전체공지생성
  async allNoti(userId: number, createNotificationDto: CreateNotificationDto) {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    console.log(user);
    const notification = this.notificationRepository.save({
      ...createNotificationDto,
      from: userId, //작성자
    });
    console.log('createNotificationDto', createNotificationDto);
    console.log(user);

    return notification;
  }

  // 지점별 알림 생성
  async storeNoti(
    fromUserId: number,
    storeId: number,
    createNotificationDto: CreateNotificationDto,
  ): Promise<Notification[]> {
    // 관심 지점으로 설정한 사용자들을 찾습니다.
    const userIds = await this.userService.findUsersByStoreInterest(storeId);

    // 알림을 생성하고 저장합니다.
    const notifications = userIds.map(async (userId) => {
      const notificationData = {
        ...createNotificationDto,
        user: { id: userId },
        from: fromUserId, // 메시지를 보내는 사용자
        store_id: storeId, // 관련 지점
      };
      return await this.notificationRepository.save(notificationData);
    });

    // 모든 알림 저장 작업을 기다립니다.
    return Promise.all(notifications);
  }

  //알림수정
  async updatePartial(
    notificationId: number,
    updateNotificationDto: UpdateNotificationDto,
  ) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });
    if (!notification) {
      throw new NotFoundException(
        `Notification with ID ${notificationId} not found`,
      );
    }
    console.log('Received updateNotificationDto:', updateNotificationDto);

    // 필요한 필드를 업데이트합니다.
    if (updateNotificationDto.sort !== undefined)
      notification.sort = updateNotificationDto.sort;
    if (updateNotificationDto.message !== undefined)
      notification.message = updateNotificationDto.message;

    await this.notificationRepository.save(notification);
    return notification;
  }

  // 알림 전체 조회
  async findAll() {
    return this.notificationRepository.find();
  }

  // 사용자별 알림 조회
  async findByUser(userId: number) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });
    return this.notificationRepository.find({
      relations: ['user'],
      where: { user: { id: userId } },
    });
  }

  // 스토어별 알림 조회
  async findByStore(storeId: number) {
    const storeNoti = this.notificationRepository.find({
      where: { store_id: storeId },
    });
    return storeNoti;
  }

  // 알림 삭제
  async delete(notificationId: number) {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId },
    });

    if (!notification) {
      throw new NotFoundException(
        `${notificationId}번 알림메세지는 존재하지 않습니다`,
      );
    }

    await this.notificationRepository.remove(notification);
    return { message: '알림메세지가 삭제되었습니다.' };
  }
}
