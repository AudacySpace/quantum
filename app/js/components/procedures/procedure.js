quantum.controller('procedureCtrl', function(Upload,$window,$scope,$interval,userService,procedureService,FileSaver,Blob) {
	$scope.sortType     = 'procedurearchived'; // set the default sort type
  	$scope.sortReverse  = false;  // set the default sort order

    $scope.livelist = [
    {
        "revision":"",
        "openedBy":"",
        "started":""
    }];

    $scope.archivedlist = [
    {
        "revision":"",
        "openedBy":"",
        "started":"",
        "closedBy":"",
        "completed":""
    }];

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
            procedureService.setHeaderStyles('none','block','#05aec3f2','#ffffff');
            procedureService.setProcedureName(pid,ptitle,"Open Procedure");

        }else if(status === "Archived") {
            procedureService.setHeaderStyles('none','block','#000000','#ffffff');
            procedureService.setProcedureName(pid,ptitle,"AS-Run Archive");

        }
    }
});


