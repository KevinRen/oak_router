import { Oak, oakRouter } from '../../../deps.ts';

export class WebAccess {

  @oakRouter({
		method: 'GET',
    withId: true
	})
	detail(context: Oak.Context) {
    context.response.status = 200;
    context.response.body = {
      status: true,
      data: {
        id: context.params.id,
        message: 'user.enter.detail'
      },
    }
	}

}