import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { FeaturedCountryProps, StaticCountriesListProps } from "types/countries.types";
import { useQuery } from "urql";
import { GET_COUNTRIES_QUERY, GET_COUNTRY_BY_ID_QUERY } from "urql/queries";
import ClientOnly from "components/client-only";
import { Country } from "types/shared.types";

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

const CountriesPage = ({ countries: staticCountries }: any) => {
  console.log({ staticCountries })

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
      <StaticCountriesList countries={staticCountries} />
    </>
  )
}

export async function getStaticProps() {
  // const { data } = await useQuery({
  //   query: GET_COUNTRIES_QUERY
  // });

  return {
    props: {
      // countries: data.countries.slice(0, 4),
    },
  };
}

export default CountriesPage;
