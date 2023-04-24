import legacy from '@vitejs/plugin-legacy';
import autoprefixer from 'autoprefixer';
import Path from 'path';
import { defineConfig } from 'vite';
import { ViteAliases } from 'vite-aliases';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import pages from './src/pages/pages.config';

const DEFAULT_OPTIONS = {
	test: /\.(jpe?g|png|tiff|webp|svg|avif)$/i,
	exclude: undefined,
	include: undefined,
	excludePublic: ['./public/**/*'],
	includePublic: false,
	logStats: true,
	svg: {
		multipass: true,
		plugins: [
			{
				name: 'preset-default',
				params: {
					overrides: {
						cleanupNumericValues: false,
						removeViewBox: false,
					},
					cleanupIDs: {
						minify: false,
						remove: false,
					},
					convertPathData: false,
				},
			},
			'sortAttrs',
			{
				name: 'addAttributesToSVGElement',
				params: {
					attributes: [{ xmlns: 'http://www.w3.org/2000/svg' }],
				},
			},
		],
	},
	png: {
		quality: 100,
		palette: true,
	},
	jpeg: {
		quality: 95,
	},
	jpg: {
		quality: 95,
	},
	tiff: {
		quality: 100,
	},
	gif: {},
	webp: {
		lossless: true,
	},
	avif: {
		lossless: true,
	},
};

const pagesInput = {};
pages.forEach(page => {
	pagesInput[page.name] = page.path;
});

export default defineConfig({
	root: Path.resolve(__dirname, './src'),
	base: './',
	publicDir: '../public',
	css: {
		postcss: {
			plugins: [autoprefixer],
		},
		devSourcemap: true,
	},
	plugins: [
		ViteAliases(),
		ViteImageOptimizer({
			DEFAULT_OPTIONS,
		}),
		legacy({
			targets: ['> 0.5%', 'last 2 versions', 'Firefox ESR', 'not dead'],
		}),
	],

	build: {
		emptyOutDir: true,
		outDir: Path.resolve(__dirname, './build'),
		rollupOptions: {
			output: {
				assetFileNames: assetInfo => {
					let info = assetInfo.name.split('.');
					let extType = info[info.length - 1];

					if (/svg|png|jpe?g|tiff|gif|webp|avif|bmp|ico/i.test(extType)) {
						extType = 'images';
					} else if (/eot|otf|ttf|fnt|woff|woff2/.test(extType)) {
						extType = 'fonts';
					} else if (/css/.test(extType)) {
						extType = 'css';
					}
					return `assets/${extType}/[name]-[hash][extname]`;
				},

				entryFileNames: 'assets/js/[name]-[hash].js',
				chunkFileNames: 'assets/js/[name]-[hash].js',
			},
		},
	},
	server: {
		hmr: true,
		port: 3000,
		host: '0.0.0.0',
	},
});
