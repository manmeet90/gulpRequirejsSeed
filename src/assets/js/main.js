/*global require, define*/

require.config({
	baseUrl: 'assets/js',
	waitSeconds: 0,
	'paths': {
		'Augment': 'thirdparty/augment/augment',
		'Path': 'thirdparty/path/path',
		'PubSub' : 'thirdparty/pubsub/pubsub',
		'hbs' : 'thirdparty/hbs',
		'loadingOverlay' : 'thirdparty/loading-overlay/loading-overlay'
	},
	shim: {
		'Path': {
            exports: 'Path'
        }
	}
});

define('global-load', [ 'loadingOverlay'], function () {
	'use strict';
	// Ensure that global object libs are loaded
});

require(['app', 'global-load'], function (app) {
	'use strict';

	app.startupApp();
});