import { fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { glob } from 'glob';
import path, { extname, relative } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';
import { libInjectCss } from 'vite-plugin-lib-inject-css';
import svgrPlugin from 'vite-plugin-svgr';

import * as packageJson from './package.json';

export default defineConfig(config => ({
	optimizeDeps: {
		exclude: ['storybook'],
	},
	plugins: [
		react(),
		libInjectCss(),
		dts({
			insertTypesEntry: true,
		}),
		svgrPlugin(),
	],
	resolve: {
		alias: {
			'@assets': path.resolve(__dirname, 'src/assets'),
		},
	},
	build: {
		sourcemap: false,
		lib: {
			entry: path.resolve(__dirname, 'src/index.ts'),
			name: 'leena-components',
			formats: ['es'],
			fileName: format => `index.${format}.js`,
		},
		rollupOptions: {
			external: [
				...Object.keys(packageJson.peerDependencies),
				'react/jsx-runtime',
			],
			/**
              Define multiple entry points based on file name
            */
			input: Object.fromEntries(
				glob
					.sync('src/**/*.{ts,tsx}', {
						ignore: [
							'src/**/*.d.ts',
							'src/**/*.stories.{ts,tsx}',
							'src/**/*.cy.{ts,tsx}',
						],
					})
					.map(file => [
						// 1. The name of the entry point
						// src/nested/foo.js becomes nested/foo
						relative(
							'src',
							file.slice(0, file.length - extname(file).length)
						),
						// 2. The absolute path to the entry file
						// src/nested/foo.ts becomes /project/src/nested/foo.ts
						fileURLToPath(new URL(file, import.meta.url)),
					])
			),
			output: {
				entryFileNames: '[name].js',
			},
		},
		watch: config.mode === 'watch' ? {} : undefined,
	},
}));
