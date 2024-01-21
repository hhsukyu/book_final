import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: configService.get<string>('MAIL_USER'),
        pass: configService.get<string>('MAIL_PASS'),
      },
    });
  }

  async sendVerificationEmail(to: string, code: string) {
    const mailOptions = {
      to: to,
      from: this.configService.get<string>('MAIL_USER'),
      subject: '북서핑 BOOKSURFING 비밀번호 변경 인증메일',
      text: `인증번호: ${code}`,
      html: `
        <div style='
      margin: 0 auto 0 auto;
      padding: 3.5% 0 5% 0;
      text-align: center;
      border: 0.5px solid #ececec;
      height: 50%;
      width: 50%;
      '>

      
      <span style="
      font-size: 30pt;
      border: 0.5px solid #ececec;
      padding: 0.5% 2.5%;
      font-weight:bold;
      ">${code}</span>
      <br/>
      <h2>인증번호는 3분간 유효합니다.</h2><br/><br/><br/>
      <h4 style="
      color: gray;
      ">
      &copy; Copyright BOOKSURFING, 2024 All Rights Reserved.
      </h4>
      </div>
        `,
    };
    await this.transporter.sendMail(mailOptions);
  }
}
