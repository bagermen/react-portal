/**
 * @see https://github.com/csstools/postcss-preset-env
 * @see Look at https://css-tricks.com/css-grid-in-ie-css-grid-and-the-new-autoprefixer/
 */
module.exports = {
	sourceMap: true,
	plugins: {
		'postcss-preset-env': {
			browserslist: [
				'ie 11',
				'last 2 versions'
			],
			autoprefixer: {grid: "autoplace"}
		}
	}
};