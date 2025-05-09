import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post('fcm-token')
  async updateFcmToken(@Body() body: { token: string }, @GetUser() user: User) {
    return this.notificationsService.updateFcmToken(user.id, body.token);
  }

  @Post('send')
  async sendNotification(
    @Body()
    body: {
      title: string;
      body: string;
      data?: Record<string, any>;
      userId?: string;
    },
    @GetUser() user: User,
  ) {
    return this.notificationsService.sendManualNotification(
      body.userId || user.id,
      body.title,
      body.body,
      body.data,
    );
  }
} 