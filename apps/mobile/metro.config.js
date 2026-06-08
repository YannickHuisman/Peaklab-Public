const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// Let Metro resolve modules from the monorepo
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// Resolve source files for workspace packages (not dist)
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // For @package/* imports, resolve to source (index.ts) not dist
  if (moduleName.startsWith('@package/')) {
    const packageName = moduleName.replace('@package/', '');
    const packagePath = path.resolve(workspaceRoot, 'packages', packageName);

    return context.resolveRequest(context, `${packagePath}/index.ts`, platform);
  }

  // Default resolver
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
