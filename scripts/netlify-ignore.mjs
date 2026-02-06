import { execSync } from 'child_process';

/**
 * Netlify Ignore Script for Monorepo
 * 
 * Exits with 0: Cancel the build (No relevant changes)
 * Exits with 1: Proceed with the build (Changes detected)
 */

const appName = process.env.APP_NAME;
const cachedRef = process.env.CACHED_COMMIT_REF;
const commitRef = process.env.COMMIT_REF;

console.log(`--- Netlify Build Check for [${appName || 'Unknown'}] ---`);

if (!appName) {
    console.log('Error: APP_NAME environment variable is not defined.');
    console.log('Check your Netlify Site Settings > Environment Variables.');
    process.exit(1); // Build anyway if misconfigured
}

// Global paths that should ALWAYS trigger a build for all sites
const globalPaths = [
    'package.json',
    'package-lock.json',
    'netlify.toml',
    'packages/core',
    'scripts/netlify-ignore.mjs'
];

let appPath = '';
if (appName === 'marketing') {
    appPath = 'apps/marketing';
} else if (appName === 'app') {
    appPath = 'apps/app';
}

if (!appPath) {
    console.log(`Error: Unknown APP_NAME [${appName}]. Expected 'marketing' or 'app'.`);
    process.exit(1);
}

try {
    // If this is the very first build for a site, CACHED_COMMIT_REF might be missing
    if (!cachedRef) {
        console.log('No cached commit found (First build). Proceeding.');
        process.exit(1);
    }

    // Get list of changed files between last build and now
    const diffCommand = `git diff --name-only ${cachedRef} ${commitRef}`;
    const changedFiles = execSync(diffCommand).toString().trim().split('\n');

    console.log(`Checking ${changedFiles.length} changed files...`);

    const hasRelevantChanges = changedFiles.some(file => {
        // 1. Is it in the app's own folder?
        if (file.startsWith(appPath)) {
            console.log(`MATCH: Change detected in [${file}]`);
            return true;
        }
        // 2. Is it in a shared global path?
        const isGlobal = globalPaths.some(gp => file.startsWith(gp));
        if (isGlobal) {
            console.log(`MATCH: Global change detected in [${file}]`);
            return true;
        }
        return false;
    });

    if (hasRelevantChanges) {
        console.log('Proceeding with full build.');
        process.exit(1);
    } else {
        console.log(`No relevant changes for [${appName}]. Build cancelled.`);
        process.exit(0);
    }

} catch (err) {
    console.error('Check failed:', err.message);
    process.exit(1); // Proceed on error
}
