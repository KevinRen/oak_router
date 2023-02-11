import { Context } from './deps.ts';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'CONNECT' | 'OPTIONS' | 'TRACE' | 'PATCH';

export type MiddlewareHandle = (context: Context, next: Next) => void;

export type Constructor = new (...args: any[]) => any;

export type Target = Constructor & Record<string, unknown>;

export type Next = () => Promise<unknown>;

export function isConstructor(argument: any): argument is Function {
	return typeof argument === 'function';
}

export type RouterClass = Record<string, Constructor>;

export interface Module {
	default: RouterClass;
}

export function isClass(input: any): boolean {
	return (''+ input).substring(0, 5) === 'class';
}

export const METHOD_META_KEY = Symbol('method');
export const AUTH_META_KEY = Symbol('auth');
export const FUN_META_KEY = Symbol('handle');

export interface RouteMapItem {
	router?: string;
	dirEntry?: string;
	method: Method;
	fn: MiddlewareHandle;
	handle: string;
	auth: boolean;
}

export interface RouterMethodType {
	method?: Method;
	auth?: boolean;
}