import { Oak, oakRouter } from '../../../deps.ts';

export class Home {
  @oakRouter({
    method: 'GET',
  })
  detail({ response }: { response: Oak.Response }) {
    response.status = 200;
    response.body = {
      status: true,
      data: {
        message: 'user.enter.home'
      },
    }
  }
}