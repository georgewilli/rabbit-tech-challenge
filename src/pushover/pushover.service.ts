import * as PushOver from 'pushover-notifications';

export class PushoverService {
  private pushoverClient;

  constructor() {
    this.pushoverClient = new PushOver({
      user: process.env.PUSHOVER_USER_KEY, 
      token: process.env.PUSHOVER_API_TOKEN, 
    });
  }

  async sendNotification(message: string): Promise<void> {
    const msg = {
      message,
      title: 'New Order Created', 
      sound: 'pushover', 
      priority: 1, 
    };

    this.pushoverClient.send(msg, (err, res) => {
      if (err) {
        console.error('Pushover notification error:', err);
      } else {
        console.log('Notification sent successfully:', res);
      }
    });
  }
}
