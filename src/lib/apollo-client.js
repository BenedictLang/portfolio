import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persistCache, AsyncStorageWrapper } from 'apollo3-cache-persist';
import { removeLastTrailingSlash } from 'lib/util';

let client;

/**
 * getApolloClient
 */

export async function getApolloClient() {
	if (!client) {
		client = await _createApolloClient();
	}
	return client;
}

/**
 * createApolloClient
 */

export async function _createApolloClient() {
	const cache = new InMemoryCache({
		typePolicies: {
			RootQuery: {
				queryType: true,
			},
			RootMutation: {
				mutationType: true,
			},
		},
	});

	// Persistent cache for offline development
	if (typeof window !== 'undefined') {
		try {
			await persistCache({
				cache,
				storage: new AsyncStorageWrapper(AsyncStorage),
			});
		} catch (error) {
			console.error('[apollo-cache-persist] Error restoring cache', error);
		}
	}

	return new ApolloClient({
		link: new HttpLink({
			uri: removeLastTrailingSlash(process.env.WORDPRESS_GRAPHQL_ENDPOINT),
		}),
		cache,
		defaultOptions: {
			watchQuery: {
				fetchPolicy: 'cache-first',
			},
		},
	});
}
