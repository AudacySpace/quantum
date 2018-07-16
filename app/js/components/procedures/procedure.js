quantum.controller('procedureCtrl', function(Upload,$window,$scope,$interval,userService,procedureService,FileSaver,Blob,dashboardService,timeService,$mdToast,$http,$uibModal,$location) {
	$scope.sortType     = 'procedurenum'; // set the default sort type
  	$scope.sortReverse  = false;  // set the default sort order
    $scope.procedure = procedureService.getProcedureName();
    $scope.role = userService.userRole;
    $scope.name = userService.getUserName();
    $scope.loadcount = 0;
    $scope.loadstatus = true;

  	$scope.submit = function(){ 
        // Call upload if form is valid
        if($scope.upload_form.$valid) {
            if($scope.config && $scope.config.file){
                $scope.filenames = $scope.config.file.name.split(" - ");
                if($scope.filenames.length === 3){
                    procedureService.getProcedureList().then(function(response){
                        if(response.status === 200){
                            $scope.count = 0;
                            $scope.sameProcedure = false;
                            for(var i=0;i<response.data.length;i++){
                                var filenameFrmDb = response.data[i].procedureID+" - "+response.data[i].title+'.xlsx';
                                
                                if(response.data[i].procedureID === $scope.filenames[0] && filenameFrmDb === $scope.config.file.name && response.data[i].instances.length === 0){
                                    //Condition to check if a procedure exists with the same file name and has no saved instances
                                    $scope.sameProcedure = true;
                                    break;
                                }else if(response.data[i].procedureID === $scope.filenames[0] && filenameFrmDb !== $scope.config.file.name){
                                    //Condition to check if a procedure exists with same index but different title
                                    $scope.count = $scope.count + 1;
                                    $scope.usermessage = 'This file number already exists in the list with a different title.Please try uploading with a new index number!';
                                    var position = "top left";
                                    var queryId = '#toaster';
                                    var delay = 5000;
                                    var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
                                    if(alertstatus === true){
                                        $scope.config = {};
                                        $scope.upload_form.$setPristine();
                                        break;
                                    }
                                }else if(response.data[i].procedureID === $scope.filenames[0] && filenameFrmDb === $scope.config.file.name && response.data[i].instances.length > 0){
                                    //Condition to check if a procedure exists with the same file name and has saved instances
                                    $scope.count = $scope.count + 1;
                                    $scope.usermessage = 'There is already a procedure with the same filename and it has saved instances.Please try uploading a different file.';
                                    var position = "top left";
                                    var queryId = '#toaster';
                                    var delay = 5000;
                                    var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
                                    if(alertstatus === true){
                                        $scope.config = {};
                                        $scope.upload_form.$setPristine();
                                        break;
                                    }
                                }
                            }

                            if($scope.count === 0 && $scope.sameProcedure === false){
                                $scope.clock = timeService.getTime();
                                var userdetails = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                                $scope.upload($scope.config.file,userdetails); 
                            }else if($scope.count === 0 && $scope.sameProcedure === true){
                                var messages = {
                                    confirmMsg: "Are you sure you want to update this procedure?"
                                };
                                confirmProcedureUpdate(messages);
                            }
                        }
                    });
                }else {
                    var position = "top left";
                    var queryId = '#toaster';
                    var delay = 5000;
                    $scope.usermessage = "The excel file must be named in 'index - eventname - title.xlsx' format.Eg: '1.1 - Audacy Zero - OBC Bootup.xlsx'";
                    var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
                    if(alertstatus === true){
                        $scope.config = {};
                        $scope.upload_form.$setPristine();
                    }
                }
            } else {
                var position = "top left";
                var queryId = '#toaster';
                var delay = 5000;
                $scope.usermessage = "No file passed. Please upload an xlsx file.";
                var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
                if(alertstatus === true){
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }
            }
        }
    }

    $scope.upload = function(file,userdetails) {
        Upload.upload({
            url: '/upload', 
            data: { 
                file : file,
                userdetails : userdetails
            } 
        }).then(function (resp) { 
            //validate success
            if(resp.data.error_code === 0 && resp.data.err_desc === null){ 
                var position = "top left";
                var queryId = '#toaster';
                var delay = 5000;
                $scope.usermessage = 'Success: File ' + resp.config.data.file.name + ' uploaded.';
                var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
                if(alertstatus === true){
                    //reset the input fields on the form
                    $scope.config = {};
                    $scope.upload_form.$setPristine(); 
                }

            }else if(resp.data.error_code === 0 && resp.data.err_desc === "file updated"){
                var position = "top left";
                var queryId = '#toaster';
                var delay = 5000;
                $scope.usermessage = 'Success: File ' + resp.config.data.file.name + ' updated.';
                var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);

                if(alertstatus === true){
                    //reset the input fields on the form
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }


            }else if(resp.data.error_code === 1){
                var position = "top left";
                var queryId = '#toaster';
                var delay = 5000;
                $scope.usermessage = 'An error occured.This procedure already exists.Please upload with a new index number.';
                var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);

                if(alertstatus === true){
                    //reset the input fields on the form
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }
            }else if(resp.data.error_code === 0 && resp.data.err_desc === "Not a valid file"){
                var position = "top left";
                var queryId = '#toaster';
                var delay = 5000;
                $scope.usermessage = 'Not a valid file.Required Columns are Step,Type,Role,Content!';
                var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
                if(alertstatus === true){
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }

            }else {
                var position = "top left";
                var queryId = '#toaster';
                var delay = 5000;
                $scope.usermessage = 'An error occured while uploading.Please try again!';
                var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
                if(alertstatus === true){
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }
            }
        }, function (resp) { //catch error
            var position = "top left";
            var queryId = '#toaster';
            var delay = 5000;
            $scope.usermessage = 'Error status: ' + resp.status;
            var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
            if(alertstatus === true){
                $scope.config = {};
                $scope.upload_form.$setPristine();
            }

        });
    };

    $scope.showList = function(){
        if($scope.loadcount === 0){
            $scope.loadstatus = true;
        }
        procedureService.getProcedureList().then(function(response) {
              if(response.status === 200){
                $scope.procedurelist = [];
                if(response.data.length > 0){
                    for(var i=0;i<response.data.length;i++){

                        if(response.data[i].procedureID){
                            $scope.procedurelist.push(
                            {
                                id:response.data[i].procedureID,
                                title:response.data[i].title,
                                lastuse:response.data[i].lastuse,
                                instances:response.data[i].instances,
                                running:0,
                                archived:0
                            });
                        }else {
                            $scope.procedurelist.push(
                            {
                                id:response.data[i].procedure.id,
                                title:response.data[i].procedure.title,
                                lastuse:response.data[i].procedure.lastuse,
                                instances:response.data[i].instances,
                                running:0,
                                archived:0
                            });
                        }
                    }

                    for(var j=0;j<response.data.length;j++){
                        for(k=0;k<response.data[j].instances.length;k++){
                            if(response.data[j].instances[k].running === true){
                                $scope.procedurelist[j].running++;
                            }else{
                                $scope.procedurelist[j].archived++;
                            }
                        }
                    }
                }
            }

            $scope.loadstatus = false;
            $scope.loadcount++;

        },function(error){
            if(error.data === null || error.data === undefined){
                console.log("No Procedures available");
                console.log(error);
            }
            $scope.loadstatus = false;
        });
    }

    $scope.procedurelistinterval = $interval($scope.showList, 2000);

    //String to Array Buffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }

    $scope.download = function(id, title){ 
        procedureService.downloadProcedure(id, title)
        .then(function(response) {
            if(response.status == 200){
                // var data = response.data;
                var filedata = {
                    data: response.data
                }

                var messages = {
                    confirmMsg:"Do you want to download "+title+" excel file."
                }
                $uibModal.open({
                    templateUrl: './js/components/procedures/userConfirmation.html',
                    controller: 'confirmCtrl',
                    controllerAs: '$ctrl',
                    resolve: {
                        usermessage: messages,
                        filedata:filedata
                    },
                    backdrop: 'static',
                    keyboard: false
                }).result.then(function(filedata,status){
                    //handle modal close with response
                    var file = new Blob([s2ab(filedata.data)], { type: "application/octet-stream" });
                    FileSaver.saveAs(file, id + ' - ' + title + '.xlsx' );
                },function () {
                    //handle modal dismiss

                });
            } else {
                var position = "top left";
                var queryId = '#toaster';
                var delay = 5000;
                $scope.usermessage = 'The file can not be downloaded';
                var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
            }
        });
    }

    $scope.changeColor = function(status,pid,ptitle,createInstance){
        if(status === "Live" && createInstance === true){
            $scope.clock = timeService.getTime();
            procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"Open Procedure");
            $scope.role = userService.userRole;
            $scope.name = userService.getUserName();
            $scope.usernamerole =  $scope.name +"("+$scope.role.cRole.callsign+")";
            var starttime = $scope.clock.year+" - "+$scope.clock.utc;
            var emailaddress = userService.getUserEmail();
            var userstatus = true;

            procedureService.saveProcedureInstance(pid,$scope.usernamerole,starttime,$scope.name,emailaddress,userstatus).then(function(response){
                if(response.status === 200){
                    procedureService.setCurrentViewRevision(response.data.revision);
                }
            });
        }else if(status === "Live" && createInstance === false){
            procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"Open Procedure");
        }else if(status === "Archived") {
            procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"AS-Run Archive");
        }
    }

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel($scope.procedurelistinterval);
        }
    );

    function confirmProcedureUpdate(messages){
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
            $scope.clock = timeService.getTime();
            var userdetails = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
            $scope.upload($scope.config.file,userdetails); 
        },function () {
            //handle modal dismiss
        });
    }

    $scope.$on('$locationChangeStart', function(evnt, next, current){  
        var loc = $location.url();
        var revNumOp = loc.split("/");
        var emailaddress = userService.getUserEmail();
        var name = userService.getUserName();
        var currentRevision;

        if(revNumOp.length === 4){
            //user status is already set using save procedure instance
        }else if(revNumOp.length === 6 && revNumOp[3] === "runninginstance"){
            currentRevision = parseInt(revNumOp[5]);
            status = true;
            var proc = procedureService.getProcedureName();
            procedureService.setUserStatus(loc,emailaddress,name,proc.id,currentRevision,status).then(function(response){
                if(response.status === 200){
                }
            },function(error){
            }); 
        }else if(revNumOp.length === 6 && revNumOp[3] === "archivedinstance"){
            currentRevision = parseInt(revNumOp[5]);
            status = false;
            var proc = procedureService.getProcedureName();
            procedureService.setUserStatus(loc,emailaddress,name,proc.id,currentRevision,status).then(function(response){
                if(response.status === 200){
                }
            },function(error){
            }); 
        }
        else if(revNumOp.length === 2 || revNumOp.length === 5){
            currentRevision = "";
            status = false;
            var proc = procedureService.getProcedureName();
            procedureService.setUserStatus(loc,emailaddress,name,proc.id,currentRevision,status).then(function(response){
                if(response.status === 200){
                }
            },function(error){
            }); 
        }  
    });
});

quantum.controller('confirmCtrl',function($scope,$uibModalInstance,usermessage,filedata) {
    var $ctrl = this;
    $ctrl.modalLabel = usermessage.confirmMsg;

    $ctrl.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function(){
        $uibModalInstance.close(filedata,true);
    }

});


