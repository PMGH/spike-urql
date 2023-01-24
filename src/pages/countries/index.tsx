import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FeaturedCountryProps, StaticCountriesListProps } from "types/countries.types";
import { cacheExchange, dedupExchange, fetchExchange, ssrExchange, useQuery } from "urql";
import { GET_COUNTRIES_QUERY, GET_COUNTRY_BY_ID_QUERY } from "urql/queries";
import ClientOnly from "components/client-only";
import { Country } from "types/shared.types";
import { initUrqlClient, withUrqlClient } from "next-urql";

const StaticCountriesList = ({ countries }: StaticCountriesListProps) => {
  if (countries) {
    return (
      <ul>
        {countries.map(country => <li key={country.code}>{country.name}</li>)}
      </ul>
    )
  }
  return <p>Countries not found.</p>
}

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

const CountriesPage = () => {
  const [res] = useQuery({ query: GET_COUNTRIES_QUERY });
  console.log({ staticCountries: res?.data?.countries, res })

  return (
    <>
    <h1>Countries Page</h1>
      <br />
      <ClientOnly>
        <ErrorBoundary fallback={<h2>Could not fetch featured country</h2>}>
          <Suspense fallback={<h1>Suspense fallback...</h1>}>
            <DynamicFeaturedCountry code="GE" />
          </Suspense>
        </ErrorBoundary>
      </ClientOnly>
      <br />
      <h3>Countries</h3>
      <StaticCountriesList countries={res.data.countries} />
    </>
  )
}

export async function getStaticProps() {
  const ssrCache = ssrExchange({ isClient: false });
  const client = initUrqlClient({
    url: 'https://countries.trevorblades.com/',
    exchanges: [dedupExchange, cacheExchange, ssrCache, fetchExchange]
  }, false);

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
