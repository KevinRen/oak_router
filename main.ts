import {
   Constructor,
   isConstructor,
   METHOD_META_KEY,
   AUTH_META_KEY,
   FUN_META_KEY,
   ID_META_KEY,
   Module,
   RouterClass,
   isClass,
   Target,
   RouteMapItem,
   RouterMethodType,
   Middleware,
   Next
 } from './utils.ts';
import { Oak, Reflect, red, green, path } from './deps.ts';

export class RouterBuilder {

  router: Oak.Router;

  private routerCount: number;

  private startTime: number;

  constructor(controllerDirPath: string, authMiddleware?: Middleware) {
    this.router = new Oak.Router();
    this.routerCount = 0;
    this.startTime = Date.now();
    this.buildRouters(controllerDirPath, authMiddleware);
  }

  private async authDefault(_: Oak.Context, next: Next) {
    await next();
  }

  private async buildRouters(controllerDirPath: string, authMiddleware?: Middleware,) {
    const routerMap: RouteMapItem[] = await this.disassemble(controllerDirPath);
    routerMap.forEach((item: RouteMapItem) => {
      const auth: Middleware = authMiddleware && item.auth ? authMiddleware : this.authDefault;
      switch (item.method) {
        case 'GET':
          this.router.get(item.handle, item.router!, auth, item.fn);
          break;
        case 'POST':
          this.router.post(item.handle, item.router!, auth, item.fn);
          break;
        case 'PUT':
          this.router.put(item.handle, item.router!, auth, item.fn);
          break;
        case 'DELETE':
          this.router.delete(item.handle, item.router!, auth, item.fn);
          break;
        case 'HEAD':
          this.router.head(item.handle, item.router!, auth, item.fn);
          break;
        case 'OPTIONS':
          this.router.options(item.handle, item.router!, auth, item.fn);
          break;
        case 'PATCH':
          this.router.patch(item.handle, item.router!, auth, item.fn);
          break;
      }
      this.routerCount++;
      console.log(green(`${ Deno.realPathSync(controllerDirPath) }/${ item.dirEntry } => [${ item.method }] ${ item.router }`));
    });
    const ms = Date.now() - this.startTime;

    setTimeout(() => console.log(green(`\nRouterBuild done. ${ this.routerCount } routes completed initialization... ${ ms }ms\n`)), 0);
  }

  private async disassemble(controllerDirPath: string, dirName?: string): Promise<RouteMapItem[]> {
    const controllerPath = Deno.realPathSync(controllerDirPath);

    let routers: RouteMapItem[] = [];

    for (const dirEntry of Deno.readDirSync(controllerPath)) {
      if (dirEntry.isDirectory) {
        const subPath = `${ controllerDirPath }/${ dirEntry.name }`;
        routers = [...routers, ...await this.disassemble(subPath, dirName ? `${ dirName }/${ dirEntry.name }` : dirEntry.name)];
      } else if (dirEntry.isFile) {
        const extName = path.extname(path.join(controllerPath, dirEntry.name));
        if (extName === '.ts' || extName === '.js') {
          const controller: Module | RouterClass = await import(`file://${ controllerPath }/${ dirEntry.name }`);
          const module: RouterClass = Object.keys(controller).includes('default') ? (controller as Module).default : controller as RouterClass;

          Object.values(module).forEach(item => {
            if (isClass(item)) {
              const routerPath = `/${ dirName ? `${ dirName }/` : '' }${ dirEntry.name.substring(0, dirEntry.name.length - 3).split('.').join('/') }`;
              const metaRouters: RouteMapItem[] = this.routerBuiler(new item());

              metaRouters.forEach((item: RouteMapItem) => {
                item.router = `${ routerPath }/${ item.handle }${ item.withId ? '/:id' : '' }`;
                item.dirEntry = `${ dirName ? `${ dirName }/` : '' }${ dirEntry.name }`;
                routers.push(item);
              });
            } else {
              console.log(red('[✕] The route in the module is not a class'));
            }
          });
        }
      }
    }

    return routers;
  }

  private routerBuiler(instance: Constructor): RouteMapItem[] {
    const prototype = Object.getPrototypeOf(instance);
    const methodsNames = Object.getOwnPropertyNames(prototype).filter(item => !isConstructor(item) && item !== 'constructor');
    const result: RouteMapItem[] = [];

    methodsNames.forEach(methodName => {
      const fn = prototype[methodName];
      const method = Reflect.getMetadata(METHOD_META_KEY, fn);
      const auth = Reflect.getMetadata(AUTH_META_KEY, fn);
      const handle = Reflect.getMetadata(FUN_META_KEY, fn);
      const withId = Reflect.getMetadata(ID_META_KEY, fn);

      if (method && handle) {
        result.push({ method, fn, handle, auth, withId });
      }
    });

    return result;
  }
}

export function oakRouter(info: RouterMethodType = {}): Function {
	return function<Function>(_: Target, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
		const auth: boolean = info.method === 'PUT' || info.method === 'DELETE' ? true : info.auth ?? true;
    const withId: boolean = info.withId ?? false;
		Reflect.defineMetadata(METHOD_META_KEY, info.method ?? 'POST', descriptor.value);
		Reflect.defineMetadata(AUTH_META_KEY, auth, descriptor.value);
		Reflect.defineMetadata(FUN_META_KEY, propertyKey, descriptor.value);
    Reflect.defineMetadata(ID_META_KEY, withId, descriptor.value);
	}
}