quantum.controller('archivedInstanceCtrl', function($scope,procedureService,$routeParams,userService,timeService,$interval) {
    $scope.params = $routeParams;
    $scope.role = userService.userRole;
    $scope.name = userService.getUserName();
    $scope.usernamerole =  $scope.name +"("+$scope.role.cRole.callsign+")";

    var currentRevision = parseInt($scope.params.revisionID);
    
    $scope.procedure = procedureService.getProcedureName();
    viewProcedure();

    function viewProcedure(){
        procedureService.getProcedureList().then(function(response){
            if(response){
                for(var i=0;i<response.data.length;i++){
                    if(response.data[i].procedure.id === $scope.params.procID){
                        procedureService.setProcedureName($scope.params.procID,response.data[i].procedure.title,"AS-Run Archive");
                    }
                }
            }
        });

        procedureService.getProcedureList().then(function(response) {
            for(var i=0;i<response.data.length;i++){
                if(parseFloat(response.data[i].procedure.id).toFixed(1) === $scope.params.procID){
                    for(var a=0;a<response.data[i].archivedinstances.length;a++){
                        if(response.data[i].archivedinstances[a].revision === parseInt($scope.params.revisionID)){
                            $scope.archivedinstances = response.data[i].archivedinstances[a];
                            $scope.steps = $scope.archivedinstances.Steps;
                        }
                    }
                    for(var b=0;b<response.data[i].procedure.sections.length;b++){
                        if($scope.steps[b].step === response.data[i].procedure.sections[b].Step){
                            $scope.steps[b].Step = response.data[i].procedure.sections[b].Step
                            $scope.steps[b].Type = response.data[i].procedure.sections[b].Type;
                            $scope.steps[b].Content = response.data[i].procedure.sections[b].Content;
                            $scope.steps[b].Role = response.data[i].procedure.sections[b].Role;
                            $scope.steps[b].Info = $scope.steps[b].info;
                        }
                    }
                }
            }

            for(var j=0;j<$scope.steps.length;j++){
                if($scope.steps[j].Step.includes(".0") === true && $scope.steps[j].Step.indexOf(".") === $scope.steps[j].Step.lastIndexOf(".")){
                    $scope.steps[j].index = parseFloat($scope.steps[j].Step);
                    $scope.steps[j].class = "fa fa-caret-right";
                    $scope.steps[j].header = true; 
                    $scope.steps[j].headertype = "mainheader";
                    $scope.steps[j].headervalue = $scope.steps[j].Step.split(".")[0];
                    $scope.steps[j].openstatus = true;
                    $scope.steps[j].rowstyle = {
                        rowcolor: {backgroundColor:'#e9f6fb'}
                    };
                    $scope.steps[j].chkval = false;

                }else if($scope.steps[j].Step.includes(".0") === true && $scope.steps[j].Step.indexOf(".") !== $scope.steps[j].Step.lastIndexOf(".")){
                    $scope.steps[j].index = parseFloat($scope.steps[j].Step);
                    $scope.steps[j].class = "fa fa-caret-down";
                    $scope.steps[j].header = true; 
                    $scope.steps[j].headertype = "subheader";
                    $scope.steps[j].headervalue = $scope.steps[j].Step.split(".")[0];
                    $scope.steps[j].openstatus = false;
                    $scope.steps[j].rowstyle = {
                        rowcolor: {
                            backgroundColor:'#e9f6fb'
                        }
                    };
                    $scope.steps[j].chkval = false;
                }else {
                    $scope.steps[j].index = parseFloat($scope.steps[j].Step);
                    $scope.steps[j].class = "fa fa-caret-right"; 
                    $scope.steps[j].header = false;
                    $scope.steps[j].headertype = "listitem";
                    $scope.steps[j].headervalue = $scope.steps[j].Step.split(".")[0];
                    $scope.steps[j].openstatus = false;
                    $scope.steps[j].rowstyle = {
                        rowcolor: {backgroundColor:'#e9f6fb'}
                    };
                        $scope.steps[j].chkval = false;
                }  
            }

            //set type icon 
            for(var k=0;k<$scope.steps.length;k++){
                if($scope.steps[k].Type === "Heading"){

                }else if($scope.steps[k].Type === "Warning"){
                    $scope.steps[k].typeicon = "fa fa-exclamation-triangle";
                }else if($scope.steps[k].Type === "Caution"){
                    $scope.steps[k].typeicon = "fa fa-exclamation-circle";
                }else if($scope.steps[k].Type === "Record"){
                    $scope.steps[k].typeicon = "fa fa-pencil-square-o";
                }else if($scope.steps[k].Type === "Verify"){
                    $scope.steps[k].typeicon = "fa fa-check-circle-o";
                }else if($scope.steps[k].Type === "Action"){
                    $scope.steps[k].typeicon = "fa fa-cog";
                }else if($scope.steps[k].Type === "Decision"){
                    $scope.steps[k].typeicon = "fa fa-dot-circle-o";
                }
            }

            //check for role and disable the steps if not permitted
            for(var a=0;a<$scope.steps.length;a++){
                if($scope.steps[a].Role.includes($scope.role.cRole.callsign)){
                    $scope.steps[a].status = false;
                }else {
                    $scope.steps[a].status = true;
                }
            }


            //completed steps
            for(var c=0;c<$scope.steps.length;c++){
                if($scope.steps[c].Info !== ""){
                    $scope.steps[c].rowstyle = {
                        rowcolor : {backgroundColor:'#c6ecc6'}
                    };
                    $scope.steps[c].chkval = true;
                    $scope.steps[c].status = true;
                }
            }


        });
    }

    $scope.showPList = function(id,index,headertype){
        if(headertype === "mainheader"){
            if($scope.steps[id].class === "fa fa-caret-down"){
                $scope.steps[id].class = "fa fa-caret-right"
                for(var i=0;i<$scope.steps.length;i++){
                    if(index === parseInt($scope.steps[i].headervalue) && $scope.steps[i].headertype === "subheader"){
                        $scope.steps[i].openstatus = false;
                    }
                    else if(index === parseInt($scope.steps[i].headervalue) && $scope.steps[i].headertype === "listitem"){
                        $scope.steps[i].openstatus = false;
                    }
                }
            }else if($scope.steps[id].class === "fa fa-caret-right"){
                $scope.steps[id].class = "fa fa-caret-down"
                for(var i=0;i<$scope.steps.length;i++){
                    if(index === parseInt($scope.steps[i].headervalue) && $scope.steps[i].headertype === "subheader"){
                        $scope.steps[i].class = "fa fa-caret-down";
                        $scope.steps[i].openstatus = true;
                    }else  if(index === parseInt($scope.steps[i].headervalue) && $scope.steps[i].headertype === "listitem"){
                        $scope.steps[i].class = "fa fa-caret-right";
                        $scope.steps[i].openstatus = true;
                    }
                }
            }

        }else if(headertype === "subheader"){
            if($scope.steps[id].class === "fa fa-caret-down"){
                $scope.steps[id].class = "fa fa-caret-right"
                for(var i=0;i<$scope.steps.length;i++){
                    if(index === $scope.steps[i].index && $scope.steps[i].headertype === "listitem" ){
                        $scope.steps[i].openstatus = false;   
                    }
                }
            }else if($scope.steps[id].class === "fa fa-caret-right"){
                $scope.steps[id].class = "fa fa-caret-down"
                for(var i=0;i<$scope.steps.length;i++){
                    if(index === $scope.steps[i].index && $scope.steps[i].headertype === "listitem" ){
                        $scope.steps[i].openstatus = true;   
                    }
                }
            }
        }
    }
});


