quantum.controller('previewInstanceCtrl', function($scope,procedureService,$routeParams,userService,$location,$rootScope,$window,dashboardService) {
    $scope.params = $routeParams;
    $scope.role = userService.userRole;
    $scope.previewSteps = [];
    var mission = 'Quantum';
    $scope.procedure = procedureService.getProcedureName();
    $scope.icons = {
        usersicon: {
            'display':'block',
            'float':'right'
        }
    }

    $rootScope.title = "Procedure "+$scope.params.procID+" | Quantum ";
    viewProcedure();

    function viewProcedure(){
        procedureService.setHeaderStyles('block','none','#ffffff','#000000','none','inline-block',$window.innerWidth);
        procedureService.getProcedureList().then(function(response) {
            if(response.status === 200){
                for(var i=0;i<response.data.length;i++){
                    if(response.data[i].procedureID === $scope.params.procID){
                        for(var a=0;a<response.data[i].instances.length;a++){
                            $scope.previewSteps = response.data[i].sections;
                            $scope.procedure.name = response.data[i].title;
                        }
                        break;
                    }
                }
            }
            procedureService.setProcedureName($scope.params.procID,$scope.procedure.name,"Preview");
            $scope.previewSteps = procedureService.getProcedureSection($scope.previewSteps,$scope.role.cRole.callsign);
        });
    }

    $scope.showPList = function(id,index,headertype){
        $scope.previewSteps = procedureService.showPList(id,index,headertype,$scope.previewSteps);
    }

    $scope.$on("$destroy", 
        function(event) {
        }
    );

    $scope.changeColor = function(status,pid,ptitle){
        if(status === "Live"){
            procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"Open Procedure");
            dashboardService.setRightLock(false); 

        }else if(status === "Archived") {
            procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"AS-Run Archive");
            dashboardService.setRightLock(false); 
        }else if(status === "Preview"){
            procedureService.setHeaderStyles('block','none','#ffffff','#000000','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"Preview Procedure");
        }
    }

    $scope.$on('$locationChangeStart', function(evnt, next, current){ 
        var loc = $location.url();
        var revNumOp = loc.split("/");

        if(revNumOp.length === 2 || revNumOp.length === 5){
            if(revNumOp.length === 2){
                $rootScope.title = "Quantum";
            }else if(revNumOp.length === 5){
                if(revNumOp.includes("running")){
                    $rootScope.title = "Live Index - "+$scope.procedure.id+" | Quantum";
                }else if(revNumOp.includes("archived")){
                    $rootScope.title = "Archive Index - "+$scope.procedure.id+" | Quantum";
                }
            }
            dashboardService.changeHeaderWithLocation(loc,$scope.params.procID,$scope.procedure.name,$scope.params.revisionID,$window.innerWidth);   
        }
    });

});


