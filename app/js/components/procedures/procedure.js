quantum.controller('procedureCtrl', function(Upload,$window,$scope,$interval,userService,procedureService,FileSaver,Blob,dashboardService,timeService,$mdToast,$http) {
	$scope.sortType     = 'procedurelastuse'; // set the default sort type
  	$scope.sortReverse  = false;  // set the default sort order
    $scope.procedure = procedureService.getProcedureName();
    $scope.role = userService.userRole;
    $scope.name = userService.getUserName();
    $scope.loadcount = 0;

  	$scope.submit = function(){ 
        // Call upload if form is valid
        if($scope.upload_form.$valid) {
            if($scope.config){
                $scope.filenames = $scope.config.file.name.split(" - ");
                if($scope.filenames.length === 3){
                    procedureService.getProcedureList().then(function(response){
                        if(response.status === 200){
                            $scope.count = 0;
                            for(var i=0;i<response.data.length;i++){
                                var filenameFrmDb = response.data[i].procedure.id+" - "+response.data[i].procedure.title+'.xlsx';
                                
                                if(response.data[i].procedure.id === $scope.filenames[0] && filenameFrmDb === $scope.config.file.name && response.data[i].instances.length === 0){
                                    //Condition to check if a procedure exists with the same file name and has no saved instances

                                    //Ask user to update or not
                                    if($window.confirm("Are you sure you want to update this procedure?")){
                                        $scope.count = 0;
                                        break;
                                    }else {
                                        $scope.count = $scope.count + 1;
                                        $scope.config = {};
                                        $scope.upload_form.$setPristine();
                                        break;
                                    }
                                }else if(response.data[i].procedure.id === $scope.filenames[0] && filenameFrmDb !== $scope.config.file.name){
                                    //Condition to check if a procedure exists with same index but different title
                                    $scope.count = $scope.count + 1;
                                  //  $window.alert("This file number already exists in the list with a different title.Please try uploading with a new index number!");
                                    var pinTo = 'top left';
                                    var toast = $mdToast.simple()
                                                        .textContent('This file number already exists in the list with a different title.Please try uploading with a new index number!')
                                                        .action('OK')
                                                        .parent(document.querySelectorAll('#toaster'))
                                                        .hideDelay(5000)
                                                        .highlightAction(true)
                                                        .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                                                        .position(pinTo);
                                    console.log(toast);
                                    $mdToast.show(toast).then(function(response) {
                                        if ( response == 'ok' ) {

                                        }
                                    },function(error){
                                        console.log(error);
                                    });
                                    $scope.config = {};
                                    $scope.upload_form.$setPristine();
                                    break;
                                }else if(response.data[i].procedure.id === $scope.filenames[0] && filenameFrmDb === $scope.config.file.name && response.data[i].instances.length > 0){
                                    //Condition to check if a procedure exists with the same file name and has saved instances
                                    $scope.count = $scope.count + 1;
                                    var pinTo = 'top left';
                                    var toast = $mdToast.simple()
                                                        .textContent('There is already a procedure with the same filename and it has saved instances.Please try uploading a different file.')
                                                        .action('OK')
                                                        .parent(document.querySelectorAll('#toaster'))
                                                        .hideDelay(5000)
                                                        .highlightAction(true)
                                                        .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                                                        .position(pinTo);

                                    $mdToast.show(toast).then(function(response) {
                                        if ( response == 'ok' ) {}
                                    },function(error){
                                        console.log(error);
                                    });
                                    $scope.config = {};
                                    $scope.upload_form.$setPristine();
                                }
                            }

                            if($scope.count === 0){
                                $scope.clock = timeService.getTime();
                                var userdetails = $scope.clock.utc +" "+$scope.name +"("+$scope.role.cRole.callsign+")";
                                $scope.upload($scope.config.file,userdetails); 
                            }
                        }
                    });
                }else {
                    var pinTo = 'top left';
                    var toast = $mdToast.simple()
                                        .textContent("The excel file must be named in 'index - eventname - title.xlsx' format.Eg: '1.1 - Audacy Zero - OBC Bootup.xlsx'")
                                        .action('OK')
                                        .parent(document.querySelectorAll('#toaster'))
                                        .hideDelay(5000)
                                        .highlightAction(true)
                                        .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                                        .position(pinTo);

                    $mdToast.show(toast).then(function(response) {
                        if ( response == 'ok' ) {}
                    },function(error){
                        console.log(error);
                    });
                    $scope.config = {};
                    $scope.upload_form.$setPristine();
                }
            } else {
                var pinTo = 'top left';
                var toast = $mdToast.simple()
                                    .textContent("No file passed. Please upload an xlsx file.")
                                    .action('OK')
                                    .parent(document.querySelectorAll('#toaster'))
                                    .hideDelay(5000)
                                    .highlightAction(true)
                                    .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                                    .position(pinTo);

                $mdToast.show(toast).then(function(response) {
                    if ( response == 'ok' ) {
                    }
                },function(error){
                    console.log(error);
                });
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
                var pinTo = 'top left';
                var toast = $mdToast.simple()
                                    .textContent('Success: File ' + resp.config.data.file.name + ' uploaded.')
                                    .action('OK')
                                    .parent(document.querySelectorAll('#toaster'))
                                    .hideDelay(5000)
                                    .highlightAction(true)
                                    .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                                    .position(pinTo);

                $mdToast.show(toast).then(function(response) {
                    if ( response == 'ok' ) {
                    }
                },function(error){
                    console.log(error);
                });

                //reset the input fields on the form
                $scope.config = {};
                $scope.upload_form.$setPristine();
            }else if(resp.data.error_code === 0 && resp.data.err_desc === "file updated"){
                var pinTo = 'top left';
                var toast = $mdToast.simple()
                                    .textContent('Success: File ' + resp.config.data.file.name + ' updated.')
                                    .action('OK')
                                    .parent(document.querySelectorAll('#toaster'))
                                    .hideDelay(5000)
                                    .highlightAction(true)
                                    .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                                    .position(pinTo);

                $mdToast.show(toast).then(function(response) {
                    if ( response == 'ok' ) {
                    }
                },function(error){
                    console.log(error);
                });

                //reset the input fields on the form
                $scope.config = {};
                $scope.upload_form.$setPristine();
            }else if(resp.data.error_code === 1){
                var pinTo = 'top left';
                var toast = $mdToast.simple()
                                    .textContent('An error occured.This procedure already exists.Please upload with a new index number')
                                    .action('OK')
                                    .parent(document.querySelectorAll('#toaster'))
                                    .hideDelay(5000)
                                    .highlightAction(true)
                                    .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                                    .position(pinTo);

                $mdToast.show(toast).then(function(response) {
                    if ( response == 'ok' ) {
                    }
                },function(error){
                    console.log(error);
                });
                //reset the input fields on the form
                $scope.config = {};
                $scope.upload_form.$setPristine();
            }else if(resp.data.error_code === 0 && resp.data.err_desc === "Not a valid file"){
                $scope.config = {};
                $scope.upload_form.$setPristine();
                var pinTo = 'top left';
                var toast = $mdToast.simple()
                                    .textContent('Not a valid file.Required Columns are Step,Type,Role,Content!')
                                    .action('OK')
                                    .parent(document.querySelectorAll('#toaster'))
                                    .hideDelay(5000)
                                    .highlightAction(true)
                                    .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                                    .position(pinTo);

                $mdToast.show(toast).then(function(response) {
                    if ( response == 'ok' ) {
                    }
                },function(error){
                    console.log(error);
                });
            }else {
                $scope.config = {};
                $scope.upload_form.$setPristine();
                var pinTo = 'top left';
                var toast = $mdToast.simple()
                                    .textContent('An error occured while uploading.Please try again!')
                                    .action('OK')
                                    .parent(document.querySelectorAll('#toaster'))
                                    .hideDelay(5000)
                                    .highlightAction(true)
                                    .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                                    .position(pinTo);

                $mdToast.show(toast).then(function(response) {
                    if ( response == 'ok' ) {
                    }
                },function(error){
                    console.log(error);
                });
            }
        }, function (resp) { //catch error
            var pinTo = 'top left';
            var toast = $mdToast.simple()
                                .textContent('Error status: ' + resp.status)
                                .action('OK')
                                .parent(document.querySelectorAll('#toaster'))
                                .hideDelay(5000)
                                .highlightAction(true)
                                .highlightClass('md-accent')// Accent is used by default, this just demonstrates the usage.
                                .position(pinTo);

            $mdToast.show(toast).then(function(response) {
                if ( response == 'ok' ) {
                }
            },function(error){
                console.log(error);
            });

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
                        $scope.procedurelist.push(
                            {
                                id:response.data[i].procedure.id,
                                title:response.data[i].procedure.title,
                                lastuse:response.data[i].procedure.lastuse,
                                instances:response.data[i].instances,
                                running:0,
                                archived:0
                            }
                        )
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
                var data = response.data
                if($window.confirm("Do you want to download "+title+" excel file")){
                    var file = new Blob([s2ab(data)], { type: "application/octet-stream" });
                    FileSaver.saveAs(file, id + ' - ' + title + '.xlsx' );
                }else {

                }

            } else {
                $window.alert("The file can not be downloaded");
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
            procedureService.saveProcedureInstance(pid,$scope.usernamerole,starttime).then(function(response){
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
            $interval.cancel($scope.interval);
        }
    );

});


