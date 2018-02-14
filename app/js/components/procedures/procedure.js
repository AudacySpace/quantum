quantum.controller('procedureCtrl', function(Upload,$window,$scope,$interval,userService,procedureService,FileSaver,Blob) {
	$scope.sortType     = 'procedurelastuse'; // set the default sort type
  	$scope.sortReverse  = false;  // set the default sort order

  
  	$scope.submit = function(){ 
        // Call upload if form is valid
        if($scope.upload_form.$valid) {
            if($scope.config.file){
                $scope.filenames = $scope.config.file.name.split(" - ");
                if($scope.filenames.length === 3){
                    procedureService.getProcedureList().then(function(response){
                        if(response.status === 200){
                            $scope.count = 0;
                            for(var i=0;i<response.data.length;i++){
                                if(response.data[i].procedure.id === $scope.filenames[0]){
                                    $scope.count = $scope.count + 1;
                                    $window.alert("This index number already exists in the table!");
                                    $scope.config = {};
                                    $scope.upload_form.$setPristine();
                                    break;
                                }
                            }

                            if($scope.count === 0){
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
                // $scope.showList();
                $window.alert('Success: ' + resp.config.data.file.name + ' uploaded.');

                //reset the input fields on the form
                $scope.config = {};
                $scope.upload_form.$setPristine();
            }else if(resp.data.error_code === 1){
                $window.alert('An error occured.This procedure already exists.Please upload with a new index number');
                //reset the input fields on the form
                $scope.config = {};
                $scope.upload_form.$setPristine();
            }else if(resp.data.error_code === 0 && resp.data.err_desc === "Not a valid file"){
                $scope.config = {};
                $scope.upload_form.$setPristine();
                $window.alert('Not a valid file.Required Columns are Step,Type,Role,Content!');
            }else {
                $scope.config = {};
                $scope.upload_form.$setPristine();
                $window.alert('An error occured while uploading.Please try again!');
            }
        }, function (resp) { //catch error
            $window.alert('Error status: ' + resp.status);
        });
    };

    $scope.showList = function(){
        procedureService.getProcedureList().then(function(response) {
              if(response.status === 200){
                $scope.procedurelist = [];
                if(response.data.length > 0){
                    for(var i=0;i<response.data.length;i++){
                        $scope.procedurelist.push(
                            {
                                id:parseFloat(response.data[i].procedure.id).toFixed(1),
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


        },function(error){
            if(error.data === null || error.data === undefined){
                console.log("No Procedures available");
                console.log(error);
            }
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
                var file = new Blob([s2ab(data)], { type: "application/octet-stream" });
                FileSaver.saveAs(file, id + ' - ' + title + '.xlsx' );
            } else {
                $window.alert("The file can not be downloaded");
            }
        });
    }

    $scope.changeColor = function(status,pid,ptitle){
        if(status === "Live"){
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
});


