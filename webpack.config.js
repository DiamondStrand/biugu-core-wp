const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );
const path = require( 'path' );

module.exports = {
    ...defaultConfig,
    entry: {
        // Vi pekar ut din specifika admin-startfil
        'index': path.resolve( process.cwd(), 'src/index.jsx' )
    }
};