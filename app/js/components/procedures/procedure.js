quantum.controller('procedureCtrl', function(Upload,$window,$scope,$interval,userService,procedureService,FileSaver,Blob,dashboardService,timeService,$mdToast,$http,$uibModal,$location,$mdDialog) {
	var $ctrl = this;
    $scope.sortType     = 'id'; // set the default sort type
  	 $scope.sortReverse  = false;  // set the default sort order
    $scope.procedure = procedureService.getProcedureName();
    $scope.role = userService.userRole;
    $scope.name = userService.getUserName();
    $scope.loadcount = 0;
    $scope.loadstatus = true;
    $scope.quantumRoles = procedureService.getValidRoles();

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
               // console.log("No Procedures available");
               // console.log(error);
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
            procedureService.setProcedureName(pid,ptitle,"Live");
           // $scope.role = userService.userRole;
           // $scope.name = userService.getUserName();
            $scope.usernamerole =  $scope.name +"("+$scope.role.cRole.callsign+")";
            var starttime = $scope.clock.year+" - "+$scope.clock.utc;
            var emailaddress = userService.getUserEmail();
            var userstatus = true;

            procedureService.saveProcedureInstance(pid,$scope.usernamerole,starttime,$scope.name,emailaddress,userstatus).then(function(response){
                if(response.status === 200){
                    procedureService.setCurrentViewRevision(response.data.revision);
                    procedureService.setprocRevisions(pid,response.data.revision);
                }
            });
        }else if(status === "Live" && createInstance === false){
            procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"Open Procedure");
        }else if(status === "Archived") {
            procedureService.setHeaderStyles('none','block','#000000','#ffffff','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"AS-Run Archive");
        }else if(status === "Preview"){
            procedureService.setHeaderStyles('block','none','#ffffff','#000000','none','inline-block',$window.innerWidth);
            procedureService.setProcedureName(pid,ptitle,"Preview Procedure");
        }
    }

    $scope.$on("$destroy", 
        function(event) {
            $interval.cancel($scope.procedurelistinterval);
        }
    );

    $scope.showEditModal = function(procedure){
        $uibModal.open({
            templateUrl: './js/components/procedures/editProcedure.html',
            controller: 'editProcedureCtrl',
            controllerAs: '$ctrl',
            resolve: {
                procedure: procedure
            },
            backdrop: 'static',
            keyboard: false
        }).result.then(function(newName){
            //handle modal close with response
            procedureService.updateProcedureName(procedure.id,newName).then(function(response){
            });

        },function () {
            //handle modal dismiss
        });
    }
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

quantum.controller('editProcedureCtrl',function($scope,$uibModal,$uibModalInstance,procedure,procedureService) {
    var $ctrl = this;
    $ctrl.procedure = angular.copy(procedure);
    $ctrl.procedureTitle = $ctrl.procedure.title.split(" - ");
    $ctrl.indexNum = angular.copy($ctrl.procedure.id);
    $ctrl.existingIndex = $ctrl.procedure.id;
    $ctrl.groupName = $ctrl.procedureTitle[0];
    $ctrl.mainTitle = $ctrl.procedureTitle[1];

    $ctrl.close = function() {
        $uibModalInstance.dismiss('cancel');
    };

    $ctrl.save = function(indexNum,groupName,title){
        var exists = false;
        var prevprocId;
        var procIndex;
        var firstId = $ctrl.procedure.id;
        var secondId = indexNum;
        $ctrl.indexExists = false;
        if(indexNum && groupName && title){
            procedureService.getProcedureList().then(function(response){
                if(response.status === 200){
                    for(var i=0;i<response.data.length;i++){
                        if(response.data[i].procedureID === indexNum){
                            exists = true;
                            prevprocId = response.data[i].procedureID;
                            procIndex = i;
                            break;
                        }
                    }
                    if(exists === false){
                        var newName = {
                             'id':indexNum,
                             'gname':groupName,
                             'title':title
                         }
                         $uibModalInstance.close(newName); // close method should be called with an object
                    }else if(exists === true){
                        // check if only title is changed and not index number and update
                        if(indexNum === $ctrl.existingIndex){
                            var newName = {
                                'id':indexNum,
                                'gname':groupName,
                                'title':title
                         }
                         $uibModalInstance.close(newName); 
                        }else {
                            //check if index number has changed then do not update
                            $ctrl.indexExists = true;
                        }
                    }
                }
            });
        }
    }

});

quantum.controller('DialogController',function($scope,$mdDialog) {
    var $ctrl = this;
    $ctrl.cancel = function() {
         $mdDialog.cancel('cancel');
    };
});

quantum.controller('ToastCtrl',function($scope,$mdDialog,$mdToast) {
    var $ctrl = this;
    $ctrl.closeToast = function() {
        $mdToast.cancel('ok');
    };

    $ctrl.openMoreInfo = function(){
        $mdDialog.show({
            controller: 'DialogController',
            templateUrl: './js/components/procedures/dialog.html',
            parent: angular.element(document.body),
            clickOutsideToClose:false,
            controllerAs: 'ctrl',
            bindToController: true,
            locals: {errorInfo:$ctrl.errorInfo,dataString:$ctrl.dataString,dataStringHeading: $ctrl.dataStringHeading,dataStringNonHeading: $ctrl.dataStringNonHeading,dataStringType: $ctrl.dataStringType,dataStringRole: $ctrl.dataStringRole},
            fullscreen: false, // Only for -xs, -sm breakpoints.
            multiple:true
        })
        .then(function(answer) {
        }, function() {
        });
    }
});




