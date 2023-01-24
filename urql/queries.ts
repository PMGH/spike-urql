import { gql } from "urql";
import { graphql } from '../src/gql'

export const GET_COUNTRIES_QUERY = graphql(`
  query GET_COUNTRIES_QUERY {
    countries {
      code
      name
      emoji
    }
  }
`);

export const GET_COUNTRY_BY_ID_QUERY = graphql(`
  query GET_COUNTRY_BY_ID_QUERY($code: ID!) {
    country(code: $code) {
      code
      name
      emoji
    }
  }
`);
