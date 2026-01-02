import {
  Controller,
  Post,
  Get,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Logger,
} from '@nestjs/common';
import { GuardianService } from '../services/guardian.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { Request } from 'express';

@Controller('guardians')
@UseGuards(JwtAuthGuard)
export class GuardianController {
  private readonly logger = new Logger(GuardianController.name);

  constructor(private readonly guardianService: GuardianService) {}

  @Post('invite')
  async inviteGuardian(@Req() req: Request, @Body('email') email: string) {
    return this.guardianService.inviteGuardian(req.user['id'], email);
  }

  @Post('accept/:token')
  async acceptInvitation(@Req() req: Request, @Param('token') token: string) {
    this.logger.log(`Accepting invitation with token: ${token}`);
    this.logger.log(`User ID: ${req.user['id']}`);
    return this.guardianService.acceptInvitation(token, req.user['id']);
  }

  @Get()
  async getGuardians(@Req() req: Request) {
    return this.guardianService.getGuardians(req.user['id']);
  }

  @Get('for')
  async getGuardianFor(@Req() req: Request) {
    return this.guardianService.getGuardianFor(req.user['id']);
  }

  @Delete(':guardianId')
  async removeGuardian(
    @Req() req: Request,
    @Param('guardianId') guardianId: string,
  ) {
    return this.guardianService.removeGuardian(req.user['id'], guardianId);
  }
}
