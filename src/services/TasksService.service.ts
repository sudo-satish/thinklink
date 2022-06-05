import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Coin, CoinGeckoService } from './CoinGecko.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly coinService: CoinGeckoService,
    private readonly configService: ConfigService,
    private readonly mailerService: MailerService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    const price = await this.coinService.fetchCoin(Coin.bitcoin);
    this.checkForAlerts(price);
  }

  async checkForAlerts(priceModel) {
    const { price } = priceModel;

    const minPice = +this.configService.get<string>('MIN_PRICE');
    const maxPrice = +this.configService.get<string>('MAX_PRICE');
    if (price > maxPrice) {
      const text = `Price has increased by ${price}`;
      this.logger.debug(text);
      this.sendEmail({
        subject: 'Price Alert',
        text,
        html: `<h1>${text}</h1>`,
      });
    }

    if (price < minPice) {
      const text = `Price has decreased by ${price}`;
      this.logger.debug(text);
      this.sendEmail({
        subject: 'Price Alert',
        text,
        html: `<h1>${text}</h1>`,
      });
    }
  }

  sendEmail({ subject, text, html }) {
    const receiversEmail = this.configService.get('RECIEVERS_EMAIL');
    this.mailerService
      .sendMail({
        to: receiversEmail,
        from: 'noreply@nestjs.com',
        subject,
        text,
        html,
      })
      .then(console.log)
      .catch(console.error);
  }
}
