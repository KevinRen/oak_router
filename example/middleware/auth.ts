import { Next, Oak } from '../deps.ts';

const jwtAuth = async (_: Oak.Context, next: Next) => {
  console.log('router with auth');
  await next();
}

export default { jwtAuth }
