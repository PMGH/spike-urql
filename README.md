This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## URQL

#### Getting Started
- Install dependencies: urql, graphql, next-urql, react-is
- Create UrqlClient
- Wrap _app.tsx in urql Provider and pass UrqlClient into Provider
- Use `useQuery` within a component
```typescript
// _app.tsx

import type { AppProps } from 'next/app'
import { createClient, Provider } from 'urql'

const urqlClient = createClient({
  url: 'https://countries.trevorblades.com/',
  // We would need the following for authorised requests
  // fetchOptions: () => {
  //   const token = getToken();
  //   return {
  //     headers: { authorization: token ? `Bearer ${token}` : '' },
  //   };
  // },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Provider value={urqlClient}>
      <Component {...pageProps} />
    </Provider>
  )
}
```
```typescript
// MyComponent.tsx
const [result, reexecuteQuery] = useQuery<{ country: Country }>({
  query: GET_COUNTRY_BY_ID_QUERY,
  variables: { code }
});
const { data, fetching, error } = result;
```

For NextJS we can use the dedicated next-urql package which
```typescript
//_ app.tsx

import { withUrqlClient } from 'next-urql';
import type { AppProps } from 'next/app'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default withUrqlClient((_ssrExchange, ctx) => ({
  url: 'https://countries.trevorblades.com/'
}))(App);
```
```typescript

```
