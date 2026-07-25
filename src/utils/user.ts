/**
 * The backend requires a userId on every record write. Until auth exists,
 * it comes from the environment.
 */
export const CURRENT_USER_ID = import.meta.env.VITE_USER_ID;
