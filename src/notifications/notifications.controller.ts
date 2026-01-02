import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { User } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Notifications')
@ApiBearerAuth()
@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @ApiOperation({ summary: 'Update FCM token for push notifications' })
  @ApiResponse({
    status: 200,
    description: 'FCM token has been successfully updated.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
  @Post('fcm-token')
  async updateFcmToken(@Body() body: { token: string }, @GetUser() user: User) {
    return this.notificationsService.updateFcmToken(user.id, body.token);
  }

  @ApiOperation({ summary: 'Send a manual notification' })
  @ApiResponse({
    status: 200,
    description: 'Notification has been successfully sent.',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
      },
    },
  })
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
