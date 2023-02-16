import { Oak, RouterBuilder, Next } from './deps.ts';
import auth from './middleware/auth.ts';

const app = new Oak.Application();
const routerBuilder = new RouterBuilder('./controllers', auth.jwtAuth);

app.use(async (_: Oak.Context, next: Next) => {
	try {
		await next();
	} catch (error) {
		if (Oak.isHttpError(error)) {
			switch (error.status) {
				case Oak.Status.NotFound:
					console.log('not found')
					break;
				default: console.log(error);
			}
		} else {
			throw error;
		}
	}
});

app.use(routerBuilder.router.routes());
app.use(routerBuilder.router.allowedMethods());

app.addEventListener('listen', ({ secure, hostname, port }) => {
	const protocol = secure ? 'https://' : 'http://';
	const url = `${protocol}${hostname ?? 'localhost'}:${port}`;
	console.log(`\nserver Listening on: ${ url }\n`);
});

app.addEventListener('error', (event) => {
	event.preventDefault();
	console.error(`[Global Error]`, event.error);
});

addEventListener('unhandledrejection', (event) => {
	event.preventDefault();
	console.error('unhandledrejection', event.reason);
});

await app.listen({ port: 8080 });
