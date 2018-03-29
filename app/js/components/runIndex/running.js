quantum.controller('runIndexCtrl', function($scope,procedureService,$routeParams,$window,dashboardService,$location) {
    $scope.params = $routeParams;
    $scope.sortType = 'procedurestarted'; // set the default sort type
    $scope.sortReverse = false;  // set the default sort order
    $scope.livelist = [];
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
            procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName($scope.procedureid ,$scope.proceduretitle,"Open Procedure");
        });
    }

    $scope.$on('$locationChangeStart', function(evnt, next, current){ 
         var loc = $location.url();
        dashboardService.changeHeaderWithLocation(loc,$scope.params.procID,$scope.proceduretitle,'',$window.innerWidth);  
    });
});


