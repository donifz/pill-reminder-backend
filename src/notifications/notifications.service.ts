import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MedicationsService } from '../medications/medications.service';
import * as admin from 'firebase-admin';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    private medicationService: MedicationsService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    // Initialize Firebase Admin if not already initialized
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: 'reminder-a3e3b',
      });
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async checkAndSendNotifications() {
    try {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      // Get all medications that need notifications at current time
      const medications = await this.medicationService.findMedicationsByTime(currentTime);
      
      for (const medication of medications) {
        // Get user's FCM token
        const user = await this.usersRepository.findOne({
          where: { id: medication.user.id },
          select: ['id', 'fcmToken'],
        });
        
        if (user?.fcmToken) {
          await this.sendNotification(user.fcmToken, medication);
        }
      }
    } catch (error) {
      this.logger.error('Error in checkAndSendNotifications:', error);
    }
  }

  private async sendNotification(fcmToken: string, medication: any) {
    try {
      await admin.messaging().send({
        token: fcmToken,
        notification: {
          title: 'Medication Reminder',
          body: `Time to take ${medication.name}`,
        },
        data: {
          medicationId: medication.id,
          type: 'medication_reminder',
          name: medication.name,
          dose: medication.dose,
        },
        android: {
          priority: 'high',
          notification: {
            channelId: 'medication-reminders',
            priority: 'max',
            defaultSound: true,
            defaultVibrateTimings: true,
          },
        },
        apns: {
          payload: {
            aps: {
              sound: 'default',
              badge: 1,
            },
          },
        },
      });
    } catch (error) {
      this.logger.error(`Error sending notification to token ${fcmToken}:`, error);
    }
  }

  async updateFcmToken(userId: string, token: string) {
    try {
      await this.usersRepository.update(userId, { fcmToken: token });
      return { success: true };
    } catch (error) {
      this.logger.error('Error updating FCM token:', error);
      throw error;
    }
  }
} 