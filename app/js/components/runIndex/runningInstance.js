quantum.controller('runningInstanceCtrl', function($scope,procedureService,$routeParams,userService,timeService,$interval,$window,dashboardService,$location,$uibModal,$mdSidenav) {
    $scope.params = $routeParams;
    $scope.role = userService.userRole;
    $scope.name = userService.getUserName();
    $scope.usernamerole =  $scope.name +"("+$scope.role.cRole.callsign+")";

    $scope.steps = [];
    $scope.inputStepValues = [];

    $scope.tempValues = [];
    $scope.locks = dashboardService.getLock();
    $scope.currentRevision = parseInt($scope.params.revisionID);
    procedureService.setCurrentViewRevision($scope.currentRevision);
    $scope.liveInstanceinterval = "";
    var mission = 'Quantum';
    $scope.procedure = procedureService.getProcedureName();
    $scope.icons = {
        usersicon: {
            'display':'block',
            'float':'right'
        }
    }
    var users;
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
               $scope.locks.lockRight = !$scope.locks.lockRight;
                dashboardService.setRightLock($scope.locks.lockRight); 
            }else{
                $scope.locks.lockRight = false;
                dashboardService.setRightLock($scope.locks.lockRight); 
            }
        }
    }

    $scope.updateLiveInstance = function(){
        procedureService.getLiveInstanceData($scope.params.procID,$scope.currentRevision).then(function(response){
            if(response.status === 200){
                if(response.data.Steps){
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
                            //$scope.steps = procedureService.openNextSteps($scope.steps,a);
                        }
                    }

                    // var users = setActiveUsers(response.data.users);
                    // var usersroles = setActiveUsersRole(users);

                    $scope.steps = procedureService.getCompletedSteps($scope.steps);
                    if($scope.steps[$scope.steps.length-1].Info !== ""){
                        procedureService.setProcedureName($scope.params.procID,$scope.procedure.name,"AS-Run Archive");
                        procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
                    }

                }else {

                }
            }
        });
    }

    $scope.updateActiveUsers = function(){
         procedureService.getLiveInstanceData($scope.params.procID,$scope.currentRevision).then(function(response){
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
        procedureService.setProcedureName($scope.params.procID,$scope.procedure.name,"Live");
        procedureService.getProcedureList().then(function(response) {
            if(response.status === 200){
                for(var i=0;i<response.data.length;i++){
                    if(response.data[i].procedureID === $scope.params.procID){
                        for(var a=0;a<response.data[i].instances.length;a++){
                            if(response.data[i].instances[a].revision === parseInt($scope.params.revisionID)){
                                $scope.instances = response.data[i].instances[a];
                                $scope.steps = $scope.instances.Steps;
                            }
                        }

                        var newVersion = response.data[i].versions[parseInt($scope.params.versionID) - 1];
                        // for(var b=0;b<response.data[i].sections.length;b++){
                        //     if($scope.steps[b].step === response.data[i].sections[b].Step){
                        //         $scope.steps[b].Step = response.data[i].sections[b].Step
                        //         $scope.steps[b].Type = response.data[i].sections[b].Type;
                        //         $scope.steps[b].Content = response.data[i].sections[b].Content;
                        //         $scope.steps[b].Role = response.data[i].sections[b].Role;
                        //         $scope.steps[b].Reference = response.data[i].sections[b].Reference;
                        //         $scope.steps[b].Info = $scope.steps[b].info;

                        //         $scope.inputStepValues.push({
                        //             snum:$scope.steps[b].Step,
                        //             ivalue:""
                        //         });

                        //         $scope.tempValues.push({
                        //             snum:$scope.steps[b].Step,
                        //             ivalue:"",
                        //             comments:""
                        //         });
                        //     }
                        // }

                        for(var b=0;b<newVersion.length;b++){
                            if($scope.steps[b].step === newVersion[b].Step){
                                $scope.steps[b].Step = newVersion[b].Step
                                $scope.steps[b].Type = newVersion[b].Type;
                                $scope.steps[b].Content = newVersion[b].Content;
                                $scope.steps[b].Role = newVersion[b].Role;
                                if(newVersion[b].hasOwnProperty("Reference") && newVersion[b].Reference.length > 0){
                                   $scope.steps[b].Reference = newVersion[b].Reference; 
                                }
                                $scope.steps[b].Info = $scope.steps[b].info;

                                $scope.inputStepValues.push({
                                    snum:$scope.steps[b].Step,
                                    ivalue:""
                                });

                                $scope.tempValues.push({
                                    snum:$scope.steps[b].Step,
                                    ivalue:"",
                                    comments:""
                                });
                            }
                        }
                        break;
                    }
                }
            }
            $scope.steps = procedureService.getProcedureSection($scope.steps,$scope.role.cRole.callsign);
            $scope.steps = procedureService.getAllParents($scope.steps);
            //$scope.steps = procedureService.openFirstStep($scope.steps,$scope.role.cRole.callsign);
            //completed steps
            $scope.steps = procedureService.getCompletedSteps($scope.steps);

            for(var a=0;a<$scope.steps.length;a++){
                if($scope.steps[a].Info !== ""){
                    $scope.steps = procedureService.openNextSteps($scope.steps,a);
                }
            }
        });
    }

    $scope.showPList = function(id,index,headertype,type){
       // $scope.steps = procedureService.showPList(id,index,headertype,$scope.steps);
        if(type === 'Heading'){
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

                    procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){   
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
                    $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                    infotime = $scope.clock.year+" - "+$scope.clock.utc;

                    procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){   
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
            }else{
                $scope.steps[index].Info = "";
                $scope.steps[index].rowstyle = {
                    rowcolor : {backgroundColor:'#e9f6fb'}
                    }
                $scope.inputStepValues[index].ivalue = "";
                if($scope.steps[index].recordedValue) {
                    $scope.steps[index].recordedValue = "";
                }
                $scope.steps[index].buttonStatus = "";
                infotime = $scope.clock.year+" - "+$scope.clock.utc;


                //get step
                //remove status for its parent and its parents

                procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){   
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
                    dashboardService.changeHeaderWithLocation(loc,$scope.params.procID,$scope.procedure.name,$scope.params.revisionID,$window.innerWidth); 
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
        procedureService.setComments($scope.params.procID,$scope.params.revisionID,index,comments,commentTime).then(function(response){
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
                procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){
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
                            procedureService.setInstanceCompleted($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,completetime).then(function(res){
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
                        procedureService.setInstanceCompleted($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,completetime).then(function(res){
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
            $scope.steps[parentsArray[i].index].recordedValue = "";
            $scope.steps[parentsArray[i].index].buttonStatus = "";
            $scope.steps[parentsArray[i].index].Info = $scope.clock.utc;
            var infotime = $scope.clock.year+" - "+$scope.clock.utc;

        }
        //parentsarray,procedureid,usernamerole,revisionNum,infotime,infostepvalues
        procedureService.setParentsInfo(parentsArray,$scope.params.procID,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues,$scope.clock.utc).then(function(response){
            if(response){
                // console.log("Parents status saved!");
            }
        });
    }

    function removeParentsStatus(parentsArray){
        for(i=0;i<parentsArray.length;i++){
            $scope.steps[parentsArray[i].index].Info = "";
            $scope.steps[parentsArray[i].index].rowstyle = {
                rowcolor : {backgroundColor:'#e9f6fb'}
            }
            $scope.inputStepValues[parentsArray[i].index].ivalue = "";
            if($scope.steps[parentsArray[i].index].recordedValue) {
                $scope.steps[parentsArray[i].index].recordedValue = "";
            }
            var infotime = $scope.clock.year+" - "+$scope.clock.utc;
            var info = "";

        }
        //parentsarray,procedureid,usernamerole,revisionNum,infotime,infostepvalues
        procedureService.setParentsInfo(parentsArray,$scope.params.procID,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues,info).then(function(response){
            if(response){
                // console.log("Parents status removed!");
            }
        });
    }

    function executeParent(parent,index){
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
        $scope.steps[index].Info = $scope.clock.utc;
        infotime = $scope.clock.year+" - "+$scope.clock.utc;
        procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){   
            if(response){
                // console.log("Parent status saved!");
                //getItsParents
                //check if all its siblings are complete 
                //get parents with siblings complete
                //add info to these parents

            }
        });

    }

    function noexecuteParent(parent,index){
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
        $scope.steps[index].Info = "";
        infotime = $scope.clock.year+" - "+$scope.clock.utc;
        procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){   
            if(response){
                // console.log("Parent status saved!");
                //getItsParents
                //check if all its siblings are complete 
                //get parents with siblings complete
                //add info to these parents

            }
        });

    }

    function lastStepexecuteParents(parentsArray,index,completetime){
        for(i=0;i<parentsArray.length;i++){
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
            $scope.steps[parentsArray[i].index].recordedValue = "";
            $scope.steps[parentsArray[i].index].buttonStatus = "";
            $scope.steps[parentsArray[i].index].Info = $scope.clock.utc;
            var infotime = $scope.clock.year+" - "+$scope.clock.utc;

        }
        //parentsarray,procedureid,usernamerole,revisionNum,infotime,infostepvalues
        procedureService.setParentsInfo(parentsArray,$scope.params.procID,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues,$scope.clock.utc).then(function(response){
            if(response){
                // console.log("Parents status saved!");
                procedureService.setInstanceCompleted($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,completetime).then(function(res){
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
        $scope.steps[index].Info = $scope.clock.utc;
        infotime = $scope.clock.year+" - "+$scope.clock.utc;
        procedureService.setInfo($scope.steps[index].Info,$scope.params.procID,index,$scope.usernamerole,$scope.currentRevision,infotime,$scope.inputStepValues[index].ivalue,$scope.steps[index].contenttype).then(function(response){   
            if(response){
                // console.log("Parent status saved!");
                //getItsParents
                //check if all its siblings are complete 
                //get parents with siblings complete
                //add info to these parents

                procedureService.setInstanceCompleted($scope.steps[stepindex].Info,$scope.params.procID,stepindex,$scope.usernamerole,$scope.currentRevision,completetime).then(function(res){
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


