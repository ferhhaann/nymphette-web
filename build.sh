#!/bin/bash

# Build script for SSR application
echo "Building SSR application..."

# Clean previous builds
rm -rf dist

# Build client
echo "Building client..."
npx vite build --outDir dist/client

# Build server
echo "Building server..."
npx vite build --ssr src/entry-server.tsx --outDir dist/server

echo "Build complete!"
echo "To start production server: npm run serve"