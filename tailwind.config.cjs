const { MODE } = require('./src/config/envvars');

const starlightPlugin = require('@astrojs/starlight-tailwind');


const pub = {
	accent: { 200: '#87dcc5', 600: '#007e68', 900: '#003c30', 950: '#002b22' },
	gray: { 100: '#ffffff', 200: '#f8ebe3', 300: '#cfbeb5', 400: '#a38473', 500: '#6d5141', 700: '#4b3123', 800: '#382012', 900: '#21150f' }
}

const priv = {
	accent: { 200: '#87dcc5', 600: '#007e68', 900: '#003c30', 950: '#002b22' },
	gray: { 100: '#f6f5ff', 200: '#edebff', 300: '#c2b7ff', 400: '#906aff', 500: '#6406d7', 700: '#400090', 800: '#2d0069', 900: '#1d0048' }
}
const colors = MODE === "PRIVATE" ? priv : pub

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: { colors },
	},
	plugins: [starlightPlugin()],
	safelist: [
		"!font-bold",
		"!text-red-400",
	],
}