import { getApolloClient } from 'lib/apollo-client';

import parameterize from 'parameterize';

import { QUERY_ALL_CUSTOMERS, QUERY_ALL_CUSTOMERS_SEO } from 'data/customers';

/**
 * customerPathBySlug
 */

export function customerPathBySlug(slug) {
	return `/customer/${slug}`;
}

/**
 * getCustomerBySlug
 */

export async function getCustomerBySlug(slug) {
	const { customers } = await getAllCustomers();

	const customer = customers.find((customer) => customer.slug === slug);

	return {
		customer,
	};
}

/**
 * customerPathByName
 */

export function customerPathByName(name) {
	return `/customer/${parameterize(name)}`;
}

/**
 * getCustomerByNameSlug
 */

export async function getCustomerByNameSlug(name) {
	const { customers } = await getAllCustomers();

	const customer = customers.find((customer) => parameterize(customer.name) === name);

	return {
		customer,
	};
}

/**
 * customerSlugByName
 */

export function customerSlugByName(name) {
	return parameterize(name);
}

/**
 * getAllCustomers
 */

export async function getAllCustomers() {
	const apolloClient = await getApolloClient();

	let customerData;
	let seoData;

	try {
		customerData = await apolloClient.query({
			query: QUERY_ALL_CUSTOMERS,
		});
	} catch (e) {
		console.log(`[customers][getAllCustomers] Failed to query customer data: ${e.message}`);
		throw e;
	}

	let customers = customerData?.data.customers.edges.map(({ node = {} }) => node).map(mapCustomerData);

	// If the SEO plugin is enabled, look up the data
	// and apply it to the default settings

	if (process.env.WORDPRESS_PLUGIN_SEO === true) {
		try {
			seoData = await apolloClient.query({
				query: QUERY_ALL_CUSTOMERS_SEO,
			});
		} catch (e) {
			console.log(`[customers][getAllCustomers] Failed to query SEO plugin: ${e.message}`);
			console.log('Is the SEO Plugin installed? If not, disable WORDPRESS_PLUGIN_SEO in next.config.js.');
			throw e;
		}

		customers = customers.map((customer) => {
			const data = { ...customer };
			const { id } = data;

			const seo = seoData?.data?.customers.edges.map(({ node = {} }) => node).find((node) => node.id === id)?.seo;

			return {
				...data,
				title: seo.title,
				description: seo.metaDesc,
				robots: {
					nofollow: seo.metaRobotsNofollow,
					noindex: seo.metaRobotsNoindex,
				},
				social: seo.social,
			};
		});
	}

	return {
		customers,
	};
}

/**
 * mapCustomerData
 */

export function mapCustomerData(customer) {
	const { id, customerFieldGroup } = customer;
	return {
		id,
		name: customerFieldGroup?.customerName || '',
		site: customerFieldGroup?.customerPage || '',
		logo: {
			alt: customerFieldGroup?.customerLogo?.node.altText || '',
			url: customerFieldGroup?.customerLogo?.node.mediaItemUrl || '',
		},
	};
}

/**
 * updateCustomerAvatar
 */

export function updateCustomerAvatar(avatar) {
	// The URL by default that comes from Gravatar / WordPress is not a secure
	// URL. This ends up redirecting to https, but it gives mixed content warnings
	// as the HTML shows it as http. Replace the url to avoid those warnings
	// and provide a secure URL by default

	return {
		...avatar,
		url: avatar.url?.replace('http://', 'https://'),
	};
}
