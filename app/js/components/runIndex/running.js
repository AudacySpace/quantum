quantum.controller('runIndexCtrl', function($scope,procedureService,$routeParams,userService,timeService,$interval) {
    $scope.params = $routeParams;
    showRunningList();

    function showRunningList(){
        console.log($scope.params.procID);
        procedureService.getAllInstances($scope.params.procID).then(function(response){
            if(response.status === 200){
                //openedBy
                //startedAt
                //revision
                console.log(response.data);
                $scope.livelist = response.data.runninginstances;
                $scope.procedureid = $scope.params.procID;
                $scope.proceduretitle = response.data.title;
            }
        });
    }
});


