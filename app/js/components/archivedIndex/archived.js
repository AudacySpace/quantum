quantum.controller('archivedIndexCtrl', function($scope,procedureService,$routeParams,$window,dashboardService,$location) {
    $scope.params = $routeParams;
    $scope.sortType     = 'procedurecompleted'; // set the default sort type
    $scope.sortReverse  = false;  // set the default sort order
    $scope.archivedlist = [];
    $scope.loadcount = 0;
    showArchivedList();

    function showArchivedList(){
        if($scope.loadcount === 0){
            $scope.loadstatus = true;
        }
        procedureService.getAllInstances($scope.params.procID).then(function(response){
            if(response.status === 200){
                //openedBy
                //startedAt
                //revision
                //closedBy
                //completedAt
                $scope.archivedlist = [];
                for(var i=0;i<response.data.instances.length;i++){
                    if(response.data.instances[i].running === false){
                        $scope.archivedlist.push(response.data.instances[i]);
                    }
                }
                $scope.procedureid = $scope.params.procID;
                $scope.proceduretitle = response.data.title;
           }
            procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName( $scope.procedureid, $scope.proceduretitle,"AS-Run Archive");
            $scope.loadstatus = false;
            $scope.loadcount++;

        });

    }

    $scope.$on('$locationChangeStart', function(evnt, next, current){  
        var loc = $location.url();
        dashboardService.changeHeaderWithLocation(loc,$scope.params.procID,$scope.proceduretitle,'',$window.innerWidth);  
    });
});


