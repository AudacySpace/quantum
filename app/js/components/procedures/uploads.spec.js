describe('Test Suite for Upload Procedure Controller', function () {
    var controller,scope,procedureService,userService,dashboardService,deferred,$q,httpBackend,timeService,rootScope;
    var windowMock = {
        innerWidth: 1000,
        user : {
            currentRole : {callsign : 'MD'}
        }
    };

    var modalInstance = { open: function() {} };

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
            "procedureID": "1.1",
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
            "procedureID": "1.2",
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

        inject(function($controller, $rootScope, _$q_, _procedureService_,$routeParams,_userService_,$interval,_$httpBackend_,_timeService_,$location){
            scope = $rootScope.$new();
            rootScope = $rootScope;
            $q = _$q_;
            procedureService = _procedureService_;
            userService = _userService_;
            httpBackend = _$httpBackend_;
            timeService = _timeService_;
            
            spyOn($location,'url').and.returnValue('/dashboard/procedure/running/1.1');

            deferredProcedureList = _$q_.defer();
            spyOn(procedureService, "getProcedureList").and.returnValue(deferredProcedureList.promise);

            spyOn(userService, "getUserName").and.returnValue('John Smith');
            spyOn(procedureService,"displayAlert").and.returnValue(true);

            spyOn(timeService, "getTime").and.returnValue({
                days : '070',
                minutes : '10',
                hours : '10',
                seconds : '50',
                utc : '070.10:10:50 UTC',
                year : '2018'
            });

            controller = $controller('uploadCtrl', {
                $scope: scope,
                procedureService: procedureService,
                userService: userService,
                timeService: timeService,
                $uibModal : modalInstance
            });
        });
    });

    it('should define the uploadCtrl controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define submit function', function(){
        expect(scope.submit).toBeDefined();
    });

    it('should define upload function', function(){
        expect(scope.upload).toBeDefined();
    });

    // it('should call submit if the form is valid but not upload if the index already exists', function(){

    // 	deferredProcedureList.resolve({ data : result,status:200});

    // 	scope.upload_form = { $valid: true ,$setPristine : function(){}}
    // 	scope.config = {file: { name : '1.1 - Audacy Zero - OBC Bootup.xlsx'}}

    // 	scope.submit();
  		// expect(scope.upload_form).toBeDefined();
  		// expect(scope.config).toBeDefined();
  		// scope.$digest();
    //     expect(procedureService.getProcedureList).toHaveBeenCalled();
    //     expect(scope.usermessage).toEqual('This file number already exists in the list with a different title.Please try uploading with a new index number!');
    //     expect(scope.config).toEqual({});      

    // });

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
                "procedureID": "1.3",
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
                "procedureID": "1.2",
            "__v": 3
        }];

        var userdetails = '070.10:10:50 UTC John Smith(MD)';
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


    it('should call submit if the form is valid and update the procedure when no saved instances exist', function(){

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
                "procedureID": "1.3",
            "__v": 6
        },
        {
            "_id": "5a78b2745fa10701004acb4d",
            "instances": [],
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
                "procedureID": "1.2",
            "__v": 3
        }];

        var userdetails = '070.10:10:50 UTC John Smith(MD)';
        var fakeModal = {
            result: {
                then: function(confirmCallback, cancelCallback) {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }
            }
        };

        var modalResult = {};
        var mockModalInstance = { result: $q.resolve(modalResult,true) };
        spyOn(mockModalInstance.result, 'then').and.callThrough();
        spyOn(modalInstance, 'open').and.returnValue(mockModalInstance);
        spyOn(scope, "upload");
        deferredProcedureList.resolve({ data : rep,status:200});

        scope.upload_form = { $valid: true ,$setPristine : function(){}};
        scope.config = {file: { name : '1.2 - Audacy Zero - OBC Bootup.xlsx'}};
    
        scope.submit();
        expect(scope.upload_form).toBeDefined();
        expect(scope.config).toBeDefined();
        expect(scope.upload).toBeDefined();

        scope.$digest();
        expect(procedureService.getProcedureList).toHaveBeenCalled();
        expect(modalInstance.open).toHaveBeenCalled();
        expect(mockModalInstance.result.then).toHaveBeenCalledWith(jasmine.any(Function),jasmine.any(Function));
        expect(scope.count).toEqual(0);
        expect(scope.upload).toHaveBeenCalled();
        expect(scope.upload).toHaveBeenCalledWith(scope.config.file,userdetails);

    });


	it('should alert the user if the filename is not in the desired format(1.1 - Audacy Zero - OBC Bootup.xlsx)', function(){
        scope.upload_form = { $valid: true ,$setPristine : function(){}};
    	scope.config = {file: { name : '1.1 - Audacy Zero OBC Bootup.xlsx'}};
    	scope.submit();
    	expect(scope.upload_form).toBeDefined();
  		expect(scope.config).toBeDefined();
  		expect(scope.upload).toBeDefined();
        expect(scope.usermessage).toEqual("The excel file must be named in 'index - eventname - title.xlsx' format.Eg: '1.1 - Audacy Zero - OBC Bootup.xlsx'");
  		expect(scope.config).toEqual({});
    });


   	it('should alert the user if no valid excel file is passed)', function(){
        scope.upload_form = { $valid: true ,$setPristine : function(){}};
        scope.config = false;
    	scope.submit();
    	expect(scope.upload_form).toBeDefined();
  		expect(scope.upload).toBeDefined();
        expect(scope.usermessage).toEqual("No file passed. Please upload an xlsx file.");
        expect(scope.config).toEqual({});
    });

    // it('should alert the user if a procedure with a same file name is added.', function(){
    //     var rep = [{
    //         "_id": "5a78b26a5fa10701004acb4c",
    //         "instances": [
    //             {
    //                 "openedBy": "Taruni Gattu(VIP)",
    //                 "Steps": [
    //                     {
    //                         "step": "1.0",
    //                         "info": "034.11:26:35 UTC Taruni Gattu(VIP)"
    //                     },
    //                     {
    //                         "step": "1.1",
    //                         "info": "034.11:26:36 UTC Taruni Gattu(VIP)"
    //                     },
    //                     {
    //                         "step": "1.2",
    //                         "info": "034.11:26:37 UTC Taruni Gattu(VIP)"
    //                     },
    //                     {
    //                         "step": "2.0",
    //                         "info": "034.11:26:38 UTC Taruni Gattu(VIP)"
    //                     },
    //                     {
    //                         "step": "2.1.0",
    //                         "info": "034.11:26:39 UTC Taruni Gattu(VIP)"
    //                     },
    //                     {
    //                         "step": "2.1.1",
    //                         "info": "034.11:26:40 UTC Taruni Gattu(VIP)"
    //                     }
    //                 ],
    //                 "closedBy": "Taruni Gattu(VIP)",
    //                 "startedAt": "2018 - 034.11:26:35 UTC",
    //                 "completedAt": "2018 - 034.11:26:40 UTC",
    //                 "revision": 1,
    //                 "running": false
    //             },
    //             {
    //                 "openedBy": "Taruni Gattu(VIP)",
    //                 "Steps": [
    //                     {
    //                         "step": "1.0",
    //                         "info": ""
    //                     },
    //                     {
    //                         "step": "1.1",
    //                         "info": ""
    //                     },
    //                     {
    //                         "step": "1.2",
    //                         "info": ""
    //                     },
    //                     {
    //                         "step": "2.0",
    //                         "info": "034.11:26:49 UTC Taruni Gattu(VIP)"
    //                     },
    //                     {
    //                         "step": "2.1.0",
    //                         "info": "034.11:26:50 UTC Taruni Gattu(VIP)"
    //                     },
    //                     {
    //                         "step": "2.1.1",
    //                         "info": ""
    //                     }
         
    //                 ],
    //                 "closedBy": "",
    //                 "startedAt": "2018 - 034.11:26:49 UTC",
    //                 "completedAt": "",
    //                 "revision": 2,
    //                 "running": true
    //             }
    //         ],
    //         "sections": [
    //                 {
    //                     "Content": "Pre-Action Safety Information",
    //                     "Type": "Heading",
    //                     "Role": "MD",
    //                     "Step": "1.0"
    //                 },
    //                 {
    //                     "Reference": "http://somewhere on the net",
    //                     "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.",
    //                     "Type": "Warning",
    //                     "Role": "MD",
    //                     "Step": "1.1"
    //                 },
    //                 {
    //                     "Content": "Make required safety announcement on VL-AZERO",
    //                     "Type": "Action",
    //                     "Role": "MD",
    //                     "Step": "1.2"
    //                 },
    //                 {
    //                     "Content": "Close Procedure",
    //                     "Role": "MD",
    //                     "Step": "2.0"
    //                 },
    //                 {
    //                     "Content": "Update the shift log with procedure close status / notes",
    //                     "Type": "Action",
    //                     "Role": "MD",
    //                     "Step": "2.1.0"
    //                 },
    //                 {
    //                     "Content": "Close the procedure in Quantum (complete this step)",
    //                     "Type": "Action",
    //                     "Role": "MD",
    //                     "Step": "2.1.1"
    //                 } 
    //             ],
    //             "eventname": "Audacy Zero",
    //             "lastuse": "2018 - 034.11:26:50 UTC",
    //             "title": "Audacy Zero - Procedure Example",
    //             "procedureID": "1.3",
    //         "__v": 6
    //     },
    //     {
    //         "_id": "5a78b2745fa10701004acb4d",
    //         "instances": [
    //             {
    //                 "openedBy": "Taruni Gattu(VIP)",
    //                 "Steps": [
    //                     {
    //                         "step": "1.0",
    //                         "info": "034.11:26:58 UTC Taruni Gattu(VIP)"
    //                     },
    //                     {
    //                         "step": "1.1",
    //                         "info": "034.11:26:59 UTC Taruni Gattu(VIP)"
    //                     },
    //                     {
    //                         "step": "1.2",
    //                         "info": ""
    //                     },
    //                     {
    //                         "step": "2.0",
    //                         "info": ""
    //                     },
    //                     {
    //                         "step": "2.1.0",
    //                         "info": ""
    //                     },
    //                     {
    //                         "step": "2.1.1",
    //                         "info": ""
    //                     }
    //                 ],
    //                 "closedBy": "",
    //                 "startedAt": "2018 - 034.11:26:58 UTC",
    //                 "completedAt": "",
    //                 "revision": 1,
    //                 "running": true
    //             }
    //         ],
    //         "sections": [
    //                 {
    //                     "Content": "Pre-Action Safety Information",
    //                     "Type": "Heading",
    //                     "Role": "MD",
    //                     "Step": "1.0"
    //                 },
    //                 {
    //                     "Reference": "http://somewhere on the net",
    //                     "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder. Failure to consider guidelines may result in personal injury or death.",
    //                     "Type": "Warning",
    //                     "Role": "MD",
    //                     "Step": "1.1"
    //                 },
    //                 {
    //                     "Content": "Make required safety announcement on VL-AZERO",
    //                     "Type": "Action",
    //                     "Role": "MD",
    //                     "Step": "1.2"
    //                 },
    //                 {
    //                     "Content": "Close Procedure",
    //                     "Role": "MD",
    //                     "Step": "2.0"
    //                 },
    //                 {
    //                     "Content": "Update the shift log with procedure close status / notes",
    //                     "Type": "Action",
    //                     "Role": "MD",
    //                     "Step": "2.1.0"
    //                 },
    //                 {
    //                     "Content": "Close the procedure in Quantum (complete this step)",
    //                     "Type": "Action",
    //                     "Role": "MD",
    //                     "Step": "2.1.1"
    //                 }
    //             ],
    //             "eventname": "Audacy Zero",
    //             "lastuse": "2018 - 034.11:26:59 UTC",
    //             "title": "Audacy Zero - OBC Bootup",
    //             "procedureID": "1.2",
    //         "__v": 3
    //     }];

    //     var userdetails = '070.10:10:50 UTC John Smith(MD)';
    //     spyOn(scope, "upload");
    //     deferredProcedureList.resolve({ data : rep,status:200});

    //     scope.upload_form = { $valid: true ,$setPristine : function(){}};
    //     scope.config = {file: { name : '1.3 - Audacy Zero - Procedure Example.xlsx'}};
    
    //     scope.submit();
    //     scope.$digest();
    //     expect(procedureService.getProcedureList).toHaveBeenCalled();
    //     expect(scope.usermessage).toEqual('There is already a procedure with the same filename and it has saved instances.Please try uploading a different file.')
    //     expect(scope.config).toEqual({});
    // });



   	it('should upload file when upload() is called and successfully alert the user', function(){
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
        scope.upload(mockFile,'034.11:26:58 UTC Taruni Gattu(VIP)');    
        httpBackend.flush();
        expect(scope.usermessage).toEqual('Success: File 1.1 - Audacy Zero OBC Bootup.xlsx uploaded.');
        expect(scope.config).toEqual({});

    });

    it('should not upload the file if the file does not have Step,Type,Role,Content mandatory columns and alert the user.', function(){
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
        scope.upload(mockFile,'034.11:26:58 UTC Taruni Gattu(VIP)');    
        httpBackend.flush();
        expect(scope.usermessage).toEqual('Error: Not a valid file.Required Columns are Step,Type,Role,Content!');
        expect(scope.config).toEqual({});

    });

    it('should not upload the file if there is any other error in uploading and alert the user.', function(){
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
        scope.upload(mockFile,'034.11:26:58 UTC Taruni Gattu(VIP)');    
        httpBackend.flush();
        expect(scope.usermessage).toEqual('An error occured while uploading.Please try again!');
        expect(scope.config).toEqual({});

    });

});