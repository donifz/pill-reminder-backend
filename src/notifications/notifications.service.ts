import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { MedicationsService } from '../medications/medications.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import axios from 'axios';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly EXPO_PUSH_API = 'https://exp.host/--/api/v2/push/send';

  constructor(
    private medicationService: MedicationsService,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  @Cron(CronExpression.EVERY_MINUTE)
  async checkAndSendNotifications() {
    const now = new Date();
    const utcHours = now.getUTCHours().toString().padStart(2, '0');
    const utcMinutes = now.getUTCMinutes().toString().padStart(2, '0');
    const currentTime = `${utcHours}:${utcMinutes}`;
    
    try {
      this.logger.log(`[${currentTime} UTC] Starting notification check...`);
      
      // Get all medications that need notifications at current time
      const medications = await this.medicationService.findMedicationsByTime(currentTime);
      
      this.logger.log(`[${currentTime} UTC] Found ${medications.length} medications to notify`);
      
      // Log each medication's details
      medications.forEach((medication) => {
        this.logger.log(
          `[${currentTime} UTC] Medication: ${medication.name}, Times: ${medication.times.join(', ')}, User: ${medication.user.id}`,
        );
      });
      
      for (const medication of medications) {
        // Get user's Expo push token
        const user = await this.usersRepository.findOne({
          where: { id: medication.user.id },
          select: ['id', 'fcmToken'],
        });
        
        if (user?.fcmToken) {
          this.logger.log(
            `[${currentTime} UTC] Sending notification for medication ${medication.id} to user ${user.id}`,
          );
          await this.sendNotification(user.fcmToken, medication);
        } else {
          this.logger.warn(
            `[${currentTime} UTC] No push token found for user ${medication.user.id}`,
          );
        }
      }
      
      this.logger.log(`[${currentTime} UTC] Notification check completed`);
    } catch (error) {
      this.logger.error(`[${currentTime} UTC] Error in checkAndSendNotifications:`, error);
    }
  }

  private async sendNotification(expoPushToken: string, medication: any) {
    try {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title: 'Medication Reminder',
        body: `Time to take ${medication.name}`,
        data: {
          medicationId: medication.id,
          type: 'medication_reminder',
          name: medication.name,
          dose: medication.dose,
        },
        priority: 'high',
      };

      this.logger.log(`[${new Date().toISOString()}] Sending Expo push message:`, message);
      
      const response = await axios.post(this.EXPO_PUSH_API, message);
      
      this.logger.log(
        `[${new Date().toISOString()}] Successfully sent message:`,
        response.data,
      );
    } catch (error) {
      this.logger.error(
        `[${new Date().toISOString()}] Error sending notification to token ${expoPushToken}:`,
        error,
      );
    }
  }

  async updateFcmToken(userId: string, token: string) {
    try {
      this.logger.log(`[${new Date().toISOString()}] Updating push token for user ${userId}`);
      await this.usersRepository.update(userId, { fcmToken: token });
      return { success: true };
    } catch (error) {
      this.logger.error(`[${new Date().toISOString()}] Error updating push token:`, error);
      throw error;
    }
  }
}