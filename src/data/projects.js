import { gql } from '@apollo/client';

export const QUERY_BEST_PROJECTS = gql`
	query BestProjects {
		projects(where: { orderby: { field: DATE, order: ASC } }, first: 10) {
			edges {
				node {
					id
					tags {
						nodes {
							name
						}
					}
					projectFieldGroup {
						name
						tags
						thumbnail {
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

export const QUERY_ALL_PROJECTS = gql`
	query BestProjects {
		projects(where: { orderby: { field: DATE, order: ASC } }, first: 100) {
			edges {
				node {
					id
					tags {
						nodes {
							name
						}
					}
					projectFieldGroup {
						name
						tags
						description
						url
						thumbnail {
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
