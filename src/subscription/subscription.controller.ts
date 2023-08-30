import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('subscription')
@UseGuards(JwtAuthGuard)
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post()
  subscribe(@Body() body, @Req() req) {
    const { authorId: author_id } = body;
    return this.subscriptionService.create({
      author_id: +author_id,
      subscriber_id: +req.user.id,
    });
  }

  @Get()
  checkSubscription(@Query() query) {
    const { subscriberId: subscriber_id, authorId: author_id } = query;
    return this.subscriptionService.checkSubscription({
      subscriber_id,
      author_id,
    });
  }

  @Get(':userId')
  getSubscribers(@Param('userId') userId: string) {
    return this.subscriptionService.getSubscribers(+userId);
  }

  @Get('feeds/:userId')
  getFeeds(@Param('userId') userId: string) {
    return this.subscriptionService.getFeeds(+userId);
  }

  @Delete(':author_id')
  unsubscribe(@Param('author_id') author_id: string, @Req() req) {
    return this.subscriptionService.remove({
      subscriber_id: +req.user.id,
      author_id: author_id,
    });
  }
}
