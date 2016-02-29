define(['Augment',	'Instance',	'Router'],
function (augment, instance, Router) {
	'use strict';

var App = augment(instance, function () {
    this.startupApp = function(){
        var router = new Router();
        router.mapRoutes();
        location.href="#/home";
    };
});

return App.create();
});