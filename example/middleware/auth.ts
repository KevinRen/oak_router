import { Next, Context } from '../deps.ts';

const jwtAuth = async (_: Context, next: Next) => await next();

const withoutAuth = async (_: Context, next: Next) => await next();

const generateToken = (): string => 'jwt_tok';

export default { jwtAuth, generateToken, withoutAuth }
