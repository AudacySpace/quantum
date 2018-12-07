quantum.controller('sectionCtrl', function($scope, $routeParams,procedureService,userService,timeService,$interval,$window,dashboardService,$location,$uibModal,$mdSidenav) {
	$scope.params = $routeParams;
	$scope.role = userService.userRole;
    $scope.name = userService.getUserName();
    $scope.usernamerole =  $scope.name +"("+$scope.role.cRole.callsign+")";

    $scope.steps = [];
    $scope.inputStepValues = [];

    $scope.tempValues = [];
    $scope.locks = dashboardService.getLock();

    $scope.icons = {
        usersicon: {
            'display':'block',
            'float':'right'
        }
    }
    var users;
    $scope.currentRevision = procedureService.getCurrentViewRevision();
    $scope.liveInstanceinterval = "";
    $scope.procedure = procedureService.getProcedureName();
    var mission = 'Quantum';
	viewProcedure();
    $scope.running = true;

    $scope.openRightNav = function(){
        if($window.innerWidth < 800){
            if ($window.innerWidth < 800){
                $mdSidenav('right').open();
            } else {
                $ctrl.locks.lockRight = !$ctrl.locks.lockRight;
                dashboardService.setRightLock($ctrl.locks.lockRight); 
            }
        }else {
            var curLocation = $location.url();
            var curLocationOp = curLocation.split("/");
            if(curLocationOp.length === 4 ){ //open right sidebar for new instance
                $scope.locks.lockRight = !$scope.locks.lockRight;
                dashboardService.setRightLock($scope.locks.lockRight);
            }else if(curLocationOp.length === 7 && curLocationOp[3] === "runninginstance" ){
                //open right sidebar for active procedure
                $ctrl.locks.lockRight = !$ctrl.locks.lockRight;
                dashboardService.setRightLock($ctrl.locks.lockRight); 
            }else{
                $ctrl.locks.lockRight = false;
                dashboardService.setRightLock($ctrl.locks.lockRight); 
            }
        }
    }

    $scope.updateLiveInstance = function(){
        procedureService.getLiveInstanceData($scope.params.procID,$scope.currentRevision.value).then(function(response){
            if(response.status === 200){
                for(var a=0;a<response.data.Steps.length;a++){
                    $scope.steps[a].Info = response.data.Steps[a].info;
                    if(response.data.Steps[a].hasOwnProperty("recordedValue")){
                       $scope.steps[a].recordedValue = response.data.Steps[a].recordedValue; 
                    }
                    if(response.data.Steps[a].hasOwnProperty("comments")){
                        $scope.steps[a].comments = response.data.Steps[a].comments; 
                    }
                    if($scope.steps[a].Info !== ""){
                        $scope.steps[a].chkval = true;
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

    $scope.updateActiveUsers = function(){
         procedureService.getLiveInstanceData($scope.params.procID,$scope.currentRevision.value).then(function(response){
            if(response.status === 200){
                if(response.data.users){
                    users = userService.setActiveUsers(response.data.users);
                    setActiveUsersRole(users);
                }
            } 
        });
    }

    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
    $scope.activeUsersInterval = $interval($scope.updateActiveUsers,1000);

	function viewProcedure(){
        $scope.inputStepValues = [];
        $scope.tempValues = [];
        procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',$window.innerWidth);
        procedureService.getProcedureList().then(function(response) {
            for(var i=0;i<response.data.length;i++){
                if(response.data[i].procedureID){
                    if(response.data[i].procedureID === $scope.params.procID){
                        $scope.steps = response.data[i].sections;
                        $scope.procedure.name = response.data[i].title;
                        break;
                    }
                }
			}

            for(var a=0;a<$scope.steps.length;a++){
                $scope.inputStepValues.push({
                    snum:$scope.steps[a].Step,
                    ivalue:""
                });

                $scope.tempValues.push({
                    snum:$scope.steps[a].Step,
                    ivalue:"",
                    comments:""
                });
            }
            
            $scope.steps = procedureService.getProcedureSection($scope.steps,$scope.role.cRole.callsign);
            $scope.steps = procedureService.getAllParents($scope.steps); 
            procedureService.setProcedureName($scope.params.procID,$scope.procedure.name,"Live");
    	});
	}

    $scope.showPList = function(id,index,headertype,type){
        if(type.toUpperCase() === procedureService.headindTypeName.toUpperCase()){
            $scope.steps = procedureService.showstepList(id,$scope.steps);
        }
    }

    $scope.setInfo = function(index,stepstatus){
        if($scope.liveInstanceinterval) {
            $interval.cancel($scope.liveInstanceinterval);
            $scope.liveInstanceinterval = null;
        }

        var infotime = "";
        var starttime = "";
        var completetime = "";
        $scope.clock = timeService.getTime();
        if(index === $scope.steps.length-1){
            // call uibModal here
            var messages = {
                confirmMsg: 'Do you want to close this procedure?'
            }
            confirmProcedureUpdate(messages,index);

        }else{
            if(stepstatus === true){
                if($scope.steps[index].contenttype === 'Input' && $scope.inputStepValues[index].ivalue.length > 0){  
                    $scope.steps[index].rowstyle = {
                        rowcolor : {
                            'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                            'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                            'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                            'background-size': '200% 100%',
                            'background-position':'right bottom',
                            'margin-left':'10px',
                            'transition':'all 0.3s linear'
                        }
                    }
                    $scope.steps[index].recordedValue = $scope.inputStepValues[index].ivalue;
                    $scope.tempValues[index].ivalue = "";
                    $scope.steps[index].buttonStatus = "";
                    $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                    infotime = $scope.clock.year+" - "+$scope.clock.utc;

                    procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision.value,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){   
                        //check for step parents and its parents
                        if($scope.steps[index].parent !== ''){
                            var stepSiblings = procedureService.getSiblings(index,$scope.steps,$scope.steps[index].parent);
                            var stepSiblingsInfo = [];
                            for(var a=0;a<stepSiblings.length;a++){
                                if(stepSiblings[a].step.Info && stepSiblings[a].step.Info.length > 0){
                                    stepSiblingsInfo.push(stepSiblings[a]);
                                }
                            }
                            if(stepSiblings.length === stepSiblingsInfo.length){
                                var stepParentIndex = $scope.steps[index].parentIndex;// should be part of procedureSection function
                                $scope.steps[stepParentIndex].recordedValue = '';
                                $scope.tempValues[stepParentIndex].ivalue = "";
                                $scope.steps[stepParentIndex].buttonStatus = "";
                                $scope.steps[stepParentIndex].Info = $scope.clock.utc;
                                var getAllParentsofStepParent = procedureService.getAllParentList(stepParentIndex,$scope.steps);
                                if(getAllParentsofStepParent.length > 0){
                                    getAllParentsofStepParent.push({"parent":$scope.steps[stepParentIndex],"index":stepParentIndex});
    
                                    executeParents(getAllParentsofStepParent); // this function will check all children status and checks parents
                                    if($scope.liveInstanceinterval === null) {
                                        $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                    }
                                }else {
                                    executeParent($scope.steps[stepParentIndex],stepParentIndex);
                                    if($scope.liveInstanceinterval === null) {
                                        $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                    }
                                }

                            }else{
                                if($scope.liveInstanceinterval === null) {
                                    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                }
                            }
                        }else {
                            if($scope.liveInstanceinterval === null) {
                                $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                            }
                        }
                    });

                }else if($scope.steps[index].contenttype === 'Input' && $scope.inputStepValues[index].ivalue.length === 0){  
                    var position = "right";
                    var queryId = "#objectid-"+index;
                    var delay = false;
                    $scope.usermessage = 'Please enter the telemetry value in the field,click Set and then mark the checkbox.';
                    var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay); 

                    $scope.steps[index].chkval = false;  
                    $scope.steps[index].rowstyle = {
                        rowcolor : {backgroundColor:'#e9f6fb'}
                    } 
                    if($scope.liveInstanceinterval === null) {
                        $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                    }                     
                }else if($scope.steps[index].contenttype !== 'Input'){
                    $scope.steps[index].rowstyle = {
                        rowcolor : {
                            'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                            'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                            'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                            'background-size': '200% 100%',
                            'background-position':'right bottom',
                            'margin-left':'10px',
                            'transition':'all 0.3s linear'
                        }
                    }
                    $scope.steps[index].recordedValue = "";
                    $scope.steps[index].buttonStatus = "";
                    $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                    infotime = $scope.clock.year+" - "+$scope.clock.utc;

                    procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision.value,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){   
                        //check for step parents and its parents
                        if($scope.steps[index].parent !== ''){
                            var stepSiblings = procedureService.getSiblings(index,$scope.steps,$scope.steps[index].parent);
                            var stepSiblingsInfo = [];
                            for(var a=0;a<stepSiblings.length;a++){
                                if(stepSiblings[a].step.Info && stepSiblings[a].step.Info.length > 0){
                                    stepSiblingsInfo.push(stepSiblings[a]);
                                }
                            }
                            if(stepSiblings.length === stepSiblingsInfo.length){
                                var stepParentIndex = $scope.steps[index].parentIndex;// should be part of procedureSection function
                                $scope.steps[stepParentIndex].recordedValue = '';
                                $scope.tempValues[stepParentIndex].ivalue = "";
                                $scope.steps[stepParentIndex].buttonStatus = "";
                                $scope.steps[stepParentIndex].Info = $scope.clock.utc;
                                var getAllParentsofStepParent = procedureService.getAllParentList(stepParentIndex,$scope.steps);
                                if(getAllParentsofStepParent.length > 0){
                                    getAllParentsofStepParent.push({"parent":$scope.steps[stepParentIndex],"index":stepParentIndex});
    
                                    executeParents(getAllParentsofStepParent); // this function will check all children status and checks parents
                                    if($scope.liveInstanceinterval === null) {
                                        $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                    }
                                }else {
                                    executeParent($scope.steps[stepParentIndex],stepParentIndex);
                                    if($scope.liveInstanceinterval === null) {
                                        $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                    }
                                }

                            }else{
                                if($scope.liveInstanceinterval === null) {
                                    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                }
                            }
                        }else {
                            if($scope.liveInstanceinterval === null) {
                                $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                            }
                        }
                    });
                }
            
            }else {
                $scope.steps[index].Info = "";
                $scope.steps[index].rowstyle = {
                    rowcolor : {backgroundColor:'#e9f6fb'}
                }
                $scope.inputStepValues[index].ivalue = "";
                if($scope.steps[index].recordedValue) {
                    $scope.steps[index].recordedValue = "";
                }
                infotime = $scope.clock.year+" - "+$scope.clock.utc;

                //get step
                //remove status for its parent and its parents

                procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision.value,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){   
                    //check for step parents and its parents
                    if($scope.steps[index].parent !== ''){
                        var stepParentIndex = $scope.steps[index].parentIndex;// should be part of procedureSection function
                        $scope.steps[stepParentIndex].recordedValue = '';
                        $scope.tempValues[stepParentIndex].ivalue = "";
                        $scope.steps[stepParentIndex].buttonStatus = "";
                        $scope.steps[stepParentIndex].Info = "";
                        var getAllParentsofStepParent = procedureService.getAllParentTree(stepParentIndex,$scope.steps);
                        getAllParentsofStepParent.push({"parent":$scope.steps[stepParentIndex],"index":stepParentIndex});
                        removeParentsStatus(getAllParentsofStepParent); // this function will check all children status and checks parents
                        if($scope.liveInstanceinterval === null) {
                            $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                        }
                    }else {
                        if($scope.liveInstanceinterval === null) {
                            $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                        }
                    }
                });
            }
        }
    }

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel($scope.liveInstanceinterval);
            $interval.cancel($scope.activeUsersInterval);    
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

        }
    }

    $scope.$on('$locationChangeStart', function(evnt, next, current){ 
        var loc = $location.url();
        var revNumOp = loc.split("/");
        var emailaddress = userService.getUserEmail();
        var name = userService.getUserName();
        var currentRevision;
        var status;

        if(revNumOp.length === 2 || revNumOp.length === 5){
            var procRev = procedureService.getCurrentViewRevision();
            currentRevision = procRev.value;
            status = false;
            procedureService.setUserStatus(loc,emailaddress,name,$scope.params.procID,currentRevision,status).then(function(response){
                if(response.status === 200){
                    dashboardService.changeHeaderWithLocation(loc,$scope.params.procID,$scope.procedure.name,$scope.currentRevision.value,$window.innerWidth);   
                }
            },function(error){
            }); 
        }
    });

    $scope.updateInputValue = function(index,value){
        if(value.length > 0){
            $scope.inputStepValues[index].ivalue = value;
            $scope.steps[index].buttonStatus = {backgroundColor:'#07D1EA',color:'#fff',outline: 0};
        }else {
            var position = "left";
            var queryId = "#object-"+index;
            var delay = false;
            $scope.usermessage = 'Please enter value and then click Set';
            var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
        }
    }

    $scope.whenTyping = function(index){
        $scope.steps[index].buttonStatus = {outline: 0};
    }

    $scope.whenTypingComments = function(index){
        $scope.tempValues[index].comments = $scope.steps[index].comments;
    }

    $scope.saveComments = function(comments,index){
        $scope.clock = timeService.getTime();
        var commentTime = $scope.clock.year+" - "+$scope.clock.utc;
        if($scope.liveInstanceinterval) {
            $interval.cancel($scope.liveInstanceinterval);
            $scope.liveInstanceinterval = null;
        }
        procedureService.setComments($scope.params.procID,$scope.currentRevision.value,index,comments,commentTime).then(function(response){
            $scope.steps[index].comments = comments;
            $scope.tempValues[index].comments = "";
            if($scope.liveInstanceinterval === null) {
                $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
            }
        });
    }

    function confirmProcedureUpdate(messages,index){
         //Ask user to update or not
        $uibModal.open({
            templateUrl: './js/components/procedures/userConfirmation.html',
            controller: 'confirmCtrl',
            controllerAs: '$ctrl',
            resolve: {
                usermessage: messages,
                filedata:{}
            },
            backdrop: 'static',
            keyboard: false
        }).result.then(function(response,status){
            //handle modal close with response
            $scope.steps[index].rowstyle = {
                rowcolor : {
                    'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                    'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                    'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                    'background-size': '200% 100%',
                    'background-position':'right bottom',
                    'margin-left':'10px',
                    'transition':'all 0.3s linear'
                }
            };
            $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
            infotime = $scope.clock.year+" - "+$scope.clock.utc;

            procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision.value,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){
                if(response.status === 200){
                    completetime = $scope.clock.year+" - "+$scope.clock.utc;
                    if($scope.steps[index].parent !== ''){
                        var stepSiblings = procedureService.getSiblings(index,$scope.steps,$scope.steps[index].parent);
                        var stepSiblingsInfo = [];
                        for(var a=0;a<stepSiblings.length;a++){
                            if(stepSiblings[a].step.Info && stepSiblings[a].step.Info.length > 0){
                                stepSiblingsInfo.push(stepSiblings[a]);
                            }
                        }
                        if(stepSiblings.length === stepSiblingsInfo.length){
                            var stepParentIndex = $scope.steps[index].parentIndex;// should be part of procedureSection function
                            $scope.steps[stepParentIndex].recordedValue = '';
                            $scope.tempValues[stepParentIndex].ivalue = "";
                            $scope.steps[stepParentIndex].buttonStatus = "";
                            $scope.steps[stepParentIndex].Info = $scope.clock.utc;
                            var getAllParentsofStepParent = procedureService.getAllParentList(stepParentIndex,$scope.steps);
                            if(getAllParentsofStepParent.length > 0){
                                getAllParentsofStepParent.push({"parent":$scope.steps[stepParentIndex],"index":stepParentIndex});
                                lastStepexecuteParents(getAllParentsofStepParent,index,completetime); // this function will check all children status and checks parents

                            }else {
                                lastStepexecuteParent($scope.steps[stepParentIndex],stepParentIndex,index,completetime);
                            }
                        }else{
                            procedureService.setInstanceCompleted($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision.value,completetime).then(function(res){
                                if(res.status === 200){
                                    for(var a=0;a<$scope.steps.length;a++){
                                        $scope.steps[a].status = true;
                                    }
                                    procedureService.setProcedureName($scope.params.procID,res.data.title,"AS-Run Archive");
                                    procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
                                }

                                if($scope.liveInstanceinterval === null) {
                                    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                                }
                            });
                        }
                    }else {
                        procedureService.setInstanceCompleted($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision.value,completetime).then(function(res){
                            if(res.status === 200){
                                for(var a=0;a<$scope.steps.length;a++){
                                    $scope.steps[a].status = true;
                                }
                                procedureService.setProcedureName($scope.params.procID,res.data.title,"AS-Run Archive");
                                procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
                            }

                            if($scope.liveInstanceinterval === null) {
                                $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                            }
                        });
                    }
                }
            });
            
        },function () {
            //handle modal dismiss
            // if close procedure confirmation is cancelled
            $scope.steps[index].chkval = false;
            if($scope.liveInstanceinterval === null) {
                $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
            }
        });
    }

    $scope.$watch('role.cRole',function(newvalue,oldvalue){
        $scope.steps = procedureService.getStepPermissions($scope.steps,newvalue.callsign);
    });

    function setActiveUsersRole(activeUsers){
        //function to get current roles of all the online users
        userService.getUsersCurrentRole(mission).then(function(response) {
            if(response.status == 200){
                for(var i=0;i<activeUsers.length;i++){
                    for(var j=0;j<response.data.length;j++){
                        if(activeUsers[i].status === true && activeUsers[i].email === response.data[j].google.email){
                            activeUsers[i].role = response.data[j].missions[0].currentRole;
                        }
                    }
                }
                userService.setOnlineUsers(activeUsers);
            }
        });  
    }

    function executeParents(parentsArray){
        for(i=0;i<parentsArray.length;i++){
            if($scope.steps[parentsArray[i].index].headertype === 'mainheader'){
                $scope.steps[parentsArray[i].index].rowstyle = {
                    rowcolor : {
                        'background':'-moz-linear-gradient(right, transparent 50%, #bee4f3 50%), linear-gradient(#9fdf9f, #9fdf9f)',
                        'background':'-o-linear-gradient(right, transparent 50%, #bee4f3 50%), linear-gradient(#9fdf9f, #9fdf9f)',
                        'background':'linear-gradient(to left, transparent 50%, #bee4f3 50%), linear-gradient(#9fdf9f, #9fdf9f)',
                        'background-size': '200% 100%',
                        'background-position':'right bottom',
                        'margin-left':'10px',
                        'transition':'all 0.3s linear'
                    }
                }
            }else if($scope.steps[parentsArray[i].index].headertype === 'subheader'){
                $scope.steps[parentsArray[i].index].rowstyle = {
                    rowcolor : {
                        'background':'-moz-linear-gradient(right, transparent 50%, #d4edf7 50%), linear-gradient(#b3e6b3, #b3e6b3)',
                        'background':'-o-linear-gradient(right, transparent 50%, #d4edf7 50%), linear-gradient(#b3e6b3, #b3e6b3)',
                        'background':'linear-gradient(to left, transparent 50%, #d4edf7 50%), linear-gradient(#b3e6b3, #b3e6b3)',
                        'background-size': '200% 100%',
                        'background-position':'right bottom',
                        'margin-left':'10px',
                        'transition':'all 0.3s linear'
                    }
                }
            }else if($scope.steps[parentsArray[i].index].headertype === 'listitem'){
                $scope.steps[parentsArray[i].index].rowstyle = {
                    rowcolor : {
                        'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                        'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                        'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                        'background-size': '200% 100%',
                        'background-position':'right bottom',
                        'margin-left':'10px',
                        'transition':'all 0.3s linear'
                    }
                }
            }
            // $scope.steps[parentsArray[i].index].rowstyle = {
            //     rowcolor : {
            //         'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
            //         'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
            //         'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
            //         'background-size': '200% 100%',
            //         'background-position':'right bottom',
            //         'margin-left':'10px',
            //         'transition':'all 0.3s linear'
            //     }
            // }
            $scope.steps[parentsArray[i].index].recordedValue = "";
            $scope.steps[parentsArray[i].index].buttonStatus = "";
            $scope.steps[parentsArray[i].index].Info = $scope.clock.utc;
            var infotime = $scope.clock.year+" - "+$scope.clock.utc;

        }
        //parentsarray,procedureid,usernamerole,revisionNum,infotime,infostepvalues
        procedureService.setParentsInfo(parentsArray,$scope.params.procID,$scope.usernamerole,$scope.currentRevision.value,infotime,$scope.inputStepValues,$scope.clock.utc).then(function(response){
            if(response){
                if($scope.liveInstanceinterval === null) {
                    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                }
            }
        });
    }

    function removeParentsStatus(parentsArray){
        for(i=0;i<parentsArray.length;i++){
            $scope.steps[parentsArray[i].index].Info = "";
            if($scope.steps[parentsArray[i].index].headertype === 'mainheader'){
                $scope.steps[parentsArray[i].index].rowstyle = {
                    rowcolor : {backgroundColor:'#bee4f3'}
                }
            }else if($scope.steps[parentsArray[i].index].headertype === 'subheader'){
                $scope.steps[parentsArray[i].index].rowstyle = {
                    rowcolor : {backgroundColor:'#d4edf7'}
                }
            }else if($scope.steps[parentsArray[i].index].headertype === 'listitem'){
                $scope.steps[parentsArray[i].index].rowstyle = {
                    rowcolor : {backgroundColor:'#e9f6fb'}
                }
            }
            // $scope.steps[parentsArray[i].index].rowstyle = {
            //     rowcolor : {backgroundColor:'#e9f6fb'}
            // }
            $scope.inputStepValues[parentsArray[i].index].ivalue = "";
            if($scope.steps[parentsArray[i].index].recordedValue) {
                $scope.steps[parentsArray[i].index].recordedValue = "";
            }
            var infotime = $scope.clock.year+" - "+$scope.clock.utc;
            var info = "";

        }
        //parentsarray,procedureid,usernamerole,revisionNum,infotime,infostepvalues
        procedureService.setParentsInfo(parentsArray,$scope.params.procID,$scope.usernamerole,$scope.currentRevision.value,infotime,$scope.inputStepValues,info).then(function(response){
            if(response){
                if($scope.liveInstanceinterval === null) {
                    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                }
            }
        });
    }

    function executeParent(parent,index){
        if($scope.steps[index].headertype === 'mainheader'){
            $scope.steps[index].rowstyle = {
                rowcolor : {
                    'background':'-moz-linear-gradient(right, transparent 50%, #bee4f3 50%), linear-gradient(#9fdf9f, #9fdf9f)',
                    'background':'-o-linear-gradient(right, transparent 50%, #bee4f3 50%), linear-gradient(#9fdf9f, #9fdf9f)',
                    'background':'linear-gradient(to left, transparent 50%, #bee4f3 50%), linear-gradient(#9fdf9f, #9fdf9f)',
                    'background-size': '200% 100%',
                    'background-position':'right bottom',
                    'margin-left':'10px',
                    'transition':'all 0.3s linear'
                }
            };
        }else if($scope.steps[index].headertype === 'subheader'){
            $scope.steps[index].rowstyle = {
                rowcolor : {
                    'background':'-moz-linear-gradient(right, transparent 50%, #d4edf7 50%), linear-gradient(#b3e6b3, #b3e6b3)',
                    'background':'-o-linear-gradient(right, transparent 50%, #d4edf7 50%), linear-gradient(#b3e6b3, #b3e6b3)',
                    'background':'linear-gradient(to left, transparent 50%, #d4edf7 50%), linear-gradient(#b3e6b3, #b3e6b3)',
                    'background-size': '200% 100%',
                    'background-position':'right bottom',
                    'margin-left':'10px',
                    'transition':'all 0.3s linear'
                }
            };
        }else if($scope.steps[index].headertype === 'listitem'){
            $scope.steps[index].rowstyle = {
                rowcolor : {
                    'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                    'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                    'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                    'background-size': '200% 100%',
                    'background-position':'right bottom',
                    'margin-left':'10px',
                    'transition':'all 0.3s linear'
                }
            };
        }
        // $scope.steps[index].rowstyle = {
        //     rowcolor : {
        //         'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
        //         'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
        //         'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
        //         'background-size': '200% 100%',
        //         'background-position':'right bottom',
        //         'margin-left':'10px',
        //         'transition':'all 0.3s linear'
        //     }
        // };
        $scope.steps[index].recordedValue = "";
        $scope.steps[index].buttonStatus = "";
        $scope.steps[index].Info = $scope.clock.utc;
        infotime = $scope.clock.year+" - "+$scope.clock.utc;
        procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision.value,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){   
            if(response){
                if($scope.liveInstanceinterval === null) {
                    $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                }

            }
        });

    }

    function lastStepexecuteParents(parentsArray,index,completetime){
        for(i=0;i<parentsArray.length;i++){
            if($scope.steps[parentsArray[i].index].headertype === 'mainheader'){
                $scope.steps[parentsArray[i].index].rowstyle = {
                    rowcolor : {
                        'background':'-moz-linear-gradient(right, transparent 50%, #bee4f3 50%), linear-gradient(#9fdf9f, #9fdf9f)',
                        'background':'-o-linear-gradient(right, transparent 50%, #bee4f3 50%), linear-gradient(#9fdf9f, #9fdf9f)',
                        'background':'linear-gradient(to left, transparent 50%, #bee4f3 50%), linear-gradient(#9fdf9f, #9fdf9f)',
                        'background-size': '200% 100%',
                        'background-position':'right bottom',
                        'margin-left':'10px',
                        'transition':'all 0.3s linear'
                    }
                };

            }else if($scope.steps[parentsArray[i].index].headertype === 'subheader'){
                $scope.steps[parentsArray[i].index].rowstyle = {
                    rowcolor : {
                        'background':'-moz-linear-gradient(right, transparent 50%, #d4edf7 50%), linear-gradient(#b3e6b3, #b3e6b3)',
                        'background':'-o-linear-gradient(right, transparent 50%, #d4edf7 50%), linear-gradient(#b3e6b3, #b3e6b3)',
                        'background':'linear-gradient(to left, transparent 50%, #d4edf7 50%), linear-gradient(#b3e6b3, #b3e6b3)',
                        'background-size': '200% 100%',
                        'background-position':'right bottom',
                        'margin-left':'10px',
                        'transition':'all 0.3s linear'
                    }
                };

            }else if($scope.steps[parentsArray[i].index].headertype === 'listitem'){
                $scope.steps[parentsArray[i].index].rowstyle = {
                    rowcolor : {
                        'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                        'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                        'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                        'background-size': '200% 100%',
                        'background-position':'right bottom',
                        'margin-left':'10px',
                        'transition':'all 0.3s linear'
                    }
                };

            }
            // $scope.steps[parentsArray[i].index].rowstyle = {
            //     rowcolor : {
            //         'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
            //         'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
            //         'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
            //         'background-size': '200% 100%',
            //         'background-position':'right bottom',
            //         'margin-left':'10px',
            //         'transition':'all 0.3s linear'
            //     }
            // }
            $scope.steps[parentsArray[i].index].recordedValue = "";
            $scope.steps[parentsArray[i].index].buttonStatus = "";
            $scope.steps[parentsArray[i].index].Info = $scope.clock.utc;
            var infotime = $scope.clock.year+" - "+$scope.clock.utc;

        }
        //parentsarray,procedureid,usernamerole,revisionNum,infotime,infostepvalues
        procedureService.setParentsInfo(parentsArray,$scope.params.procID,$scope.usernamerole,$scope.currentRevision.value,infotime,$scope.inputStepValues,$scope.clock.utc).then(function(response){
            if(response){
                procedureService.setInstanceCompleted($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision.value,completetime).then(function(res){
                    if(res.status === 200){
                        for(var a=0;a<$scope.steps.length;a++){
                            $scope.steps[a].status = true;
                        }
                        procedureService.setProcedureName($scope.params.procID,res.data.title,"AS-Run Archive");
                        procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
                    }
                    if($scope.liveInstanceinterval === null) {
                        $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                    }
                });
            }
        });
    }

    function lastStepexecuteParent(parent,index,stepindex,completetime){
        if($scope.steps[index].headertype === 'mainheader'){
            $scope.steps[index].rowstyle = {
                rowcolor : {
                    'background':'-moz-linear-gradient(right, transparent 50%, #bee4f3 50%), linear-gradient(#9fdf9f, #9fdf9f)',
                    'background':'-o-linear-gradient(right, transparent 50%, #bee4f3 50%), linear-gradient(#9fdf9f, #9fdf9f)',
                    'background':'linear-gradient(to left, transparent 50%, #bee4f3 50%), linear-gradient(#9fdf9f, #9fdf9f)',
                    'background-size': '200% 100%',
                    'background-position':'right bottom',
                    'margin-left':'10px',
                    'transition':'all 0.3s linear'
                }
            }
        }else if($scope.steps[index].headertype === 'subheader'){
            $scope.steps[index].rowstyle = {
                rowcolor : {
                    'background':'-moz-linear-gradient(right, transparent 50%, #d4edf7 50%), linear-gradient(#b3e6b3, #b3e6b3)',
                    'background':'-o-linear-gradient(right, transparent 50%, #d4edf7 50%), linear-gradient(#b3e6b3, #b3e6b3)',
                    'background':'linear-gradient(to left, transparent 50%, #d4edf7 50%), linear-gradient(#b3e6b3, #b3e6b3)',
                    'background-size': '200% 100%',
                    'background-position':'right bottom',
                    'margin-left':'10px',
                    'transition':'all 0.3s linear'
                }
            }
        }else if($scope.steps[index].headertype === 'listitem'){
            $scope.steps[index].rowstyle = {
                rowcolor : {
                    'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                    'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                    'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
                    'background-size': '200% 100%',
                    'background-position':'right bottom',
                    'margin-left':'10px',
                    'transition':'all 0.3s linear'
                }
            };
        }
        // $scope.steps[index].rowstyle = {
        //     rowcolor : {
        //         'background':'-moz-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
        //         'background':'-o-linear-gradient(right, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
        //         'background':'linear-gradient(to left, transparent 50%, #e9f6fb 50%), linear-gradient(#c6ecc6, #c6ecc6)',
        //         'background-size': '200% 100%',
        //         'background-position':'right bottom',
        //         'margin-left':'10px',
        //         'transition':'all 0.3s linear'
        //     }
        // };
        $scope.steps[index].recordedValue = "";
        $scope.steps[index].buttonStatus = "";
        $scope.steps[index].Info = $scope.clock.utc;
        infotime = $scope.clock.year+" - "+$scope.clock.utc;
        procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision.value,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){   
            if(response){
                procedureService.setInstanceCompleted($scope.steps[stepindex].Info,$scope.params.procID,stepindex,$scope.usernamerole,$scope.currentRevision.value,completetime).then(function(res){
                    if(res.status === 200){
                        for(var a=0;a<$scope.steps.length;a++){
                            $scope.steps[a].status = true;
                        }
                        procedureService.setProcedureName($scope.params.procID,res.data.title,"AS-Run Archive");
                        procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
                    }
                    if($scope.liveInstanceinterval === null) {
                        $scope.liveInstanceinterval = $interval($scope.updateLiveInstance, 5000);
                    }
                });

            }
        });
    }

});


