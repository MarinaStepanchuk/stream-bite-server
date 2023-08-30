import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Subscription } from './entities/subscription.entity';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class SubscriptionService {
  constructor(
    @InjectRepository(Subscription)
    private readonly subscriptionRepository: Repository<Subscription>,
    private userService: UserService,
  ) {}

  async create({ subscriber_id, author_id }) {
    const isSubscribe = await this.checkSubscription({
      subscriber_id,
      author_id,
    });

    if (isSubscribe) {
      throw new BadRequestException('Subscription already exists');
    }

    return await this.subscriptionRepository.save({
      subscriber_id,
      author_id,
    });
  }

  async remove({ subscriber_id, author_id }) {
    return await this.subscriptionRepository.delete({
      subscriber_id,
      author_id,
    });
  }

  async getSubscribers(author_id) {
    const [list, count] = await this.subscriptionRepository.findAndCount({
      where: { author_id },
    });

    const subscriptions = await Promise.all(
      list.map(async (subscription) => {
        const user = await this.userService.findUserById(
          subscription.subscriber_id,
        );
        if (user) {
          return {
            id: subscription.id,
            subscriber: user,
          };
        }
      }),
    );

    return {
      subscriptions,
      count,
    };
  }

  async checkSubscription({ subscriber_id, author_id }) {
    const subscription = await this.subscriptionRepository.findOne({
      where: {
        subscriber_id,
        author_id,
      },
    });

    return !!subscription;
  }

  async getFeeds(subscriber_id) {
    const [list, count] = await this.subscriptionRepository.findAndCount({
      where: { subscriber_id },
    });

    const subscriptions = await Promise.all(
      list.map(async (subscription) => {
        const user = await this.userService.findUserById(
          subscription.author_id,
        );
        if (user) {
          return {
            id: subscription.id,
            subscriber: user,
          };
        }
      }),
    );

    return {
      subscriptions,
      count,
    };
  }
}
