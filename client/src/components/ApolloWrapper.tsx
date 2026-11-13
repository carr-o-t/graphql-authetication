"use client";

import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import {
  ApolloNextAppProvider,
  NextSSRInMemoryCache,
  NextSSRApolloClient,
  SSRMultipartLink,
} from "@apollo/experimental-nextjs-app-support/ssr";
import React from "react";

// to merge mutation payloads onto the same cache entities
const typePolicies = {
  User: {
    keyFields: ["ID"],
  },
};

const httpLink = new HttpLink({
  uri: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT,
  fetchOptions: { cache: "no-store" },
});

export const client = new ApolloClient({
  cache: new InMemoryCache({ typePolicies }),
  link: httpLink,
});

function makeClient() {
  return new NextSSRApolloClient({
    cache: new NextSSRInMemoryCache({ typePolicies }),
    link:
      typeof window === "undefined"
        ? ApolloLink.from([
            new SSRMultipartLink({
              stripDefer: true,
            }),
            httpLink,
          ])
        : httpLink,
  });
}

export function ApolloWrapper({ children }: { children: React.ReactNode }) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
