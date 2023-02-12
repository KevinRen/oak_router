import { Oak, oakRouter } from '../deps.ts';
import auth from '../middleware/auth.ts'

class UserEnter {

	@oakRouter({
		method: 'PUT',
	})
	logout({ response }: { response: Oak.Response }) {
		response.status = 200;
		response.body = {
			status: true,
			data: {
				message: 'user.enter.logout'
			},
		}
	}

	@oakRouter({
		method: 'POST',
	})
	register({ response }: { response: Oak.Response }) {
		response.status = 200;
		response.body = {
			status: true,
			data: {
				message: 'user.enter.register'
			},
		}
	}

	@oakRouter({
		method: 'POST',
		auth: false
	})
	async login({ response }: { response: Oak.Response }) {
		response.status = 200;
		response.body = {
			status: true,
			data: {
				userId: 1, token: await auth.generateToken(),
			},
		}
	}

}

export { UserEnter }