import { Oak } from './deps.ts';

export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH';

export type Next = () => Promise<unknown> | unknown;

export type Middleware = (context: Oak.Context, next: Next) => void;

export type Constructor = new (...args: any[]) => any;

export type Target = Constructor & Record<string, unknown>;

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
export const ID_META_KEY = Symbol('id');

export interface RouteMapItem {
	router?: string;
	dirEntry?: string;
	method: Method;
	fn: Middleware;
	handle: string;
	auth: boolean;
	withId: boolean;
}

export interface RouterMethodType {
	method?: Method;
	auth?: boolean;
	withId?: boolean;
}