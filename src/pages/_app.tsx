import '@/styles/globals.css'
import { withUrqlClient } from 'next-urql';
import type { AppProps } from 'next/app'

function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

// Be aware that wrapping the _app component using withUrqlClient with the { ssr: true } option disables Next's "Automatic Static Optimization" for all our pages. It is thus preferred to enable server-side rendering on a per-page basis.
export default withUrqlClient((_ssrExchange, ctx) => ({
  url: 'https://countries.trevorblades.com/'
}))(App);
