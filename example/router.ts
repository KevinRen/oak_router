import { Router, RouterBuilder, setTimeout, RouteMapItem } from './deps.ts';
import auth from './middleware/auth.ts';

const router: Router = new Router();

let routerCount = 0;

const start = Date.now();

const controllerPath = './controllers';

const routerBuilder = new RouterBuilder();

const routers: RouteMapItem[] = await routerBuilder.disassemble(controllerPath)

routers.forEach((item: RouteMapItem) => {
  switch (item.method) {
    case 'GET':
      router.get(item.handle, item.router!, item.auth ? auth.jwtAuth : auth.withoutAuth, item.fn);
      break;
    case 'POST':
      router.post(item.handle, item.router!, item.auth ? auth.jwtAuth : auth.withoutAuth, item.fn);
      break;
    case 'PUT':
      router.put(item.handle, item.router!, item.auth ? auth.jwtAuth : auth.withoutAuth, item.fn);
      break;
    case 'DELETE':
      router.delete(item.handle, item.router!, item.auth ? auth.jwtAuth : auth.withoutAuth, item.fn);
      break;
  }
  routerCount++;
  console.log(`${ Deno.realPathSync(controllerPath) }/${ item.dirEntry } => [${ item.method }] ${ item.router }`);
});

const ms = Date.now() - start;

setTimeout(() => console.log(`\n共${ routerCount }个路由完成初始化... ${ ms }ms\n`), 0);

export default router;