import { getApolloClient } from 'lib/apollo-client';

import parameterize from 'parameterize';

import { QUERY_ALL_PROJECTS, QUERY_BEST_PROJECTS } from 'data/projects';

/**
 * projectPathBySlug
 */

export function projectPathBySlug(slug) {
	return `/project/${slug}`;
}

/**
 * getProjectBySlug
 */

export async function getProjectBySlug(slug) {
	const { projects } = await getAllProjects();

	const project = projects.find((project) => project.slug === slug);

	return {
		project,
	};
}

/**
 * projectPathByName
 */

export function projectPathByName(name) {
	return `/project/${parameterize(name)}`;
}

/**
 * getCustomerByNameSlug
 */

export async function getProjectByNameSlug(name) {
	const { projects } = await getAllProjects();

	const project = projects.find((project) => parameterize(project.name) === name);

	return {
		project,
	};
}

/**
 * projectSlugByName
 */

export function projectSlugByName(name) {
	return parameterize(name);
}

/**
 * getAllProjects
 */

export async function getAllProjects() {
	const apolloClient = getApolloClient();

	let projectsData;

	try {
		projectsData = await apolloClient.query({
			query: QUERY_ALL_PROJECTS,
		});
	} catch (e) {
		console.log(`[projects][getAllProjects] Failed to query project data: ${e.message}`);
		throw e;
	}

	let projects = projectsData?.data.projects.edges.map(({ node = {} }) => node).map(mapProjectData);

	return {
		projects,
	};
}

/**
 * getBestProjects
 */
export async function getBestProjects() {
	const apolloClient = getApolloClient();

	let projectsData;

	try {
		projectsData = await apolloClient.query({
			query: QUERY_BEST_PROJECTS,
		});
	} catch (e) {
		console.log(`[projects][getBestProjects] Failed to query project data: ${e.message}`);
		throw e;
	}
	let projects = projectsData?.data.projects.edges.map(({ node = {} }) => node).map(mapBestProjectData);

	return {
		projects,
	};
}

/**
 * mapProjectData
 */

export function mapProjectData(project) {
	const { id, tags, projectFieldGroup } = project;
	return {
		id,
		name: projectFieldGroup?.name || '',
		description: projectFieldGroup?.description || '',
		tags: tags?.nodes?.map((tag) => tag.name) || [],
		liveDemo: projectFieldGroup?.url || '',
		thumbnail: {
			alt: projectFieldGroup?.thumbnail?.node.altText || '',
			url: projectFieldGroup?.thumbnail?.node.mediaItemUrl || '',
		},
	};
}

/**
 * mapProjectData
 */

export function mapBestProjectData(project) {
	const { id, tags, projectFieldGroup } = project;
	return {
		id,
		name: projectFieldGroup?.name || '',
		tags: tags?.nodes?.map((tag) => tag.name) || [],
		liveDemo: projectFieldGroup?.url || '',
		thumbnail: {
			alt: projectFieldGroup?.thumbnail?.node.altText || '',
			url: projectFieldGroup?.thumbnail?.node.mediaItemUrl || '',
		},
	};
}
