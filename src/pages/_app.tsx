import '@/styles/globals.css'
import { persistedFetchExchange } from '@urql/exchange-persisted-fetch';
import { withUrqlClient } from 'next-urql';
import type { AppProps } from 'next/app'
import { cacheExchange, dedupExchange, fetchExchange } from 'urql';

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

// Be aware that wrapping the _app component using withUrqlClient with the { ssr: true } option disables Next's "Automatic Static Optimization" for all our pages. It is thus preferred to enable server-side rendering on a per-page basis.
export default withUrqlClient((_ssrExchange, ctx) => ({
  url: 'https://countries.trevorblades.com/',
  exchanges: [
    dedupExchange,
    cacheExchange,
    // Typically it's recommended to set preferGetForPersistedQueries to true to force all persisted queries to use GET requests instead of POST so that CDNs can do their job. We also added the persistedFetchExchange in front of the usual fetchExchange, since it only handles queries but not mutations.
    persistedFetchExchange({
      preferGetForPersistedQueries: true
    }),
    fetchExchange],
}))(App);
