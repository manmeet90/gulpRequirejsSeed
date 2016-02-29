define(['Augment',	'Instance'],
 function(augment, instance){

    'use strict';
    
    var GlobalData = augment(instance, function () {
        
        this.usersList = [];
        
        this.SERVICE_URL = {
            "GET_ALL_USER" : "http://jsonplaceholder.typicode.com/users"
        };
        
        this.getUsers = function(){
            return this.usersList;
        };
        
    });
    
    return GlobalData.create();
    
});
