quantum.controller('adminCtrl', function($scope, $filter, $uibModalInstance, userService, mission, $window,procedureService) {
    var $ctrl = this;

    $ctrl.users = [];
    $ctrl.roles = [];
    $ctrl.mission = mission.name;

    userService.getRoles()
    .then(function(response) {
        if(response.status == 200) {
            var roles = response.data.roles;
            for (var role in roles){
                if (!roles.hasOwnProperty(role)) continue;

                roles[role].checked = false;

                // if(role != 'MD') {
                    $ctrl.roles.push(roles[role]);
                // }
            }
        }
    });

    userService.getUsers($ctrl.mission)
    .then(function(response) {
        if(response.status == 200) {
            var users = response.data;
            for (var i=0; i<users.length; i++){
                // if(users[i].currentRole && users[i].currentRole.callsign != 'MD') {
                    $ctrl.users.push(users[i]);
                // }
            }
        }
    });

    $ctrl.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function() {
        if($ctrl.selected){
            if(roleChosen()){
                var newRoles = [];
                var objRoles = {};
                 
                for (var i=0; i<$ctrl.roles.length; i++){
                    if($ctrl.roles[i].checked == true) {
                        var newRole = new Object();
                        newRole.name = $ctrl.roles[i].name;
                        newRole.callsign = $ctrl.roles[i].callsign;
                        newRoles.push(newRole);
                        objRoles[$ctrl.roles[i].callsign] = 1;
                    }
                }

                $ctrl.selected.user.allowedRoles = objRoles;

                userService.setAllowedRoles($ctrl.selected.user, newRoles, $ctrl.mission)
                .then(function(response) {
                    if(response.status == 200){
                        var position = "bottom right";
                        var queryId = '#adminsettingstoaster';
                        var delay = 5000;
                        $scope.usermessage = "Allowed roles updated for " + $ctrl.selected.user.google.name;
                        var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
                    }
                })
            } else {
                var position = "bottom right";
                var queryId = '#adminsettingstoaster';
                var delay = 5000;
                $scope.usermessage = "Please choose at least one role";
                var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
            }
        } else {
            var position = "bottom right";
            var queryId = '#adminsettingstoaster';
            var delay = 5000;
            $scope.usermessage = "Please select the user from dropdown menu";
            var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
        }
    }

    $scope.$watch('$ctrl.selected.user', function(newValue, oldValue){
        for(var i=0; i<$ctrl.roles.length; i++) {
            if($ctrl.selected.user.allowedRoles) {
                if($ctrl.roles[i].callsign in $ctrl.selected.user.allowedRoles){
                    $ctrl.roles[i].checked = true;
                } else {
                     $ctrl.roles[i].checked = false;
                }
            }
        }
    })

    function roleChosen() {
        var trues = $filter("filter")($ctrl.roles, {
            checked: true
        });
        return trues.length;
    }

});
