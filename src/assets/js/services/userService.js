define(['Augment',	'Instance', 'GlobalData'],
function (augment, instance, GlobalData) {
	'use strict';

var UserService = augment(instance, function () {
    
    this.getAllUsers = function(){
        var dfd = $.Deferred();
        $.ajax({
            method:"GET",
            url:GlobalData.SERVICE_URL.GET_ALL_USER
        }).done(function(response){
            dfd.resolve(response);
        }).fail(function(response){
            dfd.reject(response);
        });
        
        return dfd.promise();  
    };
    
    
});

return UserService.create();
});