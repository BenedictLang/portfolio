import { gql } from '@apollo/client';

export const QUERY_ALL_CUSTOMERS = gql`
	query AllCustomers {
		customers(where: { orderby: { field: DATE, order: ASC } }, first: 1000) {
			edges {
				node {
					id
					customerFieldGroup {
						customerName
						customerPage
						customerLogo {
							node {
								altText
								mediaItemUrl
							}
						}
					}
				}
			}
		}
	}
`;

export const QUERY_ALL_CUSTOMERS_SEO = gql`
	query AllCustomers {
		customers(first: 100, where: { orderby: { field: DATE, order: ASC } }) {
			nodes {
				id
				seo {
					metaDesc
					metaRobotsNofollow
					metaRobotsNoindex
					title
					social {
						youTube
						wikipedia
						twitter
						soundCloud
						pinterest
						mySpace
						linkedIn
						instagram
						facebook
					}
				}
			}
		}
	}
`;
