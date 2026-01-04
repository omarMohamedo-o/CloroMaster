// Deprecated: Back handler logic has been centralized in `backNavigation.js`.
// Please import and use `resolveParentPath` from '../../lib/backNavigation'.
// This file remains only for backward compatibility and will throw if used.
export function createBackHandler() {
    throw new Error('createBackHandler is deprecated. Use resolveParentPath in src/lib/backNavigation.js and the BackButton component.');
}

export default createBackHandler;
