quantum.controller('runIndexCtrl', function($scope,procedureService,$routeParams,$window,dashboardService,$location,userService,$rootScope,$route) {
    $scope.params = $routeParams; // gets parameters in the url route
    $scope.sortType = 'startedAt'; // set the default sort type
    $scope.sortReverse = true;  // set the default sort order
    $scope.livelist = [];
    $scope.loadcount = 0;
    $scope.loadstatus = true;
    $scope.procedure = procedureService.getProcedureName();
    $rootScope.title = "Live Index - "+$scope.procedure.id+" | Quantum";

    //Function to set the display status of live index , archive index and user list based on the url
    dashboardService.setHeaderLocation($location.url,false,true,false);
    showRunningList();

    //Function to fetch active procedure instances and set header color and display procedure name
    // loadcount scope variable is used to check for the response from the database 
    // and stop the loading image when it received some response
    function showRunningList(){
        if($scope.loadcount === 0){
            $scope.loadstatus = true;
        }
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
            $scope.loadstatus = false;
            $scope.loadcount++;
        });
    }

    //locationChangeStart is used to check the change the url when using browser back and forward buttons
    // and change the header based on the url location 
    $scope.$on('$locationChangeStart', function(evnt, next, current){ 
        var loc = $location.url(); 
        var revNumOp = loc.split("/");
        var emailaddress = userService.getUserEmail();
        var name = userService.getUserName();
        var currentRevision;
        var status;
 
        if(revNumOp.length === 7 && revNumOp[3] === "runninginstance"){
            $rootScope.title = "Procedure "+$scope.procedure.id+" | Quantum";
            $scope.params.procID = revNumOp[4];
            currentRevision = parseInt(revNumOp[6]);
            status = true
            procedureService.setCurrentViewRevision(currentRevision);
            procedureService.setUserStatus(loc,emailaddress,name,$scope.params.procID,currentRevision,status).then(function(response){
                if(response.status === 200){
                    dashboardService.changeHeaderWithLocation(loc,$scope.params.procID,$scope.procedure.name,'',$window.innerWidth);
                }
            },function(error){
            }); 
        }else {
            $rootScope.title = "Quantum";
            dashboardService.changeHeaderWithLocation(loc,$scope.params.procID,$scope.procedure.name,'',$window.innerWidth);
        }
    });
});


