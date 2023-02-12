import { Oak, oakRouter } from '../../deps.ts';
import auth from '../../middleware/auth.ts'

class Access {

	/**
	 * oakRouter装饰器
	 * @param {object} info 传入装饰器的对象
	 * @param {string} info.method 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'
	 * @param {boolean} [info.auth = true] info.auth
	 * @returns {void}
	 */
	@oakRouter({
		method: 'POST',
		auth: false,
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
		method: 'GET',
	})
	detail({ response }: { response: Oak.Response }) {
		response.status = 200;
		response.body = {
			status: true,
			data: {
				message: 'user.enter.detail'
			},
		}
	}

}

export { Access }