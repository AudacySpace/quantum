quantum.controller('archivedIndexCtrl', function($scope,procedureService,$routeParams,$window,dashboardService,$location,userService,$rootScope) {
    $scope.params = $routeParams;
    $scope.sortType     = 'completedAt'; // set the default sort type
    $scope.sortReverse  = true;  // set the default sort order
    $scope.archivedlist = [];
    $scope.loadcount = 0;
    $scope.loadstatus = true;
    $scope.procedure = procedureService.getProcedureName();
    $rootScope.title = "Archive Index - "+$scope.procedure.id+" | Quantum";
    dashboardService.setHeaderLocation($location.url,true,false,false);
    showArchivedList();

    //Function to fetch archived procedure instances and set header color and display procedure name
    // loadcount scope variable is used to check for the response from the database 
        // and stop the loading image when it received some response
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

    //locationChangeStart is used to check the change the url when using browser back and forward buttons
    // and change the header based on the url location 
    $scope.$on('$locationChangeStart', function(evnt, next, current){  
        var loc = $location.url();
        var revNumOp = loc.split("/");
        var emailaddress = userService.getUserEmail();
        var name = userService.getUserName();
        var currentRevision;
        var status;

        // the url for archived instance
        if(revNumOp.length === 7 && revNumOp[3] === "archivedinstance"){
            $rootScope.title ="Procedure "+$scope.procedure.id+" | Quantum";
            $scope.params.procID = revNumOp[4];
            currentRevision = parseInt(revNumOp[6]); //get revision number from url
            status = true;
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

    //Function to set header styles and add title to the header of the dashboard
    $scope.changeColor = function(status,pid,ptitle){
        if(status === "Live"){
            procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"Open Procedure");

        }else if(status === "Archived") {
            procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"AS-Run Archive");

        }
    }
});


