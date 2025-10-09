
/**
 * Utility functions for project-related operations
 */

/**
 * Checks if a project ID corresponds to a mock/demo project
 * Mock projects have IDs in the format P001, P002, etc.
 */
export const isMockProject = (id: string | undefined | null): boolean => {
  if (!id || typeof id !== 'string' || id.trim() === '') return false;
  return id.match(/^P\d+$/) !== null;
};

/**
 * Safely gets a project ID, handling undefined cases
 */
export const getProjectId = (project: { id?: string } | null | undefined): string | undefined => {
  return project?.id;
};

/**
 * Checks if a project has a valid ID for operations
 */
export const hasValidId = (project: { id?: string } | null | undefined): boolean => {
  const id = getProjectId(project);
  return !!(id && id.trim() !== '' && id !== 'undefined');
};
