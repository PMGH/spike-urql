import '@/styles/globals.css'
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
