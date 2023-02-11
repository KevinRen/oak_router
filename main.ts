import {
   Constructor,
   isConstructor,
   METHOD_META_KEY,
   AUTH_META_KEY,
   FUN_META_KEY,
   Module,
   RouterClass,
   isClass,
   Target,
   RouteMapItem,
   RouterMethodType
 } from './utils.ts';
import { Reflect, red } from './deps.ts';

export class RouterBuilder {

  public async disassemble(controllerDirPath: string, dirName?: string): Promise<RouteMapItem[]> {
    const controllerPath = Deno.realPathSync(controllerDirPath);

    let routers: RouteMapItem[] = [];

    for (const dirEntry of Deno.readDirSync(controllerPath)) {
      if (dirEntry.isDirectory) {
        const subPath = `${ controllerDirPath }/${ dirEntry.name }`;
        routers = [...routers, ...await this.disassemble(subPath, dirEntry.name)];
      } else if (dirEntry.isFile) {
        const controller: Module | RouterClass = await import(`file://${ controllerPath }/${ dirEntry.name }`);
        const module: RouterClass = Object.keys(controller).includes('default') ? (controller as Module).default : controller as RouterClass;

        Object.values(module).forEach(item => {
          if (isClass(item)) {
            const routerPath = `/${ dirName ? `${ dirName }/` : '' }${ dirEntry.name.substring(0, dirEntry.name.length - 3).split('.').join('/') }`;
            const metaRouters: RouteMapItem[] = this.routerBuiler(new item());

            metaRouters.forEach((item: RouteMapItem) => {
              item.router = `${ routerPath }/${ item.handle }`;
              item.dirEntry = `${ dirName ? `${ dirName }/` : '' }${ dirEntry.name }`;
              routers.push(item);
            });
          } else {
            console.log(red('模块中不是一个类'));
          }
        });
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

      if (method && handle) {
        result.push({ method, fn, handle, auth });
      }
    });

    return result;
  }
}

export function oakRouter(info: RouterMethodType = {}): Function {
	return function<Function>(_: Target, propertyKey: string, descriptor: TypedPropertyDescriptor<Function>) {
		const auth: boolean = info.method === 'PUT' || info.method === 'DELETE' ? true : info.auth ?? true;
		Reflect.defineMetadata(METHOD_META_KEY, info.method ?? 'POST', descriptor.value!);
		Reflect.defineMetadata(AUTH_META_KEY, auth, descriptor.value!);
		Reflect.defineMetadata(FUN_META_KEY, propertyKey, descriptor.value!);
	}
}