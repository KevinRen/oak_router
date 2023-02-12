import { Oak, RouterBuilder } from './deps.ts';
import auth from './middleware/auth.ts';

const app = new Oak.Application();
const routerBuilder = new RouterBuilder('./controllers', auth.jwtAuth);

app.use(routerBuilder.router.routes());
app.use(routerBuilder.router.allowedMethods());

app.addEventListener('listen', ({ secure, hostname, port }) => {
	const protocol = secure ? 'https://' : 'http://';
	const url = `${protocol}${hostname ?? 'localhost'}:${port}`;
	console.log(`\nserver Listening on: ${ url }\n`);
});

await app.listen({ port: 8080 });
