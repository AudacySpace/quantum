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

    procedureService.getGroups().then(function(response) {
        if(response.status == 200) {
            $scope.pg = angular.copy(response.data);
            for(var i=0;i<$scope.pg.length;i++){
                $scope.pg[i].hidden = false;
            }
        }
    });

    $scope.showList = function(){
        if($scope.loadcount === 0){
            $scope.loadstatus = true;
        }

        procedureService.getProcedureList().then(function(response) {
              if(response.status === 200){
                $scope.procedurelist = [];
                if(response.data.length > 0){
                    $scope.procedureGroups = angular.copy($scope.pg);
                    $scope.procedureGroups = getParentsOfGroups($scope.procedureGroups); 
                    $scope.groupIds = [];
                    $scope.uniqueGroupIds = new Set();
                    for(var a=0;a<$scope.procedureGroups.length;a++){
                        $scope.groupIds.push($scope.procedureGroups[a].id);
                    }
                    for(var i=0;i<response.data.length;i++){
                        if(response.data[i].procedureID){
                            var parentArr = response.data[i].procedureID.split(".");
                            parentArr.pop();
                            var parent = parentArr.join(".");
                            var newparentExists = $scope.groupIds.includes(parent);
                            if(newparentExists === false) {
                                var parentArr2 = response.data[i].procedureID.split(".");
                                while(parentArr2.length > 0){
                                    parentArr2.pop();
                                    var newp = parentArr.join(".");
                                    parent = newp;
                                    var newParentnow = $scope.groupIds.includes(parent);
                                    if(newParentnow === false){
                                        parent = newp;
                                        $scope.groupIds.push(parent);
                                        $scope.uniqueGroupIds.add(parent);
                                    }
                                }
                            }
                            parent = parent+".0";
                            $scope.procedurelist.push(
                            {
                                id:response.data[i].procedureID,
                                title:response.data[i].title,
                                lastuse:response.data[i].lastuse,
                                instances:response.data[i].instances,
                                running:0,
                                archived:0,
                                parent: parent,
                                hidden:false
                            });
                        }
                    }

                    $scope.uniqueGroupIds.forEach(function(value) {
                        var vparent = ""
                        if(value.includes(".")){
                            var parentvalOp = value.split(".");
                            parentvalOp.pop();
                            var valparent = "";
                            if(parentvalOp.length > 1){
                                valparent = parentvalOp.join(".");
                            }else {
                                valparent = parentvalOp[0];
                            }
                            vparent = valparent;
                        }else {
                            vparent = null;
                        }
                        $scope.procedureGroups.push({
                            "id":value,
                            "name":"Other",
                            "hidden":false,
                            "parent":vparent
                        });
                        
                    });

                    $scope.procedureGroups = createDecimalIds($scope.procedureGroups);
                    $scope.procedureGroups.sort(function(a,b) { return a.decimalId-b.decimalId; });

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

    function getParentsOfGroups(groups,procedures){
        if(groups.length > 0){
            for(var a=0;a<groups.length;a++){
                var op1 = groups[a].id.split(".");
                if(op1[op1.length - 1] === "0"){
                    op1.pop();
                }
                var op2 = op1.join(".");
                groups[a].children = 0;
            }
            for(var i=0;i<groups.length;i++){
                if(groups[i].id.includes(".")){
                    var parentArr = groups[i].id.split(".");
                    parentArr.pop();
                    var parent = parentArr.join(".");
                    for(var j=0;j<groups.length;j++){
                        if(groups[j].id === parent){
                            groups[i].parent = parent;
                            groups[j].children = groups[j].children + 1;
                        }
                    }
                }
                else {
                    groups[i].parent = null;
                }

            }
        }

        return groups;
    }

    $scope.toggleList = function(groupNum,index){
        var groupNumarray = groupNum.split(".");
        groupNumarray.pop();

        // toggle groups

        for(var i=0;i<$scope.procedureGroups.length;i++){
            if(i !== index){
                var gnumarraytemp = $scope.procedureGroups[i].id.split(".");
                gnumarraytemp.pop();
                var gnumarraytemp2 = gnumarraytemp.slice(0,groupNumarray.length);
                if(JSON.stringify(groupNumarray) === JSON.stringify(gnumarraytemp2)){
                    $scope.procedureGroups[i].hidden = !$scope.procedureGroups[i].hidden;
                }
            }
        }
        

        // toggle procedures
        for(var a=0;a<$scope.procedurelist.length;a++){
            var gnumarray = $scope.procedurelist[a].id.split(".");
            gnumarray.pop();
            var gnumarray2 = gnumarray.slice(0,groupNumarray.length);
            if(JSON.stringify(groupNumarray) === JSON.stringify(gnumarray2)){
                $scope.procedurelist[a].hidden = !$scope.procedurelist[a].hidden;
            }
        }

        $ctrl.procedurelist = angular.copy($scope.procedurelist);
        $ctrl.procedureGroups = angular.copy($scope.procedureGroups);

        //Handle for main headers
        //Handle for not collapsing or expanding on every interval
    }

    function createDecimalIds(groups){
        var len = groups.length;
        for(var a=0;a<len;a++){
            if(groups[a].id.includes(".")){
                groups[a].id = groups[a].id+".0";
                var decop1 = groups[a].id.split(".");
                if(decop1.length > 2){
                    var newdecimalvalue = decop1.slice(1,decop1.length).join("");
                    var decimalid = decop1[0]+"."+newdecimalvalue;
                    groups[a].decimalId = decimalid;
                }else if(decop1.length === 2){
                    groups[a].id = groups[a].id+".0";
                    groups[a].decimalId = groups[a].id;
                }
            }else {
                groups[a].id = groups[a].id+".0";
                groups[a].decimalId = groups[a].id;
            }
            
        }
        return groups;
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




