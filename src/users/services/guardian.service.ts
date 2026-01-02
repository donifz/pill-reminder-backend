import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { Guardian } from '../entities/guardian.entity';
import { randomBytes } from 'crypto';

@Injectable()
export class GuardianService {
  private readonly logger = new Logger(GuardianService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Guardian)
    private guardianRepository: Repository<Guardian>,
  ) {}

  async inviteGuardian(
    userId: string,
    guardianEmail: string,
  ): Promise<Guardian> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const guardian = await this.userRepository.findOne({
      where: { email: guardianEmail },
    });
    if (!guardian) {
      throw new NotFoundException('Guardian user not found');
    }

    if (guardian.id === userId) {
      throw new BadRequestException('Cannot add yourself as a guardian');
    }

    // Check if guardian relationship already exists
    const existingGuardian = await this.guardianRepository.findOne({
      where: {
        user: { id: userId },
        guardian: { id: guardian.id },
      },
    });

    if (existingGuardian) {
      throw new BadRequestException('Guardian relationship already exists');
    }

    const invitationToken = randomBytes(32).toString('hex');
    const invitationExpiresAt = new Date();
    invitationExpiresAt.setHours(invitationExpiresAt.getHours() + 24); // Token expires in 24 hours

    const newGuardian = this.guardianRepository.create({
      user,
      guardian,
      invitationToken,
      invitationExpiresAt,
    });

    return this.guardianRepository.save(newGuardian);
  }

  async acceptInvitation(token: string, guardianId: string): Promise<Guardian> {
    this.logger.log(
      `Looking for guardian with token: ${token} and guardianId: ${guardianId}`,
    );

    // First, let's check if there's any guardian with this token
    const guardiansWithToken = await this.guardianRepository.find({
      where: {
        invitationToken: token,
      },
      relations: ['guardian', 'user'],
    });

    this.logger.log(
      `Found ${guardiansWithToken.length} guardians with this token`,
    );
    guardiansWithToken.forEach((g) => {
      this.logger.log(
        `Guardian found: id=${g.id}, guardianId=${g.guardian.id}, userId=${g.user.id}`,
      );
    });

    // Now try to find the specific guardian
    const guardian = await this.guardianRepository.findOne({
      where: {
        invitationToken: token,
        guardian: { id: guardianId },
      },
      relations: ['guardian', 'user'],
    });

    if (!guardian) {
      this.logger.error(
        `No guardian found with token: ${token} and guardianId: ${guardianId}`,
      );
      throw new NotFoundException('Invalid invitation token');
    }

    if (guardian.invitationExpiresAt < new Date()) {
      this.logger.error(`Invitation has expired for token: ${token}`);
      throw new BadRequestException('Invitation has expired');
    }

    guardian.isAccepted = true;
    guardian.invitationToken = null;
    guardian.invitationExpiresAt = null;

    this.logger.log(`Accepting invitation for guardian: ${guardian.id}`);
    return this.guardianRepository.save(guardian);
  }

  async getGuardians(userId: string): Promise<Guardian[]> {
    return this.guardianRepository.find({
      where: { user: { id: userId } },
      relations: ['guardian'],
    });
  }

  async getGuardianFor(userId: string): Promise<Guardian[]> {
    return this.guardianRepository.find({
      where: { guardian: { id: userId } },
      relations: ['user'],
    });
  }

  async removeGuardian(userId: string, guardianId: string): Promise<void> {
    const guardian = await this.guardianRepository.findOne({
      where: {
        user: { id: userId },
        guardian: { id: guardianId },
      },
    });

    if (!guardian) {
      throw new NotFoundException('Guardian relationship not found');
    }

    await this.guardianRepository.remove(guardian);
  }
}
