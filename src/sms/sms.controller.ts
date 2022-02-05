import {
  Body,
  Controller,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  Post,
  Req,
  BadRequestException,
} from '@nestjs/common';
import SmsService from './sms.service';
import CheckVerificationCodeDto from './checkVerificationCode.dto';
import { JwtAuthGuard } from '../authentication/guard/jwt.guard';
import { RequestWithUser } from '../authentication/auth.dto';

@Controller('sms')
@UseInterceptors(ClassSerializerInterceptor)
export default class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('initiate-verification')
  @UseGuards(JwtAuthGuard)
  async initiatePhoneNumberVerification(@Req() request: RequestWithUser) {
    if (request.user.isPhoneNumberConfirmed) {
      throw new BadRequestException('Phone number already confirmed');
    }
    await this.smsService.initiatePhoneNumberVerification(request.user.phoneNumber);
  }

  @Post('check-verification-code')
  @UseGuards(JwtAuthGuard)
  async checkVerificationCode(@Req() request: RequestWithUser, @Body() verificationData: CheckVerificationCodeDto) {
    if (request.user.isPhoneNumberConfirmed) {
      throw new BadRequestException('Phone number already confirmed');
    }
    await this.smsService.confirmPhoneNumber(request.user.id, request.user.phoneNumber, verificationData.code);
  }
}
