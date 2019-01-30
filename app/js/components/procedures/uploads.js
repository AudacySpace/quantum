quantum.controller('uploadCtrl',function($scope,$uibModal,procedureService,timeService,userService,Upload,$mdDialog) {
    $scope.role = userService.userRole;
    $scope.name = userService.getUserName();

    $scope.submit = function(){ 
        // Call upload if form is valid
        if($scope.upload_form.$valid) {
            if($scope.config && $scope.config.file){
                $scope.filenames = $scope.config.file.name.split(" - ");
                if($scope.filenames.length >= 3){
                    procedureService.getProcedureList().then(function(response){
                        if(response.status === 200){
                            $scope.count = 0;
                            $scope.sameProcedure = false;
                            var filenameFrmDb;
                            for(var i=0;i<response.data.length;i++){
                                filenameFrmDb = response.data[i].procedureID+" - "+response.data[i].title+'.xlsx';
                                
                                if(response.data[i].procedureID === $scope.filenames[0] && filenameFrmDb === $scope.config.file.name && response.data[i].instances.length === 0){
                                    //Condition to check if a procedure exists with the same file name and has no saved instances
                                    $scope.sameProcedure = true;
                                    break;
                                }else if(response.data[i].procedureID === $scope.filenames[0] && filenameFrmDb !== $scope.config.file.name){
                                    //Condition to check if a procedure exists with same index but different title
                                    $scope.sameProcedure = true;
                                    break;
                                }else if(response.data[i].procedureID === $scope.filenames[0] && filenameFrmDb === $scope.config.file.name && response.data[i].instances.length > 0){
                                    //Condition to check if a procedure exists with the same file name and has saved instances
                                    $scope.sameProcedure = true;
                                    break;
                                }
                            }

                            if($scope.count === 0 && $scope.sameProcedure === false){
                                $scope.clock = timeService.getTime();
                                var userdetails = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                                $scope.upload($scope.config.file,userdetails); 
                            }else if($scope.count === 0 && $scope.sameProcedure === true){
                                var messages = {
                                    confirmMsg: "Are you sure you want to update procedure: "+filenameFrmDb +" to procedure: "+$scope.config.file.name+" ?"
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
                $scope.usermessage = 'An error occured.This procedure already exists.\n Please upload with a new index number.';
                var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);

                if(alertstatus === true){
                    //reset the input fields on the form
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }
            }else if(resp.data.error_code === 2){
                var position = "top left";
                var queryId = '#toaster';
                var delay = 0;
                var dataString = "";
                for(var a=0;a<resp.data.err_data.length;a++){
                    dataString = dataString + JSON.stringify(resp.data.err_data[a]) + '\n';
                }
                $scope.usermessage = "Error: Steps have invalid types!";
                $mdToast.show({
                    hideDelay: 0,
                    position: position,
                    controller: 'ToastCtrl',
                    controllerAs: 'ctrl',
                    bindToController: true,
                    locals: {toastMessage: $scope.usermessage,dataString:dataString,dataStringHeading:"",dataStringNonHeading: "",errorInfo:"Note: Valid step types are - Action,Caution,Decision,Heading,Info,Record,Verify,Warning "},
                    templateUrl: './js/components/procedures/toastTemplate.html',
                    parent: document.querySelectorAll(queryId)
                }).then(function(result) {
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }).catch(function(error) {
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                });

            }else if(resp.data.error_code === 3){
                var position = "top left";
                var queryId = '#toaster';
                var delay = 0;
                var dataStringHeading = "";
                var dataStringNonHeading = "";
                for(var a=0;a<resp.data.err_dataHeading.length;a++){
                    dataStringHeading = dataStringHeading + JSON.stringify(resp.data.err_dataHeading[a]) + '\n';
                }

                for(var b=0;b<resp.data.err_dataNonHeading.length;b++){
                    dataStringNonHeading = dataStringNonHeading + JSON.stringify(resp.data.err_dataNonHeading[b]) + '\n';
                }

                $scope.usermessage = "Error: Steps do not have right types for the step number!";
                $mdToast.show({
                    hideDelay: 0,
                    position: position,
                    controller: 'ToastCtrl',
                    controllerAs: 'ctrl',
                    bindToController: true,
                    locals: {toastMessage: $scope.usermessage,dataString:"",dataStringHeading: dataStringHeading,dataStringNonHeading: dataStringNonHeading,dataStringType:"",dataStringRole:"",errorInfo:"Note: Only 'Heading' Type Step number should end with .0 "},
                    templateUrl: './js/components/procedures/toastTemplate.html',
                    parent: document.querySelectorAll(queryId)
                }).then(function(result) {
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }).catch(function(error) {
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                });
            }else if(resp.data.error_code === 4){
                var position = "top left";
                var queryId = '#toaster';
                var delay = 0;
                var dataString = "";
                for(var a=0;a<resp.data.err_data.length;a++){
                    dataString = dataString + JSON.stringify(resp.data.err_data[a]) + '\n';
                }
                $scope.usermessage = "Error: Step with Type 'Heading' should have step number that ends with '.0'";
                $mdToast.show({
                    hideDelay: 0,
                    position: position,
                    controller: 'ToastCtrl',
                    controllerAs: 'ctrl',
                    bindToController: true,
                    locals: {toastMessage: $scope.usermessage,dataString:dataString,dataStringHeading:"",dataStringNonHeading: "",dataStringType:"",dataStringRole:"",errorInfo:"Eample for a Heading Type step: 1.1.1.0; 1.0; 1.2.3.0"},
                    templateUrl: './js/components/procedures/toastTemplate.html',
                    parent: document.querySelectorAll(queryId)
                }).then(function(result) {
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }).catch(function(error) {
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                });

            }else if(resp.data.error_code === 5){
                var position = "top left";
                var queryId = '#toaster';
                var delay = 0;
                var dataString = "";
                for(var a=0;a<resp.data.err_data.length;a++){
                    dataString = dataString + JSON.stringify(resp.data.err_data[a]) + '\n';
                }
                $scope.usermessage = "Error: Only Steps with 'Heading' Type should end with '.0'";
                $mdToast.show({
                    hideDelay: 0,
                    position: position,
                    controller: 'ToastCtrl',
                    controllerAs: 'ctrl',
                    bindToController: true,
                    locals: {toastMessage: $scope.usermessage,dataString:dataString,dataStringHeading:"",dataStringNonHeading: "",dataStringType:"",dataStringRole:"",errorInfo:"Steps with Types 'Action,Warning,Caution,Info,Verify,Record,Decision' should not have the step number end with '.0'"},
                    templateUrl: './js/components/procedures/toastTemplate.html',
                    parent: document.querySelectorAll(queryId)
                }).then(function(result) {
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }).catch(function(error) {
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                });

            }else if(resp.data.error_code === 6){
                var position = "top left";
                var queryId = '#toaster';
                var delay = 0;
                var dataString = "";
                for(var a=0;a<resp.data.err_data.length;a++){
                    dataString = dataString + JSON.stringify(resp.data.err_data[a]) + '\n';
                }
                $scope.usermessage = '\nError - Not a valid role for the following steps: \n'+dataString+' \n';
                var alertstatus = procedureService.displayAlert($scope.usermessage,position,queryId,delay);
                if(alertstatus === true){
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }
                $scope.usermessage = "Error: Steps have invalid roles.";
                procedureService.getQuantumRoles().then(function(response){
                    if(response){
                        $scope.quantumRoles = angular.copy(response.data);
                        $mdToast.show({
                            hideDelay: 0,
                            position: position,
                            controller: 'ToastCtrl',
                            controllerAs: 'ctrl',
                            bindToController: true,
                            locals: {toastMessage: $scope.usermessage,dataString:dataString,dataStringHeading:"",dataStringNonHeading: "",dataStringType:"",dataStringRole:"",errorInfo:"Note: Valid Roles are: "+  $scope.quantumRoles},
                            templateUrl: './js/components/procedures/toastTemplate.html',
                            parent: document.querySelectorAll(queryId)
                        }).then(function(result) {
                            $scope.config = {};
                            $scope.upload_form.$setPristine();
                        }).catch(function(error) {
                            $scope.config = {};
                            $scope.upload_form.$setPristine();
                        });
                    }
                });
            }else if(resp.data.error_code === 7){
                var position = "top left";
                var queryId = '#toaster';
                var delay = 0;
                var dataString = "";
                for(var a=0;a<resp.data.err_data.length;a++){
                    dataString = dataString + JSON.stringify(resp.data.err_data[a]) + '\n';
                }
                $scope.usermessage = "Error: Last Step should not be of type 'Heading'";
                $mdToast.show({
                    hideDelay: 0,
                    position: position,
                    controller: 'ToastCtrl',
                    controllerAs: 'ctrl',
                    bindToController: true,
                    locals: {toastMessage: $scope.usermessage,dataString:dataString,dataStringHeading:"",dataStringNonHeading: "",dataStringType:"",dataStringRole:"",errorInfo:"Note: Last step should not be section heading"},
                    templateUrl: './js/components/procedures/toastTemplate.html',
                    parent: document.querySelectorAll(queryId)
                }).then(function(result) {
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }).catch(function(error) {
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                });
            }else if(resp.data.error_code === 8){
                // 3
                var position = "top left";
                var queryId = '#toaster';
                var delay = 0;
                var dataStringType = "";
                var dataStringRole = "";
                var dataString = "";
                for(var a=0;a<resp.data.err_typedata.length;a++){
                    dataStringType = dataStringType + JSON.stringify(resp.data.err_typedata[a]) + '\n';
                }

                for(var b=0;b<resp.data.err_roledata.length;b++){
                    dataStringRole = dataStringRole + JSON.stringify(resp.data.err_roledata[b]) + '\n';
                }

                for(var a=0;a<resp.data.err_data.length;a++){
                    dataString = dataString + JSON.stringify(resp.data.err_data[a]) + '\n';
                }

                $scope.usermessage = "Error: Step types,roles are invalid and \n Last step should not be of Type 'Heading' or end with '.0'!";
                procedureService.getQuantumRoles().then(function(response){
                    if(response){
                        $scope.quantumRoles = angular.copy(response.data);
                        $mdToast.show({
                            hideDelay: 0,
                            position: position,
                            controller: 'ToastCtrl',
                            controllerAs: 'ctrl',
                            bindToController: true,
                            locals: {toastMessage: $scope.usermessage,dataString:dataString,dataStringType: dataStringType,dataStringRole: dataStringRole,dataStringHeading:"",dataStringNonHeading: "",errorInfo:"Note: Valid step types are - Action,Caution,Decision,Heading,Info,Record,Verify,Warning and \n Valid Roles are: "+  $scope.quantumRoles+". Last Step should not be of Type 'Heading' and step number should not end with '.0'"},
                            templateUrl: './js/components/procedures/toastTemplate.html',
                            parent: document.querySelectorAll(queryId)
                        }).then(function(result) {
                            $scope.config = {};
                            $scope.upload_form.$setPristine();
                        }).catch(function(error) {
                            $scope.config = {};
                            $scope.upload_form.$setPristine();
                        });
                    }
                });

            }else if(resp.data.error_code === 9){
                // 2
                var position = "top left";
                var queryId = '#toaster';
                var delay = 0;
                var dataStringType = "";
                var dataStringRole = "";
                for(var a=0;a<resp.data.err_typedata.length;a++){
                    dataStringType = dataStringType + JSON.stringify(resp.data.err_typedata[a]) + '\n';
                }

                for(var b=0;b<resp.data.err_roledata.length;b++){
                    dataStringRole = dataStringRole + JSON.stringify(resp.data.err_roledata[b]) + '\n';
                }

                $scope.usermessage = "Error: Step types and roles are invalid!";
                procedureService.getQuantumRoles().then(function(response){
                    if(response){
                        $scope.quantumRoles = angular.copy(response.data);
                        $mdToast.show({
                            hideDelay: 0,
                            position: position,
                            controller: 'ToastCtrl',
                            controllerAs: 'ctrl',
                            bindToController: true,
                            locals: {toastMessage: $scope.usermessage,dataString:"",dataStringType: dataStringType,dataStringRole: dataStringRole,dataStringHeading:"",dataStringNonHeading: "",errorInfo:"Note: Valid step types are - Action,Caution,Decision,Heading,Info,Record,Verify,Warning and \n  Valid Roles are: "+  $scope.quantumRoles},
                            templateUrl: './js/components/procedures/toastTemplate.html',
                            parent: document.querySelectorAll(queryId)
                        }).then(function(result) {
                            $scope.config = {};
                            $scope.upload_form.$setPristine();
                        }).catch(function(error) {
                            $scope.config = {};
                            $scope.upload_form.$setPristine();
                        });
                    }
                });

            }else if(resp.data.error_code === 10){
                //2
                var position = "top left";
                var queryId = '#toaster';
                var delay = 0;
                var dataStringType = "";
                var dataString = "";
                for(var a=0;a<resp.data.err_typedata.length;a++){
                    dataStringType = dataStringType + JSON.stringify(resp.data.err_typedata[a]) + '\n';
                }

                for(var a=0;a<resp.data.err_data.length;a++){
                    dataString = dataString + JSON.stringify(resp.data.err_data[a]) + '\n';
                }

                $scope.usermessage = "Error: Steps types are invalid and \n Last step should not be of type 'Heading' or end with '.0'";
                $mdToast.show({
                    hideDelay: 0,
                    position: position,
                    controller: 'ToastCtrl',
                    controllerAs: 'ctrl',
                    bindToController: true,
                    locals: {toastMessage: $scope.usermessage,dataString:dataString,dataStringHeading:"",dataStringNonHeading: "",dataStringRole: "",dataStringType: dataStringType,errorInfo:"Valid step types are - Action,Caution,Decision,Heading,Info,Record,Verify,Warning"},
                    templateUrl: './js/components/procedures/toastTemplate.html',
                    parent: document.querySelectorAll(queryId)
                }).then(function(result) {
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }).catch(function(error) {
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                });
            }else if(resp.data.error_code === 11){
                // 1
                var position = "top left";
                var queryId = '#toaster';
                var delay = 0;
                var dataString = "";
                var dataStringRole = "";

                for(var b=0;b<resp.data.err_roledata.length;b++){
                    dataStringRole = dataStringRole + JSON.stringify(resp.data.err_roledata[b]) + '\n';
                }

                for(var a=0;a<resp.data.err_data.length;a++){
                    dataString = dataString + JSON.stringify(resp.data.err_data[a]) + '\n';
                }
                $scope.usermessage = "Error: Step roles are invalid and Last step should not be of type 'Heading' or end with '.0'";
                $mdToast.show({
                    hideDelay: 0,
                    position: position,
                    controller: 'ToastCtrl',
                    controllerAs: 'ctrl',
                    bindToController: true,
                    locals: {toastMessage: $scope.usermessage,dataString:dataString,dataStringRole:dataStringRole,dataStringType:"",dataStringHeading:"",dataStringNonHeading: "",errorInfo:"Steps with Types 'Action,Warning,Caution,Info,Verify,Record,Decision' should not have the step number end with '.0'"},
                    templateUrl: './js/components/procedures/toastTemplate.html',
                    parent: document.querySelectorAll(queryId)
                }).then(function(result) {
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }).catch(function(error) {
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                });
            }
            else if(resp.data.error_code === 0 && resp.data.err_desc === "Not a valid file"){
                var position = "top left";
                var queryId = '#toaster';
                var delay = 5000;
                $scope.usermessage = 'Error: Not a valid file.Required Columns are Step,Type,Role,Content!';
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

    $scope.download = function(){ 
        var file = new Blob([s2ab(filedata.data)], { type: "application/octet-stream" });
        FileSaver.saveAs(file, id + ' - ' + title + '.xlsx' );
    }

    function confirmProcedureUpdate(messages){
         //Ask user to update or not
        $uibModal.open({
            templateUrl: './js/components/procedures/userConfirmation.html',
            controller: 'confirmCtrl',
            controllerAs: '$ctrl',
            resolve: {
                usermessage: messages,
                filedata:{}
            }
        }).result.then(function(response,status){
            //handle modal close with response
            $scope.clock = timeService.getTime();
            var userdetails = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
            $scope.upload($scope.config.file,userdetails); 
        },function () {
            //handle modal dismiss
        });
    }

});




