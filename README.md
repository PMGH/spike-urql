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

For NextJS we can use the dedicated next-urql package:
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
// MyComponent.tsx

const DynamicFeaturedCountry = ({ code }: FeaturedCountryProps) => {
  const [result, reexecuteQuery] = useQuery<{ country: Country }>({
    query: GET_COUNTRY_BY_ID_QUERY,
    variables: { code }
  });
  const { data, fetching, error } = result;
  console.log({ data, fetching, error  })

  if (fetching) {
    return <span>Loading...</span>
  }

  if (error) {
    return <span>Error: {error.message}</span>
  }

  if(data?.country) {
    return <p>Featured Country: {data.country.name}</p>
  }
  return null;
}
```

#### SSR
We need a bit more setup for SSR. We create an ssrExhange with isClient set to false and pass that to our `initUrqlClient`. `canEnableSuspense` is also set to false.

```typescript
export async function getStaticProps() {
  const ssrCache = ssrExchange({ isClient: false });
  const client = initUrqlClient({
    url: 'https://countries.trevorblades.com/',
    exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange]
  }, false); // canEnableSuspense set to false

  // This query is used to populate the cache for the query used on this page
  await client?.query(GET_COUNTRIES_QUERY, undefined, undefined).toPromise();

  return {
    props: {
      // urqlState is a keyword here so withUrqlClient can pick it up
      urqlState: ssrCache.extractData(),
    },
    revalidate: 600
  };
}

export default withUrqlClient(ssr => ({
  url: 'https://countries.trevorblades.com/'
}),
// additional urql client options
{
  staleWhileRevalidate: true
}
// Cannot specify { ssr: true } here so we don't wrap our component in getInitialProps
)(CountriesPage);
```

#### Suspense
We pass `canEnableSuspense` set to `false` when we set up `getStaticProps` to prevent it trying to use Suspense on the server.

#### Infinite Scrolling
https://formidable.com/open-source/urql/docs/basics/ui-patterns/#infinite-scrolling
We can do this using something like:
```typescript
{isLastPage && todos.pageInfo.hasNextPage && (
  <button onClick={() => onLoadMore(todos.pageInfo.endCursor)}>load more</button>
)}
```

#### Prefetching
https://formidable.com/open-source/urql/docs/basics/ui-patterns/#prefetching-data
We can call `client.query(TodoQuery, { id }).toPromise();` based on user DOM events to do this.

#### Reacting to focus and stale time
https://formidable.com/open-source/urql/docs/basics/ui-patterns/#reacting-to-focus-and-stale-time
We can use `refocusExchange` from the `@urql/exchange-refocus` package.

#### Optimistic Updates
https://formidable.com/open-source/urql/docs/graphcache/cache-updates/#optimistic-updates
`optimistic` option can be passed to the `cacheExchange`

#### Typescript
https://formidable.com/open-source/urql/docs/basics/typescript-integration/

#### Pagination
https://formidable.com/open-source/urql/docs/basics/ui-patterns/#infinite-scrolling
Make request manually with page number.
