describe('Test Suite for Procedure Controller', function () {
    var controller,scope,procedureService,userService,$interval,Blob,FileSaver,deferred,$q,httpBackend,timeService;
    var windowMock = {
        innerWidth: 1000,
        user : {
            currentRole : {callsign : 'MD'}
        },
        alert: function(message){

        }
    };

    var result = [{
        "_id": "5a78b26a5fa10701004acb4c",
        "instances": [
            {
                "openedBy": "Taruni Gattu(VIP)",
                "Steps": [
                    {
                        "step": "1.0",
                        "info": "034.11:26:35 UTC Taruni Gattu(VIP)"
                    },
                    {
                        "step": "1.1",
                        "info": "034.11:26:36 UTC Taruni Gattu(VIP)"
                    },
                    {
                        "step": "1.2",
                        "info": "034.11:26:37 UTC Taruni Gattu(VIP)"
                    },
                    {
                        "step": "2.0",
                        "info": "034.11:26:38 UTC Taruni Gattu(VIP)"
                    },
                    {
                        "step": "2.1.0",
                        "info": "034.11:26:39 UTC Taruni Gattu(VIP)"
                    },
                    {
                        "step": "2.1.1",
                        "info": "034.11:26:40 UTC Taruni Gattu(VIP)"
                    }
                ],
                "closedBy": "Taruni Gattu(VIP)",
                "startedAt": "2018 - 034.11:26:35 UTC",
                "completedAt": "2018 - 034.11:26:40 UTC",
                "revision": 1,
                "running": false
            },
            {
                "openedBy": "Taruni Gattu(VIP)",
                "Steps": [
                    {
                        "step": "1.0",
                        "info": ""
                    },
                    {
                        "step": "1.1",
                        "info": ""
                    },
                    {
                        "step": "1.2",
                        "info": ""
                    },
                    {
                        "step": "2.0",
                        "info": "034.11:26:49 UTC Taruni Gattu(VIP)"
                    },
                    {
                        "step": "2.1.0",
                        "info": "034.11:26:50 UTC Taruni Gattu(VIP)"
                    },
                    {
                        "step": "2.1.1",
                        "info": ""
                    }
                ],
                "closedBy": "",
                "startedAt": "2018 - 034.11:26:49 UTC",
                "completedAt": "",
                "revision": 2,
                "running": true
            }
        ],
        "procedure": {
            "sections": [
                {
                    "Content": "Pre-Action Safety Information",
                    "Type": "Heading",
                    "Role": "MD",
                    "Step": "1.0"
                },
                {
                    "Reference": "http://somewhere on the net",
                    "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.",
                    "Type": "Warning",
                    "Role": "MD",
                    "Step": "1.1"
                },
                {
                    "Content": "Make required safety announcement on VL-AZERO",
                    "Type": "Action",
                    "Role": "MD",
                    "Step": "1.2"
                },
                {
                    "Content": "Close Procedure",
                    "Role": "MD",
                    "Step": "2.0"
                },
                {
                    "Content": "Update the shift log with procedure close status / notes",
                    "Type": "Action",
                    "Role": "MD",
                    "Step": "2.1.0"
                },
                {
                    "Content": "Close the procedure in Quantum (complete this step)",
                    "Type": "Action",
                    "Role": "MD",
                    "Step": "2.1.1"
                } 
            ],
            "eventname": "Audacy Zero",
            "lastuse": "2018 - 034.11:26:50 UTC",
            "title": "Audacy Zero - Procedure Example",
            "id": "1.1"
        },
        "__v": 6
    },
    {
        "_id": "5a78b2745fa10701004acb4d",
        "instances": [
            {
                "openedBy": "Taruni Gattu(VIP)",
                "Steps": [
                    {
                        "step": "1.0",
                        "info": "034.11:26:58 UTC Taruni Gattu(VIP)"
                    },
                    {
                        "step": "1.1",
                        "info": "034.11:26:59 UTC Taruni Gattu(VIP)"
                    },
                    {
                        "step": "1.2",
                        "info": ""
                    },
                    {
                        "step": "2.0",
                        "info": ""
                    },
                    {
                        "step": "2.1.0",
                        "info": ""
                    },
                    {
                        "step": "2.1.1",
                        "info": ""
                    }
                ],
                "closedBy": "",
                "startedAt": "2018 - 034.11:26:58 UTC",
                "completedAt": "",
                "revision": 1,
                "running": true
            }
        ],
        "procedure": {
            "sections": [
                {
                    "Content": "Pre-Action Safety Information",
                    "Type": "Heading",
                    "Role": "MD",
                    "Step": "1.0"
                },
                {
                    "Reference": "http://somewhere on the net",
                    "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.",
                    "Type": "Warning",
                    "Role": "MD",
                    "Step": "1.1"
                },
                {
                    "Content": "Make required safety announcement on VL-AZERO",
                    "Type": "Action",
                    "Role": "MD",
                    "Step": "1.2"
                },
                {
                    "Content": "Close Procedure",
                    "Role": "MD",
                    "Step": "2.0"
                },
                {
                    "Content": "Update the shift log with procedure close status / notes",
                    "Type": "Action",
                    "Role": "MD",
                    "Step": "2.1.0"
                },
                {
                    "Content": "Close the procedure in Quantum (complete this step)",
                    "Type": "Action",
                    "Role": "MD",
                    "Step": "2.1.1"
                }
            ],
            "eventname": "Audacy Zero",
            "lastuse": "2018 - 034.11:26:59 UTC",
            "title": "Audacy Zero - OBC Bootup",
            "id": "1.2"
        },
        "__v": 3
    }];


     beforeEach(function () {
         // load the module
        module('quantum', function ($provide) {
            $provide.value('$window', windowMock);

        });

        //Prepare the mocks
        module(function ($provide) {
            $provide.constant('moment', function () {
                //Remember, moment is always available in the global scope
                return moment();
            })
        });

        inject(function($controller, $rootScope, _$q_, _procedureService_,$routeParams,_userService_,$interval,_$httpBackend_,_timeService_){
            scope = $rootScope.$new();
            $intervalSpy = jasmine.createSpy('$interval', $interval);
            $q = _$q_;
            procedureService = _procedureService_;
            userService = _userService_;
            httpBackend = _$httpBackend_;
            timeService = _timeService_;

            deferredProcedureList = _$q_.defer();
            spyOn(procedureService, "getProcedureList").and.returnValue(deferredProcedureList.promise);

            deferreddownloadProcedure = _$q_.defer();
            spyOn(procedureService, "downloadProcedure").and.returnValue(deferreddownloadProcedure.promise);

            deferredProcedureInstance = _$q_.defer();
            spyOn(procedureService, "saveProcedureInstance").and.returnValue(deferredProcedureInstance.promise);

            spyOn(userService, "getUserName").and.returnValue('John Smith');

            spyOn(timeService, "getTime").and.returnValue({
                days : '070',
                minutes : '10',
                hours : '10',
                seconds : '50',
                utc : '070.10:10:50 UTC',
                year : '2018'
            });

            controller = $controller('procedureCtrl', {
                $scope: scope,
               	FileSaver: FileSaver,
               	Blob: Blob,
                procedureService: procedureService,
                userService: userService,
                $interval: $intervalSpy,
                timeService: timeService
            });
        });
    });

    it('should define the procedureCtrl controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define sort type and sort reverse variables', function() {
        expect(scope.sortType).toBeDefined();
        expect(scope.sortType).toEqual('procedurelastuse');
        expect(scope.sortReverse).toBeDefined();
        expect(scope.sortReverse).toEqual(false);
    });

    it('should call $interval one time', function(){
        expect($intervalSpy).toHaveBeenCalled();
        expect($intervalSpy.calls.count()).toBe(1);
    });

    it('should call $interval on showList', function(){
        expect($intervalSpy).toHaveBeenCalledWith(scope.showList, 2000);
    });

    it('should define submit function', function(){
        expect(scope.submit).toBeDefined();
    });

    it('should define upload function', function(){
        expect(scope.upload).toBeDefined();
    });

    it('should define showList function', function(){
        expect(scope.showList).toBeDefined();
    });

    it('should define download function', function(){
        expect(scope.download).toBeDefined();
    });

    it('should define changeColor function', function(){
        expect(scope.changeColor).toBeDefined();
    });


    it('should call submit if the form is valid but not upload if the index already exists', function(){

    	spyOn(windowMock, 'alert');
    	deferredProcedureList.resolve({ data : result,status:200});

    	scope.upload_form = { $valid: true ,$setPristine : function(){}}
    	scope.config = {file: { name : '1.1 - Audacy Zero - OBC Bootup.xlsx'}}
    
    	scope.submit();
  		expect(scope.upload_form).toBeDefined();
  		expect(scope.config).toBeDefined();
  		scope.$digest();
        expect(procedureService.getProcedureList).toHaveBeenCalled();
        expect(windowMock.alert).toHaveBeenCalledWith('This file number already exists in the list with a different title.Please try uploading with a new index number!');
        expect(scope.config).toEqual({});      

    });

    it('should call submit if the form is valid and upload if it is a new index procedure', function(){

    	 var rep = [{
            "_id": "5a78b26a5fa10701004acb4c",
            "instances": [
                {
                    "openedBy": "Taruni Gattu(VIP)",
                    "Steps": [
                        {
                            "step": "1.0",
                            "info": "034.11:26:35 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "1.1",
                            "info": "034.11:26:36 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "1.2",
                            "info": "034.11:26:37 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.0",
                            "info": "034.11:26:38 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.1.0",
                            "info": "034.11:26:39 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.1.1",
                            "info": "034.11:26:40 UTC Taruni Gattu(VIP)"
                        }
                    ],
                    "closedBy": "Taruni Gattu(VIP)",
                    "startedAt": "2018 - 034.11:26:35 UTC",
                    "completedAt": "2018 - 034.11:26:40 UTC",
                    "revision": 1,
                    "running": false
                },
                {
                    "openedBy": "Taruni Gattu(VIP)",
                    "Steps": [
                        {
                            "step": "1.0",
                            "info": ""
                        },
                        {
                            "step": "1.1",
                            "info": ""
                        },
                        {
                            "step": "1.2",
                            "info": ""
                        },
                        {
                            "step": "2.0",
                            "info": "034.11:26:49 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.1.0",
                            "info": "034.11:26:50 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.1.1",
                            "info": ""
                        }
         
                    ],
                    "closedBy": "",
                    "startedAt": "2018 - 034.11:26:49 UTC",
                    "completedAt": "",
                    "revision": 2,
                    "running": true
                }
            ],
            "procedure": {
                "sections": [
                    {
                        "Content": "Pre-Action Safety Information",
                        "Type": "Heading",
                        "Role": "MD",
                        "Step": "1.0"
                    },
                    {
                        "Reference": "http://somewhere on the net",
                        "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.",
                        "Type": "Warning",
                        "Role": "MD",
                        "Step": "1.1"
                    },
                    {
                        "Content": "Make required safety announcement on VL-AZERO",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "1.2"
                    },
                    {
                        "Content": "Close Procedure",
                        "Role": "MD",
                        "Step": "2.0"
                    },
                    {
                        "Content": "Update the shift log with procedure close status / notes",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.0"
                    },
                    {
                        "Content": "Close the procedure in Quantum (complete this step)",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.1"
                    } 
                ],
                "eventname": "Audacy Zero",
                "lastuse": "2018 - 034.11:26:50 UTC",
                "title": "Audacy Zero - Procedure Example",
                "id": "1.3"
            },
            "__v": 6
        },
        {
            "_id": "5a78b2745fa10701004acb4d",
            "instances": [
                {
                    "openedBy": "Taruni Gattu(VIP)",
                    "Steps": [
                        {
                            "step": "1.0",
                            "info": "034.11:26:58 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "1.1",
                            "info": "034.11:26:59 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "1.2",
                            "info": ""
                        },
                        {
                            "step": "2.0",
                            "info": ""
                        },
                        {
                            "step": "2.1.0",
                            "info": ""
                        },
                        {
                            "step": "2.1.1",
                            "info": ""
                        }
                    ],
                    "closedBy": "",
                    "startedAt": "2018 - 034.11:26:58 UTC",
                    "completedAt": "",
                    "revision": 1,
                    "running": true
                }
            ],
            "procedure": {
                "sections": [
                    {
                        "Content": "Pre-Action Safety Information",
                        "Type": "Heading",
                        "Role": "MD",
                        "Step": "1.0"
                    },
                    {
                        "Reference": "http://somewhere on the net",
                        "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.",
                        "Type": "Warning",
                        "Role": "MD",
                        "Step": "1.1"
                    },
                    {
                        "Content": "Make required safety announcement on VL-AZERO",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "1.2"
                    },
                    {
                        "Content": "Close Procedure",
                        "Role": "MD",
                        "Step": "2.0"
                    },
                    {
                        "Content": "Update the shift log with procedure close status / notes",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.0"
                    },
                    {
                        "Content": "Close the procedure in Quantum (complete this step)",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.1.1"
                    }
                ],
                "eventname": "Audacy Zero",
                "lastuse": "2018 - 034.11:26:59 UTC",
                "title": "Audacy Zero - OBC Bootup",
                "id": "1.2"
            },
            "__v": 3
        }];

        var userdetails = '070.10:10:50 UTC John Smith(MD)';
    	spyOn(windowMock, 'alert');
    	spyOn(scope, "upload");
    	deferredProcedureList.resolve({ data : rep,status:200});

    	scope.upload_form = { $valid: true ,$setPristine : function(){}};
    	scope.config = {file: { name : '1.1 - Audacy Zero - OBC Bootup.xlsx'}};
    
    	scope.submit();
  		expect(scope.upload_form).toBeDefined();
  		expect(scope.config).toBeDefined();
  		expect(scope.upload).toBeDefined();

  		scope.$digest();
        expect(procedureService.getProcedureList).toHaveBeenCalled();
        expect(scope.count).toEqual(0);
        expect(scope.upload).toHaveBeenCalled();
        expect(scope.upload).toHaveBeenCalledWith(scope.config.file,userdetails);

    });


	it('should alert the user if the filename is not in the desired format(1.1 - Audacy Zero - OBC Bootup.xlsx)', function(){
        spyOn(windowMock, 'alert');
        scope.upload_form = { $valid: true ,$setPristine : function(){}};
    	scope.config = {file: { name : '1.1 - Audacy Zero OBC Bootup.xlsx'}};
    	scope.submit();
    	expect(scope.upload_form).toBeDefined();
  		expect(scope.config).toBeDefined();
  		expect(scope.upload).toBeDefined();
  		expect(windowMock.alert).toHaveBeenCalledWith("The excel file must be named in 'index - eventname - title.xlsx' format.Eg: '1.1 - Audacy Zero - OBC Bootup.xlsx'");
  		expect(scope.config).toEqual({});
    });


   	it('should alert the user if no valid excel file is passed)', function(){
        spyOn(windowMock, 'alert');
        scope.upload_form = { $valid: true ,$setPristine : function(){}};
        scope.config = {file: false};
    	scope.submit();
    	expect(scope.upload_form).toBeDefined();
  		expect(scope.upload).toBeDefined();
  		expect(windowMock.alert).toHaveBeenCalledWith("No file passed. Please upload an xlsx file.");
    });

   	it('should upload file when upload() is called and successfully alert the user', function(){

   		spyOn(windowMock, 'alert');
   		scope.upload_form = {
            $valid: true,
            $setPristine : function(){}
        };
        scope.config = {
            file: {
                name :  "1.1 - Audacy Zero OBC Bootup.xlsx"
            }
        };

        var resp = {
            config: {
                data: {
                    file:{
                        name: '1.1 - Audacy Zero OBC Bootup.xlsx'
                    }
                }
            },
 			error_code : 0,
           	err_desc : null
        }

        var mockFile = {
            "name": "1.1 - Audacy Zero OBC Bootup.xlsx", 
            "size": 10759, 
            "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        };

        httpBackend.when('POST', '/upload').respond(200, resp);
        scope.upload(mockFile);    
        httpBackend.flush();
        expect(windowMock.alert).toHaveBeenCalledWith('Success: 1.1 - Audacy Zero OBC Bootup.xlsx uploaded.');
        expect(scope.config).toEqual({});

    });

    it('should not upload the file if the index number already exits in the database and alert the user.', function(){

   		spyOn(windowMock, 'alert');
   		scope.upload_form = {
            $valid: true,
            $setPristine : function(){}
        };
        scope.config = {
            file: {
                name :  "1.1 - Audacy Zero OBC Bootup.xlsx"
            }
        };

        var resp = {
            config: {
                data: {
                    file:{
                        name: '1.1 - Audacy Zero OBC Bootup.xlsx'
                    }
                }
            },
 			error_code : 1,
           	err_desc : null
        }

        var mockFile = {
            "name": "1.1 - Audacy Zero OBC Bootup.xlsx", 
            "size": 10759, 
            "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        };

        httpBackend.when('POST', '/upload').respond(200, resp);
        scope.upload(mockFile);    
        httpBackend.flush();
        expect(windowMock.alert).toHaveBeenCalledWith('An error occured.This procedure already exists.Please upload with a new index number');
        expect(scope.config).toEqual({});

    });

    it('should not upload the file if the file does not have Step,Type,Role,Content mandatory columns and alert the user.', function(){

   		spyOn(windowMock, 'alert');
   		scope.upload_form = {
            $valid: true,
            $setPristine : function(){}
        };
        scope.config = {
            file: {
                name :  "1.1 - Audacy Zero OBC Bootup.xlsx"
            }
        };

        var resp = {
            config: {
                data: {
                    file:{
                        name: '1.1 - Audacy Zero OBC Bootup.xlsx'
                    }
                }
            },
 			error_code : 0,
           	err_desc : 'Not a valid file'
        }

        var mockFile = {
            "name": "1.1 - Audacy Zero OBC Bootup.xlsx", 
            "size": 10759, 
            "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        };

        httpBackend.when('POST', '/upload').respond(200, resp);
        scope.upload(mockFile);    
        httpBackend.flush();
        expect(windowMock.alert).toHaveBeenCalledWith('Not a valid file.Required Columns are Step,Type,Role,Content!');
        expect(scope.config).toEqual({});

    });

    it('should not upload the file if there is any other error in uploading and alert the user.', function(){

   		spyOn(windowMock, 'alert');
   		scope.upload_form = {
            $valid: true,
            $setPristine : function(){}
        };
        scope.config = {
            file: {
                name :  "1.1 - Audacy Zero OBC Bootup.xlsx"
            }
        };

        var resp = {
            config: {
                data: {
                    file:{
                        name: '1.1 - Audacy Zero OBC Bootup.xlsx'
                    }
                }
            },
 			error_code : null,
           	err_desc : null
        }

        var mockFile = {
            "name": "1.1 - Audacy Zero OBC Bootup.xlsx", 
            "size": 10759, 
            "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        };

        httpBackend.when('POST', '/upload').respond(200, resp);
        scope.upload(mockFile);    
        httpBackend.flush();
        expect(windowMock.alert).toHaveBeenCalledWith('An error occured while uploading.Please try again!');
        expect(scope.config).toEqual({});

    });

    it('should define procedure list', function() {
    	spyOn(windowMock, 'alert');
   		spyOn(scope, 'showList');
   		scope.upload_form = {
            $valid: true,
            $setPristine : function(){}
        };
        scope.config = {
            file: {
                name :  "1.1 - Audacy Zero OBC Bootup.xlsx"
            }
        };

        var resp = {
            config: {
                data: {
                    file:{
                        name: '1.1 - Audacy Zero OBC Bootup.xlsx'
                    }
                }
            },
 			error_code : 0,
           	err_desc : null
        }

        var mockFile = {
            "name": "1.1 - Audacy Zero OBC Bootup.xlsx", 
            "size": 10759, 
            "type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        };

        var plist = [{
            id: '1.1', 
            title: 'Audacy Zero - Procedure Example', 
            lastuse: '2018 - 034.11:26:50 UTC', 
            instances: [ 
                {
                    "openedBy": "Taruni Gattu(VIP)",
                    "Steps": [
                        {
                            "step": "1.0",
                            "info": "034.11:26:35 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "1.1",
                            "info": "034.11:26:36 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "1.2",
                            "info": "034.11:26:37 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.0",
                            "info": "034.11:26:38 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.1.0",
                            "info": "034.11:26:39 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.1.1",
                            "info": "034.11:26:40 UTC Taruni Gattu(VIP)"
                        }
                    ],
                    "closedBy": "Taruni Gattu(VIP)",
                    "startedAt": "2018 - 034.11:26:35 UTC",
                    "completedAt": "2018 - 034.11:26:40 UTC",
                    "revision": 1,
                    "running": false
                },
                {
                    "openedBy": "Taruni Gattu(VIP)",
                    "Steps": [
                        {
                            "step": "1.0",
                            "info": ""
                        },
                        {
                            "step": "1.1",
                            "info": ""
                        },
                        {
                            "step": "1.2",
                            "info": ""
                        },
                        {
                            "step": "2.0",
                            "info": "034.11:26:49 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.1.0",
                            "info": "034.11:26:50 UTC Taruni Gattu(VIP)"
                        },
                        {
                            "step": "2.1.1",
                            "info": ""
                        }
                    ],
                    "closedBy": "",
                    "startedAt": "2018 - 034.11:26:49 UTC",
                    "completedAt": "",
                    "revision": 2,
                    "running": true
                }
            ], 
            running: 1, 
            archived: 1
        }, 
        {   
            id: '1.2', 
            title: 'Audacy Zero - OBC Bootup', 
            lastuse: '2018 - 034.11:26:59 UTC', 
            instances: [
                {
                    "openedBy": "Taruni Gattu(VIP)",
                    "Steps": [
                            {
                                "step": "1.0",
                                "info": "034.11:26:58 UTC Taruni Gattu(VIP)"
                            },
                            {
                                "step": "1.1",
                                "info": "034.11:26:59 UTC Taruni Gattu(VIP)"
                            },
                            {
                                "step": "1.2",
                                "info": ""
                            },
                            {
                                "step": "2.0",
                                "info": ""
                            },
                            {
                                "step": "2.1.0",
                                "info": ""
                            },
                            {
                                "step": "2.1.1",
                                "info": ""
                            }
                        ],
                        "closedBy": "",
                        "startedAt": "2018 - 034.11:26:58 UTC",
                        "completedAt": "",
                        "revision": 1,
                        "running": true
                    }], 
            running: 1, 
            archived: 0
        }];

        deferredProcedureList.resolve({status:200,data:result});
        var calls = $intervalSpy.calls.all(); //gets all the intervals called
        var args0 = calls[0].args; // to get the first interval called - here call interval on showList
        args0[0]();
       // console.log(args0[0]());

        expect(scope.showList).toBeDefined();
        scope.showList();
       
        expect(scope.showList).toHaveBeenCalled();
        scope.$digest();
        expect(procedureService.getProcedureList).toHaveBeenCalled();
        expect(scope.procedurelist).toBeDefined();
        expect(scope.procedurelist).toEqual(plist);

    });

    it('should download a procedure on call on download function', function(){
    	var file = "filebinarydata";
        deferreddownloadProcedure.resolve({ data :file,status:200});
        scope.$digest();
      	scope.download('1.1','Audacy Zero - OBC');
     
     	expect(procedureService.downloadProcedure).toHaveBeenCalledWith('1.1','Audacy Zero - OBC');

    });

    it('should save a procedure and change Color of the header panel to blue when procedure is live and createinstance is true', function(){
        spyOn(procedureService, "setProcedureName").and.callThrough();
        spyOn(procedureService, "setHeaderStyles").and.callThrough();
        scope.clock = {
            days : '070',
            minutes : '10',
            hours : '10',
            seconds : '50',
            utc : '070.10:10:50 UTC',
            year : '2018'
        };
        scope.changeColor("Live","1.1","Procedure Example",true);
        expect(procedureService.saveProcedureInstance).toHaveBeenCalledWith('1.1','John Smith(MD)','2018 - 070.10:10:50 UTC');
        expect(procedureService.setHeaderStyles).toHaveBeenCalledWith('none','block','#05aec3f2','#ffffff','none','inline-block',1000);
        expect(procedureService.setProcedureName).toHaveBeenCalledWith("1.1","Procedure Example","Open Procedure");
        expect(timeService.getTime).toHaveBeenCalled();
    });

    it('should change Color of the header panel to blue when procedure is live and createinstance is false', function(){
        spyOn(procedureService, "setProcedureName").and.callThrough();
        spyOn(procedureService, "setHeaderStyles").and.callThrough();
        scope.changeColor("Live","1.1","Procedure Example",false);
        expect(procedureService.setHeaderStyles).toHaveBeenCalledWith('none','block','#05aec3f2','#ffffff','none','inline-block',1000);
        expect(procedureService.setProcedureName).toHaveBeenCalledWith("1.1","Procedure Example","Open Procedure");
    });

    it('should change Color of the header panel to black when procedure is archived', function(){
        spyOn(procedureService, "setProcedureName").and.callThrough();
        spyOn(procedureService, "setHeaderStyles").and.callThrough();
        scope.changeColor("Archived","1.1","Procedure Example",false);
        expect(procedureService.setHeaderStyles).toHaveBeenCalledWith('none','block','#000000','#ffffff','none','inline-block',1000);
        expect(procedureService.setProcedureName).toHaveBeenCalledWith("1.1","Procedure Example","AS-Run Archive");
    });


    it('should cancel interval when scope is destroyed', function(){
        spyOn($intervalSpy, 'cancel');
        scope.$destroy();
        expect($intervalSpy.cancel.calls.count()).toBe(2);
    });

});