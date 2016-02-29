define(['Augment',	'Instance',	'hbs!../views/templates/homeView', 'services/userService'],
function (augment, instance, homeViewTmpl, userService) {
	'use strict';

var HomeView = augment(instance, function () {
    
    this.addTo = function(selector){
         $('body').loadingOverlay();
        userService.getAllUsers()
        .done(function(users){
            var html = homeViewTmpl({users:users});
            $(selector).html(html);
        }).always(function(){
            $('body').loadingOverlay('remove');
        });
    
    };
    
});

return HomeView;
});