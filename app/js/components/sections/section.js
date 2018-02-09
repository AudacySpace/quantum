quantum.controller('sectionCtrl', function($scope, $routeParams,procedureService,userService,timeService,$interval,$window) {
	$scope.params = $routeParams;
	$scope.role = userService.userRole;
    $scope.name = userService.getUserName();
    $scope.usernamerole =  $scope.name +"("+$scope.role.cRole.callsign+")";

    $scope.clock = {
        utc : "000.00.00.00 UTC"
    }

    $scope.updateClock = function(){
  		$scope.clock = timeService.getTime(0);
  	}

    $scope.interval = $interval($scope.updateClock, 500);
    var currentRevision;
    $scope.liveInstanceinterval = "";
    $scope.procedure = procedureService.getProcedureName();
	viewProcedure();

    function updateLiveInstance(){
        procedureService.getLiveInstanceData($scope.params.procID,currentRevision).then(function(response){
            if(response.status === 200){
                for(var a=0;a<response.data.Steps.length;a++){
                    $scope.steps[a].Info = response.data.Steps[a].info;
                    if($scope.steps[a].Info !== ""){
                        $scope.steps[a].chkval = true;
                        $scope.steps = procedureService.openNextSteps($scope.steps,a);
                    }
                }
                $scope.steps = procedureService.getCompletedSteps($scope.steps); 
                if($scope.steps[$scope.steps.length-1].Info !== ""){
                    procedureService.setProcedureName($scope.params.procID,$scope.procedure.name,"AS-Run Archive");
                    procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
                }

            }
        });
    }

	function viewProcedure(){
        procedureService.setProcedureName($scope.params.procID,$scope.procedure.name,"Live");
        procedureService.getProcedureList().then(function(response) {
            for(var i=0;i<response.data.length;i++){
                if(parseFloat(response.data[i].procedure.id).toFixed(1) === $scope.params.procID){
                   	$scope.steps = response.data[i].procedure.sections;
				}
			}
            $scope.steps = procedureService.getProcedureSection($scope.steps,$scope.role.cRole.callsign);
    	});
	}

    $scope.showPList = function(id,index,headertype){
        $scope.steps = procedureService.showPList(id,index,headertype,$scope.steps);
    }


    $scope.setInfo = function(index,stepstatus){
        var proc = procedureService.archiveThisProcedure($scope.steps); 
        var infotime = "";
        var starttime = "";
        var completetime = "";
        if(index === $scope.steps.length-1 && proc === false){
            alert("All the steps have to be completed to close this procedure!");
                $scope.steps[index].Info = "";
                $scope.steps[index].rowstyle = {
                    rowcolor : {backgroundColor:'#e9f6fb'}
                }
                $scope.steps[index].chkval = false;

        }else if(index === $scope.steps.length-1 && proc === true){
            $scope.steps[index].rowstyle = {
                rowcolor : {backgroundColor:'#c6ecc6'}
            };
            $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
            infotime = $scope.clock.year+" - "+$scope.clock.utc;
            procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,currentRevision,infotime).then(function(response){
                if(response.status === 200){
                    completetime = $scope.clock.year+" - "+$scope.clock.utc;
                    procedureService.setInstanceCompleted($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,currentRevision,completetime).then(function(res){
                        if(res.status === 200){
                            for(var a=0;a<$scope.steps.length;a++){
                                $scope.steps[a].status = true;
                            }
                            procedureService.setProcedureName($scope.params.procID,res.data.procedure.title,"AS-Run Archive");
                            procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
                        }
                    });
                }
            });

        }else{
            if(stepstatus === true){
                $scope.steps[index].rowstyle = {
                    rowcolor : {backgroundColor:'#c6ecc6'}
                }
                var stepInfoStatus = procedureService.checkIfEmpty($scope.steps);
                if(stepInfoStatus === true){
                    starttime = $scope.clock.year+" - "+$scope.clock.utc;
                    procedureService.saveProcedureInstance($scope.params.procID,$scope.usernamerole,starttime).then(function(response){
                        if(response.status === 200){
                            currentRevision = response.data.revision;
                            $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                            infotime = $scope.clock.year+" - "+$scope.clock.utc;
                            procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,response.data.revision,infotime).then(function(resp){
                                if(resp.status === 200){
                                    $scope.steps = procedureService.openNextSteps($scope.steps,index);
                                    $scope.liveInstanceinterval = $interval(updateLiveInstance, 1000);
                                }
                            });
                        }
                    });
                        
                }else{
                    $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                    infotime = $scope.clock.year+" - "+$scope.clock.utc;
                    procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,currentRevision,infotime);
                    $scope.steps = procedureService.openNextSteps($scope.steps,index);
                }
            }else{
                $scope.steps[index].Info = "";
                $scope.steps[index].rowstyle = {
                    rowcolor : {backgroundColor:'#e9f6fb'}
                    }
                infotime = $scope.clock.year+" - "+$scope.clock.utc;
                procedureService.setInfo("",$scope.params.procID,index,$scope.usernamerole,currentRevision,infotime);
            }
        }
    }

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel( $scope.interval );
            $interval.cancel($scope.liveInstanceinterval);
        }
    );
});


