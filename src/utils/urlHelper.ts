/**
 * Helper to ensure links shared to other phones use the Public Shared App URL (ais-pre-...)
 * instead of the private Google-authenticated development URL (ais-dev-...).
 */
export const getPublicShareUrl = (): string => {
  if (typeof window === 'undefined') {
    return 'https://ais-pre-4nt55l2sw6ts2x4weub6d2-712811788743.europe-west2.run.app';
  }
  const origin = window.location.origin;
  if (origin.includes('ais-dev-')) {
    return origin.replace('ais-dev-', 'ais-pre-');
  }
  return origin;
};
