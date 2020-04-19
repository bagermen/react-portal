/*jslint node: true */
"use strict";
const path = require('path');
const context = path.dirname(__dirname);

const PORTAL_TITLE = 'Customer Portal';
const SERVER_BASE = '/';
const FAVICON = 'dist/images/favicon.ico';

const buildFolder = 'build';

const jsBuildFolder = `dist/js`; // JS build directory
const cssBuildFolder = `dist/css`; // Style build directory
const imagesBuildFolder = `dist/images`; // Images build directory
const fontsBuildFolder = `dist/fonts`; // Fonts build directory

const jsTemplateName = process.env.NODE_ENV === 'production' ? `[name].[hash].bundle.js` : '[id].[name].js?[hash]'; // js build path
const cssTemplateName = `[name].[hash].css`; // js build path

const imageTemplateName = '[path][name].[ext]?[hash]';
const fontTemplateName = '[path][name].[ext]?[hash]';

module.exports = {
    PORTAL_TITLE,
    SERVER_BASE,
    FAVICON,
    CONTEXT: context,
    OUTPUT: path.join(context, buildFolder),
    BUILD_FOLDER: buildFolder,
    JS_BUILD_FOLDER: jsBuildFolder,
    CSS_BUILD_FOLDER: cssBuildFolder,
    IMG_BUILD_FOLDER: imagesBuildFolder,
    FONTS_BUILD_FOLDER: fontsBuildFolder,
    JS_TEMPLATE_NAME: jsTemplateName,
    CSS_TEMPLATE_NAME: cssTemplateName,
    IMG_TEMPLATE_NAME: imageTemplateName,
    FONTS_TEMPLATE_NAME: fontTemplateName
};