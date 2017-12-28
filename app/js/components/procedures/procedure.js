quantum.controller('procedureCtrl', function(Upload,$window,$scope,$interval,userService,procedureService,timeService) {
	$scope.sortType     = 'procedurearchived'; // set the default sort type
  	$scope.sortReverse  = false;  // set the default sort order
    $scope.role = userService.userRole;
    $scope.name = userService.getUserName();
    $scope.steps = [];
    $scope.clock = {
        utc : "000.00.00.00 UTC"
    }

    $scope.updateClock = function(){
        $scope.clock = timeService.getTime(0);
    }

    $scope.interval = $interval($scope.updateClock, 500);

    showList();
  	$scope.submit = function(){ 
        // Call upload if form is valid
        if($scope.upload_form.$valid) {
            if($scope.config.file){
                var filenames = $scope.config.file.name.split(" - ");
                if(filenames.length === 3){
                    procedureService.getProcedureList().then(function(response){
                        if(response){
                            var count = 0;
                            for(var i=0;i<response.data.length;i++){
                                if(response.data[i].procedure.id === filenames[0]){
                                    count = count + 1;
                                    alert("This index number already exists in the table!");
                                    $scope.config = {};
                                    $scope.upload_form.$setPristine();
                                    break;
                                }
                            }

                            if(count === 0){
                                $scope.upload($scope.config.file); 
                            }
                        }
                    });
                }else {
                    $window.alert("The excel file must be named in 'index - title.xlsx' format.Eg: '1.1 - Audacy Zero - OBC Bootup.xlsx'");
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }
            } else {
                $window.alert('No file passed. Please upload an xlsx file.');
            }
        }
    }

    $scope.upload = function(file) {
        Upload.upload({
            url: '/upload', 
            data: { 
                file : file
            } 
        }).then(function (resp) { 
            //validate success
            if(resp.data.error_code === 0 && resp.data.err_desc === null){ 
                showList();
                $window.alert('Success: ' + resp.config.data.file.name + ' uploaded.');

                //reset the input fields on the form
                $scope.config = {};
                $scope.upload_form.$setPristine();
            }else if(resp.data.error_code === 1){
                $window.alert('an error occured');
                $window.alert("This procedure already exists.Please upload with a new index number");
                //reset the input fields on the form
                $scope.config = {};
                $scope.upload_form.$setPristine();
            }else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            $window.alert('Error status: ' + resp.status);
        });
    };

    function showList(){
        procedureService.getProcedureList().then(function(response) {
            $scope.procedurelist = [];
            for(var i=0;i<response.data.length;i++){
                $scope.procedurelist.push(
                    {
                        id:parseFloat(response.data[i].procedure.id).toFixed(1),
                        title:response.data[i].procedure.title,
                        lastuse:response.data[i].procedure.lastuse,
                        running:response.data[i].procedure.running,
                        archived:response.data[i].procedure.archived
                    }
                )
            }
        });
    }


    $scope.viewProcedure = function(id,name,status){
            if(status === "Live"){
                document.getElementById("QRegular").style.display = "none";
                document.getElementById("QBlack").style.display = "block";
                document.getElementById("top-header").style.backgroundColor = "#05aec3f2";
                document.getElementById("username").style.backgroundColor = "#05aec3f2";
                document.getElementById("username").style.color = "#ffffff";
                document.getElementById("callsign").style.color = "#ffffff";
                document.getElementById("top-header").style.color = "#ffffff"; 
            }else if(status === "Archived") {
                document.getElementById("QRegular").style.display = "none";
                document.getElementById("QBlack").style.display = "block";
                document.getElementById("top-header").style.backgroundColor = "#000000";
                document.getElementById("username").style.backgroundColor = "#000000";
                document.getElementById("username").style.color = "#ffffff";
                document.getElementById("callsign").style.color = "#ffffff";
                document.getElementById("top-header").style.color = "#ffffff";  
            }
            document.getElementById("procedures").style.display = "none";
            document.getElementById("liveprocedures").style.display = "block";
            procedureService.setProcedureName(id,name,status);

            procedureService.getProcedureList().then(function(response) {
                for(var i=0;i<response.data.length;i++){
                    if(parseFloat(response.data[i].procedure.id).toFixed(1) === id){
                        $scope.steps = response.data[i].procedure.sections;

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
                            rowcolor: {backgroundColor:'#e9f6fb'}
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

            });


        }

         $scope.showPList = function(id,index,headertype){
            if(headertype === "mainheader"){
                if($scope.steps[id].class === "fa fa-caret-down"){
                    $scope.steps[id].class = "fa fa-caret-right"
                    for(var i=0;i<$scope.steps.length;i++){
                        if(index === parseInt($scope.steps[i].headervalue) && $scope.steps[i].headertype === "subheader" || $scope.steps[i].headertype === "listitem"){
                            $scope.steps[i].openstatus = false;
                        }
                    }
                }else if($scope.steps[id].class === "fa fa-caret-right"){
                    $scope.steps[id].class = "fa fa-caret-down"
                    for(var i=0;i<$scope.steps.length;i++){
                        if(index === parseInt($scope.steps[i].headervalue)){
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

        $scope.setInfo = function(index,stepstatus){
             if(stepstatus === true){
                $scope.steps[index].Info = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                $scope.steps[index].rowstyle = {
                    rowcolor : {backgroundColor:'#c6ecc6'}
                }
             }else{
                $scope.steps[index].Info = "";
                $scope.steps[index].rowstyle = {
                        rowcolor : {backgroundColor:'#e9f6fb'}
                }

            }
        }
	}
});


