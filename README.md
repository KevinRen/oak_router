# Oak-RouterBuilder

A Deno-oak based routing extension.

It allows developers to say goodbye to the long handwritten route definition and use the @ oakRouter decorator to describe the route and its method.

When the oak project is started, it will automatically traverse all the routing classes under the specified folder and automatically register them in the oak Router. So that oak development can be carried out easily.

### You can start your oak project development in just two simple steps.
```
 controllers
    └ user
      └ access.v1.ts
 main.ts
```

### Step 1: create the controllers/user folder in the project and create the access.v1.ts file in the folder
Use oakRouter decorator to implement two routing methods in Access class

```typescript
// access.v1.ts

import { Oak, oakRouter } from 'https://deno.land/x/oak-router@VERSION/mod.ts';

class Access {

  /**
  * create a POST routing method without auth authentication
  * @param {object} info objects passed into the decorator
  * @param {string} info.method 'GET' | 'POST' | 'PUT' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'PATCH'
  * @param {boolean} [info.auth = true] info.auth
  * @returns {void}
  */
  @oakRouter({
    method: 'POST',
    auth: false
  })
  async login({ response }: { response: Oak.Response }) {
    response.status = 200;
    response.body = {
      status: true,
      data: {
        message: 'access.login',
      },
    }
  }

  // create a GET routing method with auth authentication
  @oakRouter({
    method: 'GET',
  })
  detail({ response }: { response: Oak.Response }) {
    response.status = 200;
    response.body = {
      status: true,
      data: {
        message: 'access.detail'
      },
    }
  }
}

// export router class
export { Access }
```

### Step 2: In main.ts, use RouterBuilder to initialize the route and start

```typescript
// main.ts

import { Oak, RouterBuilder } from 'https://deno.land/x/oak-router@VERSION/mod.ts';
import auth from './middleware/auth.ts';

const app = new Oak.Application();
const routerBuilder = new RouterBuilder('./controllers', auth.jwtAuth);

app.use(routerBuilder.router.routes());
app.use(routerBuilder.router.allowedMethods());

app.addEventListener('listen', ({ secure, hostname, port }) => {
  const protocol = secure ? 'https://' : 'http://';
  const url = `${protocol}${hostname ?? 'localhost'}:${port}`;
  console.log(`\n server Listening on: ${ url }\n`);
});

await app.listen({ port: 8080 });

```

### OK, it's done! Now you can start your project.

```
// cd to project directory
deno run --allow-net --allow-read main.ts

...

// the following contents will be displayed in the terminal

/Users/yourPath/oak_router/example/controllers/user/access.v1.ts => [POST] /user/access/v1/login
/Users/yourPath/oak_router/example/controllers/user/access.v1.ts => [GET] /user/access/v1/detail

RouterBuild done. 4 routes completed initialization... 3ms
```

> controllers/user/access.v1.ts => /user/access/v1/login

RouterBuilder will convert the folder name and file name under controllers into api access path to avoid too deep project directory level leading to huge project

### oakRouter auth
>The auth parameter in the parameter passed by the oakRouter decorator is used to describe whether the route needs token authentication, default value is true. Authentication function can be passed in when the RouterBuilder is initialized to enable it to intercept and verify before executing the route.

The validation function
```typescript
// auth.ts

import { Next, Oak } from 'https://deno.land/x/oak-router@VERSION/mod.ts';

const jwtAuth = async (_: Oak.Context, next: Next) => {
  console.log('router with auth');
  await next();
}

const generateToken = (): Promise<string> | string => 'jwt token';

export default { jwtAuth, generateToken }
```