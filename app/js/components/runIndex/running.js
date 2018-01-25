quantum.controller('runIndexCtrl', function($scope,procedureService,$routeParams,userService,timeService,$interval) {
    $scope.params = $routeParams;
    $scope.sortType     = 'procedurestarted'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    showRunningList();

    function showRunningList(){
        procedureService.getAllInstances($scope.params.procID).then(function(response){
            if(response.status === 200){
                //openedBy
                //startedAt
                //revision
                $scope.livelist = [];
                for(var i=0;i<response.data.instances.length;i++){
                    if(response.data.instances[i].running === true){
                        $scope.livelist.push(response.data.instances[i]);
                    }
                }
                $scope.procedureid = $scope.params.procID;
                $scope.proceduretitle = response.data.title;
            }
        });
    }
});


