import { Application,  } from './deps.ts';
import router from './router.ts';

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener('listen', ({ secure, hostname, port }) => {
	const protocol = secure ? 'https://' : 'http://';
	const url = `${protocol}${hostname ?? 'localhost'}:${port}`;
	console.log(`\nserver Listening on: ${ url }\n`);
});

await app.listen({ port: 8080 });
