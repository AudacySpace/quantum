describe('Test Suite for Procedure Controller', function () {
    var controller,scope,procedureService,userService,$interval,Blob,FileSaver,deferred,$q,httpBackend,timeService,$location,rootScope;
    var windowMock = {
        innerWidth: 1000,
        user : {
            currentRole : {callsign : 'MD'}
        },
        location:{
            pathname:""
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

            $intervalSpy = jasmine.createSpy('$interval', $interval);
            $q = _$q_;
            procedureService = _procedureService_;
            userService = _userService_;
            httpBackend = _$httpBackend_;
            timeService = _timeService_;
            
            spyOn($location,'url').and.returnValue('/dashboard/procedure/running/1.1');

            deferredProcedureList = _$q_.defer();
            spyOn(procedureService, "getProcedureList").and.returnValue(deferredProcedureList.promise);

            deferreddownloadProcedure = _$q_.defer();
            spyOn(procedureService, "downloadProcedure").and.returnValue(deferreddownloadProcedure.promise);

            deferredProcedureInstance = _$q_.defer();
            spyOn(procedureService, "saveProcedureInstance").and.returnValue(deferredProcedureInstance.promise);

            spyOn(userService, "getUserName").and.returnValue('John Smith');
            spyOn(userService, "getUserEmail").and.returnValue('jsmith@gmail.com');
            spyOn(procedureService,"displayAlert").and.returnValue(true);

            deferredUserStatus = _$q_.defer();
            spyOn(procedureService, "setUserStatus").and.returnValue(deferredUserStatus.promise);

            spyOn(procedureService,'getProcedureName').and.returnValue({
                id:"1.1",
                name:"Audacy Zero - Procedure Example",
                status:"",
                fullname:"Audacy Zero - Procedure Example.xlsx"
            });

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
                timeService: timeService,
                $uibModal : modalInstance
            });
        });
    });

    it('should define the procedureCtrl controller', function() {
        expect(controller).toBeDefined();
    });

    it('should define sort type and sort reverse variables', function() {
        expect(scope.sortType).toBeDefined();
        expect(scope.sortType).toEqual('id');
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

    it('should define showList function', function(){
        expect(scope.showList).toBeDefined();
    });

    it('should define download function', function(){
        expect(scope.download).toBeDefined();
    });

    it('should define changeColor function', function(){
        expect(scope.changeColor).toBeDefined();
    });

    it('should define procedure list', function() {
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
        expect(procedureService.saveProcedureInstance).toHaveBeenCalledWith('1.1','John Smith(MD)','2018 - 070.10:10:50 UTC','John Smith',"jsmith@gmail.com",true);
        expect(procedureService.setHeaderStyles).toHaveBeenCalledWith('none','block','#05aec3f2','#ffffff','none','inline-block',1000);
        expect(procedureService.setProcedureName).toHaveBeenCalledWith("1.1","Procedure Example","Live");
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
        expect($intervalSpy.cancel.calls.count()).toBe(1);
    });

});