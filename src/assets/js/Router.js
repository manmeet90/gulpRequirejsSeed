define(["PubSub", "Path" , "views/HomeView"],
function(PubSub, Path, HomeView){
	"use strict";

	var Router = function(){
		var self = this;

		var rootEl = '#content';

		this.currentView = null;
		
		this.mapRoutes = function(){
			this.mapHome();
		
			Path.root("#/home");			
		
			Path.listen();
		};

		this.mapHome = function(){
			Path.map("#/home").to(function () {
                 var homeView = HomeView.create();
                 self.currentView = homeView;
                 homeView.addTo(rootEl);
                 PubSub.publish('CONTENT_VIEW_CHANGED', 'HomePage View');
			});
		};
};
	return Router;
});
