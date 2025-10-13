export const projectErrorCodes = {
  unauthorized: 'PROJECT_UNAUTHORIZED',
  validationError: 'PROJECT_VALIDATION_ERROR',
  saveError: 'PROJECT_SAVE_ERROR',
  notFound: 'PROJECT_NOT_FOUND',
  fetchError: 'PROJECT_FETCH_ERROR',
  updateError: 'PROJECT_UPDATE_ERROR',
  deleteError: 'PROJECT_DELETE_ERROR',
} as const;

type ProjectErrorValue =
  (typeof projectErrorCodes)[keyof typeof projectErrorCodes];

export type ProjectServiceError = ProjectErrorValue;
