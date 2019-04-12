describe('Test Suite for Procedure Service', function () {
    var windowMock = {
        user : {
            currentRole : {}
        },
        location: {
            pathname:""
        }
    };


    var procSection = [
        {
            "Content": "Pre-Action Safety Information",
            "Type": "Heading",
            "Role": "MD",
            "Step": "1.0",
            "typeicon": '',
            "typecolor": { 'color': '' },
            "contenttype": 'String',
            "buttonStatus": '',
            "comments": ''
        },
        {
            "Reference": "http://somewhere on the net",
            "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder.",
            "Type": "Warning",
            "Role": "MD",
            "Step": "1.1",
            "typeicon": 'fa fa-exclamation-triangle',
            "typecolor": { 'color': '' },
            "contenttype": 'AlertInfo',
            "buttonStatus": '',
            "comments": ''
        },
        {
            "Content": "Make required safety announcement on VL-AZERO",
            "Type": "Action",
            "Role": "MD",
            "Step": "1.2",
            "typeicon": 'fa fa-cog',
            "typecolor": { 'color': '' },
            "contenttype": 'String',
            "buttonStatus": '',
            "comments": ''
        },
        {
            "Content": "Establish Com Link",
            "Type": "Heading",
            "Role": "SYS,CC",
            "Step": "2.0",
            "typeicon": '',
            "typecolor": { 'color': '' },
            "contenttype": 'String',
            "buttonStatus": '',
            "comments": ''
        },
        {
            "Content": "Prepare Ground Support Equipment",
            "Type": "Heading",
            "Role": "CC",
            "Step": "2.1.0",
            "typeicon": '',
            "typecolor": { 'color': '' },
            "contenttype": 'String',
            "buttonStatus": '',
            "comments": ''
        },
        {
            "Content": "Powerup GSE Rack if necessary",
            "Type": "Action",
            "Role": "CC",
            "Step": "2.1.1",
            "typeicon": 'fa fa-cog',
            "typecolor": { 'color': '' },
            "contenttype": 'String',
            "buttonStatus": '',
            "comments": ''
        },
        {
            "Content": "Verify UPS battery is fully charged, record charge state",
            "Type": "Record",
            "Role": "CC",
            "Step": "2.1.2",
            "typeicon": 'fa fa-pencil-square-o',
            "typecolor": { 'color': '' },
            "contenttype": 'String',
            "buttonStatus": '',
            "comments": ''
        },
        {
            "Content": 'Verify that OBC is fully booted and in state \"idle\"',
            "Type": "Verify",
            "Role": "SYS ",
            "Step": "2.2.0",
            "typeicon": 'fa fa-check-circle-o',
            "typecolor": { 'color': '' },
            "contenttype": 'String',
            "buttonStatus": '',
            "comments": ''
        },
        {
            "Content": "Close Procedure",
            "Role": "MD",
            "Step": "3.0",
            "Type": "Heading",
            "typeicon": '',
            "typecolor":{ 'color': '' },
            "contenttype": 'String',
            "buttonStatus": '',
            "comments": ''
        },
        {
            "Content": "Update the shift log with procedure close status / notes",
            "Type": "Action",
            "Role": "MD",
            "Step": "3.1",
            "typeicon": 'fa fa-cog',
            "typecolor": { 'color': '' },
            "contenttype": 'String',
            "buttonStatus": '',
            "comments": ''
        },
        {
            "Content": "Close the procedure in Quantum (complete this step)",
            "Type": "Action",
            "Role": "MD",
            "Step": "3.2",
            "typeicon": 'fa fa-cog',
            "typecolor": { color: '' },
            "contenttype": 'String',
            "buttonStatus": '',
            "comments": ''
        }
    ];

    beforeEach(function () {
        // load the module
        module('quantum', function ($provide) {
            $provide.value('$window', windowMock);
        });

        // get your service, also get $httpBackend
        // $httpBackend will be a mock.
        inject(function (_$httpBackend_, _procedureService_,_$window_,_userService_) {
            procedureService = _procedureService_;
            httpBackend = _$httpBackend_;
            userService = _userService_;
        });
    });
 
    // make sure no expectations were missed in your tests.
    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    //gridService should exist in the application
    it('should define the service gridService', function() {
    	expect(procedureService).toBeDefined();
    });

    it('should be able to retrieve all the procedures from database', function () {
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
                    "closedBy": "",
                    "startedAt": "2018 - 034.11:26:34 UTC",
                    "completedAt": "",
                    "revision": 1,
                    "running": true
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

        var procedures;
        httpBackend.expectGET('/getProcedureList').respond(200, result);

        procedureService.getProcedureList().then( function(response){
            procedures = response.data;
            expect(response.status).toBe(200);
            expect(procedures).toBeDefined();
            expect(procedures.length).toEqual(2);
            expect(procedures).toEqual(result);
        });

        httpBackend.flush();
    });

    it('should define the default procedure variable', function() {
        expect(procedureService.procedure).toBeDefined();
        expect(procedureService.procedure).toEqual({ id:'',name:'',status:'',fullname:'' });
    });

    it('should define the setProcedureName function', function() {
        expect(procedureService.setProcedureName).toBeDefined();
    });

    it('should set the procedure name to empty when status is Home', function() {
        var status = 'Home'
        var id = '1.1';
        var name = 'Procedure Example';
        procedureService.setProcedureName(id,name,status);
        expect(procedureService.procedure).toEqual({ id : '',name : '',status : '',fullname : ''});

    });

    it('should set the procedure name when status is Live', function() {
        var status = 'Live'
        var id = '1.1';
        var name = 'Procedure Example';
        procedureService.setProcedureName(id,name,status);
        expect(procedureService.procedure).toEqual({ id : '1.1',name : 'Procedure Example',status : 'Live',fullname : 'Live:1.1 - Procedure Example'});

    });

    it('should set the procedure name when status is Open Procedure', function() {
        var status = 'Open Procedure'
        var id = '1.1';
        var name = 'Procedure Example';
        procedureService.setProcedureName(id,name,status);
        expect(procedureService.procedure).toEqual({ id : '1.1',name : 'Procedure Example',status : 'Open Procedure',fullname : 'Open Procedure:1.1 - Procedure Example'});

    });

    it('should set the procedure name when status is AS-Run Archive', function() {
        var status = 'AS-Run Archive'
        var id = '1.1';
        var name = 'Procedure Example';
        procedureService.setProcedureName(id,name,status);
        expect(procedureService.procedure).toEqual({ id : '1.1',name : 'Procedure Example',status : 'AS-Run Archive',fullname : 'AS-Run Archive:1.1 - Procedure Example'});
    });

    it('should define the getProcedureName function', function() {
        expect(procedureService.getProcedureName).toBeDefined();
    });

    it('should return the procedure object when getProcedureName is called', function() {
        expect(procedureService.getProcedureName()).toEqual({ id : '', name : '', status : '',fullname : '' });
    });

    it('should define the default icons variable', function() {
        expect(procedureService.icons).toBeDefined();
        expect(procedureService.icons).toEqual({ icon1style:'',icon2style:'',icon3style:'',icon4style:'' });
    });

    it('should define the default header variable', function() {
        expect(procedureService.header).toBeDefined();
        expect(procedureService.header).toEqual({ styles:{},namestyles:{}});
    });

    it('should set the icon styles and header styles when setHeaderStyles is called when screen width is less than 500px', function() {
        var icon1 = 'none';
        var icon2 = 'none';
        var icon3 = 'none';
        var icon4 = 'inline-block';
        var bgcolor = '#05aec3f2';
        var fontcolor = '#ffffff';
        var windowWidth = 450;

        procedureService.setHeaderStyles(icon1,icon2,bgcolor,fontcolor,icon3,icon4,windowWidth);
        expect(procedureService.icons).toEqual({ icon1style : { display : icon1},icon2style : {display: icon2},icon3style : {display : icon3},icon4style : {display :icon4}});
        expect(procedureService.header).toEqual({ styles : { backgroundColor:bgcolor,color:fontcolor},namestyles : {color:fontcolor}});

    });

    it('should set the icon styles and header styles when setHeaderStyles is called width screen width greater than 500px', function() {
        var icon1 = 'none';
        var icon2 = 'block';
        var icon3 = 'none';
        var icon4 = 'none';
        var bgcolor = '#05aec3f2';
        var fontcolor = '#ffffff';
        var windowWidth = 1125;

        procedureService.setHeaderStyles(icon1,icon2,bgcolor,fontcolor,icon3,icon4,windowWidth);
        expect(procedureService.icons).toEqual({ icon1style : { display : icon1},icon2style : {display: icon2},icon3style : {display : icon3},icon4style : {display :icon4}});
        expect(procedureService.header).toEqual({ styles : { backgroundColor:bgcolor,color:fontcolor},namestyles : {color:fontcolor}});

    });

    it('should return the header object when getHeaderStyles is called', function() {
        expect(procedureService.getHeaderStyles()).toEqual({ styles : {},namestyles : {}});
    });

    it('should return the icon object when getIconStyles is called', function() {
        expect(procedureService.getIconStyles()).toEqual({ icon1style:'',icon2style:'',icon3style:'',icon4style:'' });
    });

    it('should define the getProcedureSection function', function() {
        expect(procedureService.getProcedureSection).toBeDefined();
    });

    it('should return the icon object when getProcedureSection is called', function() {
        expect(procedureService.getProcedureSection([],"")).toEqual([]);
    });

    it('should return the procedure sections array when getProcedureSection is called', function() {
        var procedure = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '1','sectionbtn':{ 'styles': { 'color': '' } }},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } }},
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } }},
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '2','sectionbtn':{ 'styles':{ 'color': '' }}},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } }},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '21','sectionbtn':{ 'styles': { 'color': '' }}},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } } },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '22','sectionbtn': { 'styles': { 'color': '' }}},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'checkbox':false,'Type': 'Heading','typeicon': '','typecolor': { 'color': '' },'contenttype': 'String','buttonStatus': '','comments': '','subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }}},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }}},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true , 'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }}},
        ]
        expect(procedureService.getProcedureSection(procSection,"SYS")).toEqual(procedure);
    });

    it('should define the showPList function', function() {
        expect(procedureService.showPList).toBeDefined();
    });

    it('should return the list of steps array when showPList is called', function() {
        expect(procedureService.showPList("","","",[])).toEqual([]);
    });

    it('should return the list of steps array when showPList is called with headertype as mainheader', function() {
        var inputprocedure = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false },
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false },
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },

        ]
        var outputprocedure = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false },
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false },
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },

        ]
        expect(procedureService.showPList(0,1,"mainheader",inputprocedure)).toEqual(outputprocedure);
    });

    it('should return the list of steps array when showPList is called with headertype as subheader', function() {
        var inputprocedure = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false },
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false },
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },

        ]
        var outputprocedure = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false },
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false },
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },

        ]
        expect(procedureService.showPList(4,2.1,"subheader",inputprocedure)).toEqual(outputprocedure);
    });

    it('should return the list of steps array when showPList is called with headertype as listitem', function() {

        var inputprocedure = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false },
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false },
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true },
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true },

        ]
        expect(procedureService.showPList(1,1.1,"listitem",inputprocedure)).toEqual(inputprocedure);
    });

    it('should define the checkIfEmpty function', function() {
        expect(procedureService.checkIfEmpty).toBeDefined();
    });

    it('should return error message No steps available when checkIfEmpty is called', function() {
        expect(procedureService.checkIfEmpty([])).toEqual("No steps available!");
    });

    it('should return true steps when checkIfEmpty is called with steps having no Info', function() {
        expect(procedureService.checkIfEmpty(procSection)).toEqual(true);
    });

    it('should return false when checkIfEmpty is called with steps having atleast one Info', function() {
        var procSectionTmp = [
            {
                "Content": "Pre-Action Safety Information",
                "Type": "Heading",
                "Role": "MD",
                "Step": "1.0",
                "Info": "Taruni Gattu 036.09:23:12 UTC"
            },
            {
                "Reference": "http://somewhere on the net",
                "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder.",
                "Type": "Warning",
                "Role": "MD",
                "Step": "1.1",
                "Info": "Taruni Gattu 036.09:23:15 UTC"
            },
            {
                "Content": "Make required safety announcement on VL-AZERO",
                "Type": "Action",
                "Role": "MD",
                "Step": "1.2"
            },
            {
                "Content": "Establish Com Link",
                "Type": "Heading",
                "Role": "SYS,CC",
                "Step": "2.0"
            }
        ];

        expect(procedureService.checkIfEmpty(procSectionTmp)).toEqual(false);
    });

    it('should define the openNextSteps function', function() {
        expect(procedureService.openNextSteps).toBeDefined();
    });

    it('should return [] when openNextSteps is called with []', function() {
        expect(procedureService.openNextSteps([],"")).toEqual([]);
    });

    it('should return array with next steps opened when openNextSteps is called with array', function() {

        var inputprocedure = [
            { Content: 'Pre-Action Safety Information', Type: 'Heading', Role: 'MD', Step: '1.0', index: 1, class: 'fa fa-caret-right', header: true, headertype: 'mainheader', headervalue: '1', openstatus: true, rowstyle: { rowcolor: { backgroundColor: '#e9f6fb' }}, chkval: false, status: true },
            { Reference: 'http://somewhere on the net', Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder.', Type: 'Warning', Role: 'MD', Step: '1.1', index: 1.1, class: 'fa fa-caret-right', header: false, headertype: 'listitem', headervalue: '1', openstatus: false, rowstyle: { rowcolor: { backgroundColor: '#e9f6fb' }}, chkval: false, typeicon: 'fa fa-exclamation-triangle', status: true }
        ]

        var outputprocedure = [
            { Content: 'Pre-Action Safety Information', Type: 'Heading', Role: 'MD', Step: '1.0', index: 1, class: 'fa fa-caret-down', header: true, headertype: 'mainheader', headervalue: '1', openstatus: true, rowstyle: { rowcolor: { backgroundColor: '#e9f6fb' }}, chkval: false, status: true },
            { Reference: 'http://somewhere on the net', Content: 'Review applicable safety information, from documents located in Mission Specific Release Folder.', Type: 'Warning', Role: 'MD', Step: '1.1', index: 1.1, class: 'fa fa-caret-right', header: false, headertype: 'listitem', headervalue: '1', openstatus: true, rowstyle: { rowcolor: { backgroundColor: '#e9f6fb' }}, chkval: false, typeicon: 'fa fa-exclamation-triangle', status: true }
        ]
        expect(procedureService.openNextSteps(inputprocedure,0)).toEqual(outputprocedure);
    });

    it('should define the getCompletedSteps function', function() {
        expect(procedureService.getCompletedSteps).toBeDefined();
    });

    it('should return completed steps when getCompletedSteps is called', function() {
        var procSectionTmp = [
            {
                "Content": "Pre-Action Safety Information",
                "Type": "Heading",
                "Role": "MD",
                "Step": "1.0",
                "Info": "Taruni Gattu 036.09:23:12 UTC",
                "headertype":"mainheader"
            },
            {
                "Reference": "http://somewhere on the net",
                "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder.",
                "Type": "Warning",
                "Role": "MD",
                "Step": "1.1",
                "Info": "Taruni Gattu 036.09:23:15 UTC",
                "headertype":"listitem"
            },
            {
                "Content": "Make required safety announcement on VL-AZERO",
                "Type": "Action",
                "Role": "MD",
                "Step": "1.2",
                "Info": "Taruni Gattu 036.09:23:15 UTC",
                "headertype":"listitem"
            },
            {
                "Content": "Establish Com Link",
                "Type": "Heading",
                "Role": "SYS,CC",
                "Step": "2.0",
                "Info": "",
                "headertype":"mainheader"
            }
        ];

        var resultSteps = procedureService.getCompletedSteps(procSectionTmp);
        expect(resultSteps).toEqual([
            {
                "Content": "Pre-Action Safety Information",
                "Type": "Heading",
                "Role": "MD",
                "Step": "1.0",
                "Info": "Taruni Gattu 036.09:23:12 UTC",
                "rowstyle":{"rowcolor" : {'backgroundColor':'#9fdf9f'}},
                "headertype":"mainheader",
                "chkval" : true
            },
            {
                "Reference": "http://somewhere on the net",
                "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder.",
                "Type": "Warning",
                "Role": "MD",
                "Step": "1.1",
                "Info": "Taruni Gattu 036.09:23:15 UTC",
                "rowstyle":{"rowcolor" : {'backgroundColor':'#c6ecc6'}},
                "headertype":"listitem",
                "chkval" : true
            },
            {
                "Content": "Make required safety announcement on VL-AZERO",
                "Type": "Action",
                "Role": "MD",
                "Step": "1.2",
                "Info": "Taruni Gattu 036.09:23:15 UTC",
                "rowstyle":{"rowcolor" : {'backgroundColor':'#c6ecc6'}},
                "headertype":"listitem",
                "chkval" : true
            },
            {
                "Content": "Establish Com Link",
                "Type": "Heading",
                "Role": "SYS,CC",
                "Step": "2.0",
                "Info": "",
                "rowstyle":{"rowcolor" : {'backgroundColor':'#bee4f3'}},
                "headertype":"mainheader",
                "chkval" : false
            }

        ]);
    });


    it('should return [] when getCompletedSteps is called with empty array', function() {
        var procSectionTmp = [];
        expect(procedureService.getCompletedSteps(procSectionTmp)).toEqual([]);
    });

    it('should define the getProcedureList function', function() {
        expect(procedureService.getProcedureList).toBeDefined();
    });

    it('should be able to retrieve empty array if no procedures available from database', function () {
        var result = [];
        var procedures;
 
        httpBackend.expectGET('/getProcedureList').respond(200, result);

        procedureService.getProcedureList().then( function(response){
            procedures = response.data;
            expect(response.status).toBe(200);
            expect(procedures).toBeDefined();
            expect(procedures.length).toEqual(0);
        });

        httpBackend.flush();
    });

    it('should define the downloadProcedure function', function() {
        expect(procedureService.downloadProcedure).toBeDefined();
    });

    it('should be able to download a Procedure', function () {
        var result = [];
        var id = '1.1';
 
        httpBackend.expectGET('/getProcedureData?id=1.1').respond(200, result);

        procedureService.downloadProcedure(id).then( function(response){
            expect(response.status).toBe(200);
        });

        httpBackend.flush();
    });

    it('should define the saveProcedureInstance function', function() {
        expect(procedureService.saveProcedureInstance).toBeDefined();
    });

    it('should be able to save an instance of a procedure', function () {
        var id = '1.1';
        var usernamerole = 'Taruni Gattu (VIP)';
        var lastuse = '036.09:09:15 UTC';

        httpBackend.expectPOST("/saveProcedureInstance").respond(200, {});

        procedureService.saveProcedureInstance(id,usernamerole,lastuse).then( function(response){
            expect(response.status).toBe(200);
        });

        httpBackend.flush();
    });

    it('should define the setInfo function', function() {
        expect(procedureService.setInfo).toBeDefined();
    });

    it('should be able to set info', function () {
        var info = 'Taruni Gattu (VIP) 036.09:09:15 UTC';
        var id = '1.1';
        var step = '2.0';
        var usernamerole = 'Taruni Gattu (VIP)';
        var revision = 3;
        var lastuse  = '036.09:09:15 UTC';

        httpBackend.expectPOST("/setInfo").respond(200, {});

        procedureService.setInfo(info,id,step,usernamerole,revision,lastuse).then( function(response){
            expect(response.status).toBe(200);
        });

        httpBackend.flush();
    });

    it('should define the setInstanceCompleted function', function() {
        expect(procedureService.setInstanceCompleted).toBeDefined();
    });

    it('should be able to set an instance as completed', function () {
        var info = 'Taruni Gattu (VIP) 036.09:09:15 UTC';
        var id = '1.1';
        var step = '2.0';
        var usernamerole = 'Taruni Gattu (VIP)';
        var revision = 3;
        var lastuse  = '036.09:09:15 UTC';

        httpBackend.expectPOST("/setInstanceCompleted").respond(200, {});

        procedureService.setInstanceCompleted(info,id,step,usernamerole,revision,lastuse).then( function(response){
            expect(response.status).toBe(200);
        });

        httpBackend.flush();
    });

    it('should define the getLiveInstanceData function', function() {
        expect(procedureService.getLiveInstanceData).toBeDefined();
    });

    it('should be able to get live instance data', function () {
        var result =  {
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
            "revision": 4,
            "running": true
        };

        var procedureID = '1.1';
        var currentRevision = 4;
 
        httpBackend.expectGET('/getLiveInstanceData?procedureID=1.1&currentRevision=4').respond(200, result);

        procedureService.getLiveInstanceData(procedureID,currentRevision).then( function(response){
            expect(response.status).toBe(200);
        });

        httpBackend.flush();
    });

    it('should define the getAllInstances function', function() {
        expect(procedureService.getAllInstances).toBeDefined();
    });

    it('should be able to get all instances of a procedure', function () {
         var result  = { "instances" :[
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
                        },
                        {
                            "step": "2.1.2",
                            "info": ""
                        },
                        {
                            "step": "2.1.3",
                            "info": ""
                        },
                        {
                            "step": "2.2.0",
                            "info": ""
                        }
                    ],
                    "closedBy": "",
                    "startedAt": "2018 - 034.11:26:34 UTC",
                    "completedAt": "",
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
                        },
                        {
                            "step": "2.1.2",
                            "info": ""
                        },
                        {
                            "step": "2.1.3",
                            "info": ""
                        },
                        {
                            "step": "2.2.0",
                            "info": ""
                        }
                    ],
                    "closedBy": "",
                    "startedAt": "2018 - 034.11:26:49 UTC",
                    "completedAt": "",
                    "revision": 2,
                    "running": false
                }
            ],
            "title":"Audacy Zero - Procedure Example"
        }
        var proceduresinstances;
        var procedureID = '1.1';
 
        httpBackend.expectGET('/getAllInstances?procedureID=1.1').respond(200, result);

        procedureService.getAllInstances(procedureID).then( function(response){
            proceduresinstances = response.data.instances;
            expect(response.status).toBe(200);
            expect(proceduresinstances).toBeDefined();
            expect(proceduresinstances.length).toEqual(2);
            expect(proceduresinstances).toEqual(result.instances);
        });

        httpBackend.flush();
    });

    it('should define the setComments function', function() {
        expect(procedureService.setComments).toBeDefined();
    });

    it('should be able to set comments', function () {
        var comments = 'comment test 1';
        var id = '1.1';
        var step = '2.0';
        var revision = 3;
        var lastuse  = '036.09:09:15 UTC';

        httpBackend.expectPOST("/setComments").respond(200, {});

        procedureService.setComments(id,revision,step,comments,lastuse).then( function(response){
            expect(response.status).toBe(200);
        });

        httpBackend.flush();
    });

    it('should be able to open first section', function () {
        var steps = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'checkbox':false},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
        ];

        var stepresult = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': false,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'checkbox':false},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
        ];

        expect(procedureService.openFirstStep(steps,'CC')).toEqual(stepresult);
    });



    it('should return section header index', function () {
        var steps = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'checkbox':false},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
        ];
        expect(procedureService.getSectionHeaderIndex(steps,2)).toEqual(0);

    });

    it('should return -1 when section header index not found', function () {
        var steps = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'checkbox':false},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
        ];
        expect(procedureService.getSectionHeaderIndex(steps,3)).toEqual(-1);

    });

    it('should return next section header index', function () {
        var steps = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'checkbox':false},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
        ];
        expect(procedureService.getNextSectionHeaderIndex(steps,0,2)).toEqual(3);

    });

    it('should return -1 if next section header index not found', function () {
        var steps = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'checkbox':false},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
        ];
        expect(procedureService.getNextSectionHeaderIndex(steps,8,9)).toEqual(-1);

    });

    it('should return sub section header index', function () {
        var steps = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'checkbox':false},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
        ];
        expect(procedureService.getSubSectionHeaderIndex(steps,5)).toEqual(4);

    });

    it('should return next sub section header index', function () {
        var steps = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'checkbox':false},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
        ];
        expect(procedureService.getNextSubSectionHeaderIndex(steps,4,5)).toEqual(7);

    });

    it('should return -1 when next sub section header index is not found', function () {
        var steps = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.3', 'index': 2.3, 'class': 'fa fa-caret-down', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'checkbox':false},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
        ];
        expect(procedureService.getNextSubSectionHeaderIndex(steps,4,5)).toEqual(-1);

    });

    it('should return -1 when sub section header index not found', function () {
        var steps = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.3', 'index': 2.3, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'status': true,'checkbox':false},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true },
        ];
        expect(procedureService.getSubSectionHeaderIndex(steps,7)).toEqual(-1);

    });

    it('should return the procedure sections array with defined permissions when getStepPermissions is called', function() {
        var procedure = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue':'1','sectionbtn': { 'styles':{ 'color': '' } }},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true,'subheadervalue':'1','sectionbtn':{ 'styles': { 'color': '' } }},
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1','sectionbtn':{ 'styles':{ 'color': '' } }},
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue':'2','sectionbtn':{ 'styles':{ 'color': '' }}},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '21','sectionbtn':{ 'styles':{ 'color': '' }}},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '21','sectionbtn': { 'styles': { 'color': '' } }},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '21','sectionbtn': { 'styles': { color: '' } }},
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '22','sectionbtn':{ 'styles':{ 'color': '' }}},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'checkbox':false,'subheadervalue': '3','sectionbtn':{ 'styles':{ 'color': '' }},'Type':'Heading','typeicon': '','typecolor': { color: '' },'contenttype': 'String','buttonStatus': '','comments': ''},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true, 'typecolor':{color:''}, 'contenttype':'String', 'buttonStatus': '', 'comments':'', 'checkbox':true,'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' } }},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '3','sectionbtn': { 'styles':{ 'color': '' }}},
        ]
        expect(procedureService.getStepPermissions(procSection,"SYS")).toEqual(procedure);
    });

    it('should display dependent procedure links of a procedure step if links exists in Procedures column', function(){
        var procList = [
        {
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
            "versions":[[
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
                ]],
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
            "versions":[[
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
                ]],
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
        }]
        var procSteps = [
                        {
                            "step": "1.0",
                            "info": "034.11:26:58 UTC Taruni Gattu(VIP)",
                            "Procedures":"1.2,1.4,1.7"
                        },
                        {
                            "step": "1.1",
                            "info": "034.11:26:59 UTC Taruni Gattu(VIP)",
                            "Procedures":"1.6 , 1.2"
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
                    ];
        var output = [
                        {
                            "step": "1.0",
                            "info": "034.11:26:58 UTC Taruni Gattu(VIP)",
                            "Procedures":"1.2,1.4,1.7",
                            "dependentProcedures":[
                                {
                                    "id":"1.2",
                                    "version":1,
                                    "revision":1,
                                    "running":1,
                                    "exists":true
                                },
                                {
                                    "id":"1.4",
                                    "version":"",
                                    "revision":"",
                                    "running":0,
                                    "exists":false
                                },
                                {
                                    "id":"1.7",
                                    "version":"",
                                    "revision":"",
                                    "running":0,
                                    "exists":false
                                }
                            ]
                        },
                        {
                            "step": "1.1",
                            "info": "034.11:26:59 UTC Taruni Gattu(VIP)",
                            "Procedures":"1.6 , 1.2",
                            "dependentProcedures":[
                                {
                                    "id":"1.6",
                                    "version":"",
                                    "revision":"",
                                    "running":0,
                                    "exists":false
                                },
                                {
                                    "id":"1.2",
                                    "version":1,
                                    "revision":1,
                                    "running":1,
                                    "exists":true
                                }
                            ]
                        },
                        {
                            "step": "1.2",
                            "info": "",
                            "dependentProcedures":[]
                        },
                        {
                            "step": "2.0",
                            "info": "",
                            "dependentProcedures":[]
                        },
                        {
                            "step": "2.1.0",
                            "info": "",
                            "dependentProcedures":[]
                        },
                        {
                            "step": "2.1.1",
                            "info": "",
                            "dependentProcedures":[]
                        }
                    ];
        expect(procedureService.getValidLinks(procList,procSteps)).toEqual(output);
    });

    it('should not display option to open latest instance for dependent procedure links of a procedure step if no latest instance exists', function(){
        var procList = [
        {
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
            "versions":[[
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
                ]],
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
                    "running": false
                }
            ],
            "versions":[[
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
                ]],
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
        }]
        var procSteps = [
                        {
                            "step": "1.0",
                            "info": "034.11:26:58 UTC Taruni Gattu(VIP)",
                            "Procedures":"1.2,1.4,1.7"
                        },
                        {
                            "step": "1.1",
                            "info": "034.11:26:59 UTC Taruni Gattu(VIP)",
                            "Procedures":"1.6 , 1.2"
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
                    ];
        var output = [
                        {
                            "step": "1.0",
                            "info": "034.11:26:58 UTC Taruni Gattu(VIP)",
                            "Procedures":"1.2,1.4,1.7",
                            "dependentProcedures":[
                                {
                                    "id":"1.2",
                                    "version":1,
                                    "revision":"",
                                    "running":0,
                                    "exists":true
                                },
                                {
                                    "id":"1.4",
                                    "version":"",
                                    "revision":"",
                                    "running":0,
                                    "exists":false
                                },
                                {
                                    "id":"1.7",
                                    "version":"",
                                    "revision":"",
                                    "running":0,
                                    "exists":false
                                }
                            ]
                        },
                        {
                            "step": "1.1",
                            "info": "034.11:26:59 UTC Taruni Gattu(VIP)",
                            "Procedures":"1.6 , 1.2",
                            "dependentProcedures":[
                                {
                                    "id":"1.6",
                                    "version":"",
                                    "revision":"",
                                    "running":0,
                                    "exists":false
                                },
                                {
                                    "id":"1.2",
                                    "version":1,
                                    "revision":"",
                                    "running":0,
                                    "exists":true
                                }
                            ]
                        },
                        {
                            "step": "1.2",
                            "info": "",
                            "dependentProcedures":[]
                        },
                        {
                            "step": "2.0",
                            "info": "",
                            "dependentProcedures":[]
                        },
                        {
                            "step": "2.1.0",
                            "info": "",
                            "dependentProcedures":[]
                        },
                        {
                            "step": "2.1.1",
                            "info": "",
                            "dependentProcedures":[]
                        }
                    ];
        expect(procedureService.getValidLinks(procList,procSteps)).toEqual(output);
    });

    it('should return all parents for the steps',function(){
        var procedureInput = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '1','sectionbtn':{ 'styles': { 'color': '' } }},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } }},
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } }},
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '2','sectionbtn':{ 'styles':{ 'color': '' }}},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } }},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '21','sectionbtn':{ 'styles': { 'color': '' }}},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } } },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '22','sectionbtn': { 'styles': { 'color': '' }}},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'checkbox':false,'Type': 'Heading','typeicon': '','typecolor': { 'color': '' },'contenttype': 'String','buttonStatus': '','comments': '','subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }}},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }}},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true , 'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }}},
        ];

        var procedureOutput = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '1','sectionbtn':{ 'styles': { 'color': '' } },'parent':'','parentIndex':''},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } },'parent':'1.0','parentIndex':0},
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } },'parent':'1.0','parentIndex':0},
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '2','sectionbtn':{ 'styles':{ 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.0','parentIndex':3},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '21','sectionbtn':{ 'styles': { 'color': '' }},'parent':'2.1.0','parentIndex':4},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.1.0','parentIndex':4 },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '22','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'checkbox':false,'Type': 'Heading','typeicon': '','typecolor': { 'color': '' },'contenttype': 'String','buttonStatus': '','comments': '','subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true , 'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
        ];

        expect(procedureService.getAllParents(procedureInput)).toEqual(procedureOutput);

    });

    it('should return no parents for the steps when no heading steps exist',function(){
        var procedureInput = [
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } }},
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } }},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }}},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true , 'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }}},
        ];

        var procedureOutput = [
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } },'parent':'','parentIndex':''},
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } },'parent':'','parentIndex':''},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true , 'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
        ];

        expect(procedureService.getAllParents(procedureInput)).toEqual(procedureOutput);

    });

    
    it('should expand steps and collapse subsections on open of a section',function(){
        var procedureInput = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '1','sectionbtn':{ 'styles': { 'color': '' } },'parent':'','parentIndex':''},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } },'parent':'1.0','parentIndex':0},
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } },'parent':'1.0','parentIndex':0},
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '2','sectionbtn':{ 'styles':{ 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.0','parentIndex':3},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '21','sectionbtn':{ 'styles': { 'color': '' }},'parent':'2.1.0','parentIndex':4},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.1.0','parentIndex':4 },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '22','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'checkbox':false,'Type': 'Heading','typeicon': '','typecolor': { 'color': '' },'contenttype': 'String','buttonStatus': '','comments': '','subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true , 'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
        ];

        var procedureOutput = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '1','sectionbtn':{ 'styles': { 'color': '' } },'parent':'','parentIndex':''},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } },'parent':'1.0','parentIndex':0},
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } },'parent':'1.0','parentIndex':0},
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-down', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '2','sectionbtn':{ 'styles':{ 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.0','parentIndex':3},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '21','sectionbtn':{ 'styles': { 'color': '' }},'parent':'2.1.0','parentIndex':4},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.1.0','parentIndex':4 },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '22','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'checkbox':false,'Type': 'Heading','typeicon': '','typecolor': { 'color': '' },'contenttype': 'String','buttonStatus': '','comments': '','subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true , 'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
        ];

        expect(procedureService.showstepList(3,procedureInput)).toEqual(procedureOutput);

    });

    it('should get all siblings of a step',function(){
        var procedureInput = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '1','sectionbtn':{ 'styles': { 'color': '' } },'parent':'','parentIndex':''},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } },'parent':'1.0','parentIndex':0},
            { 'Content': 'Make required safety announcement on VL-AZERO', 'Type': 'Action', 'Role': 'MD', 'Step': '1.2', 'index': 1.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } },'parent':'1.0','parentIndex':0},
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '2','sectionbtn':{ 'styles':{ 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.0','parentIndex':3},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '21','sectionbtn':{ 'styles': { 'color': '' }},'parent':'2.1.0','parentIndex':4},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.1.0','parentIndex':4 },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '22','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'checkbox':false,'Type': 'Heading','typeicon': '','typecolor': { 'color': '' },'contenttype': 'String','buttonStatus': '','comments': '','subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true , 'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
        ];

        var procedureOutput = [{"index":6,"step":{ 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.1.0','parentIndex':4 }}]

        expect(procedureService.getSiblings(5,procedureInput,'2.1.0')).toEqual(procedureOutput);

    });

    it('should not get siblings if step does not have any',function(){
        var procedureInput = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '1','sectionbtn':{ 'styles': { 'color': '' } },'parent':'','parentIndex':''},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } },'parent':'1.0','parentIndex':0},
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '2','sectionbtn':{ 'styles':{ 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.0','parentIndex':3},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '21','sectionbtn':{ 'styles': { 'color': '' }},'parent':'2.1.0','parentIndex':4},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.1.0','parentIndex':4 },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '22','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'checkbox':false,'Type': 'Heading','typeicon': '','typecolor': { 'color': '' },'contenttype': 'String','buttonStatus': '','comments': '','subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true , 'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
        ];

        var procedureOutput = [];

        expect(procedureService.getSiblings(1,procedureInput,'')).toEqual(procedureOutput);

    });

    it('should not get siblings if step does not have any',function(){
        var procedureInput = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '1','sectionbtn':{ 'styles': { 'color': '' } },'parent':'','parentIndex':''},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } },'parent':'1.0','parentIndex':0},
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '2','sectionbtn':{ 'styles':{ 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.0','parentIndex':3},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '21','sectionbtn':{ 'styles': { 'color': '' }},'parent':'2.1.0','parentIndex':4},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.1.0','parentIndex':4 },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '22','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'checkbox':false,'Type': 'Heading','typeicon': '','typecolor': { 'color': '' },'contenttype': 'String','buttonStatus': '','comments': '','subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true , 'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
        ];

        var procedureOutput = [];

        expect(procedureService.getSiblings(1,procedureInput,'')).toEqual(procedureOutput);

    });

    it('should get all parents list',function(){
        var procedureInput = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '1','sectionbtn':{ 'styles': { 'color': '' } },'parent':'','parentIndex':''},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } },'parent':'1.0','parentIndex':0},
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '2','sectionbtn':{ 'styles':{ 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.0','parentIndex':3},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '21','sectionbtn':{ 'styles': { 'color': '' }},'parent':'2.1.0','parentIndex':4},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.1.0','parentIndex':4 },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '22','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'checkbox':false,'Type': 'Heading','typeicon': '','typecolor': { 'color': '' },'contenttype': 'String','buttonStatus': '','comments': '','subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true , 'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
        ];

        var procedureOutput = [];

        expect(procedureService.getAllParentList(1,procedureInput)).toEqual(procedureOutput);

    });

    it('should get all parents list',function(){
        var procedureInput = [
            { 'Content': 'Pre-Action Safety Information', 'Type': 'Heading', 'Role': 'MD', 'Step': '1.0', 'index': 1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '1', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '1','sectionbtn':{ 'styles': { 'color': '' } },'parent':'','parentIndex':''},
            { 'Reference': 'http://somewhere on the net', 'Content': 'Review applicable safety information, from documents located in Mission Specific Release Folder.', 'Type': 'Warning', 'Role': 'MD', 'Step': '1.1', 'index': 1.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '1', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-exclamation-triangle', 'status': true,'typecolor':{color:'#ff0000'},'contenttype':'AlertInfo','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '1' ,'sectionbtn': { 'styles': { 'color': '' } },'parent':'1.0','parentIndex':0},
            { 'Content': 'Establish Com Link', 'Type': 'Heading', 'Role': 'SYS,CC', 'Step': '2.0', 'index': 2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '2', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': false ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '2','sectionbtn':{ 'styles':{ 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Prepare Ground Support Equipment', 'Type': 'Heading', 'Role': 'CC', 'Step': '2.1.0', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'status': true ,'typeicon':'','typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.0','parentIndex':3},
            { 'Content': 'Powerup GSE Rack if necessary', 'Type': 'Action', 'Role': 'CC', 'Step': '2.1.1', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '21','sectionbtn':{ 'styles': { 'color': '' }},'parent':'2.1.0','parentIndex':4},
            { 'Content': 'Verify UPS battery is fully charged, record charge state', 'Type': 'Record', 'Role': 'CC', 'Step': '2.1.2', 'index': 2.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-pencil-square-o', 'status': true,'typecolor':{color:''},'contenttype':'Input','recordedValue':'','buttonStatus': '','comments':'','checkbox':true, 'subheadervalue': '21','sectionbtn': { 'styles':{ 'color': '' } },'parent':'2.1.0','parentIndex':4 },
            { 'Content': 'Verify that OBC is fully booted and in state "idle"', 'Type': 'Verify', 'Role': 'SYS ', 'Step': '2.2.0', 'index': 2.2, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'subheader', 'headervalue': '2', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#d4edf7' }}, 'chkval': false, 'typeicon': 'fa fa-check-circle-o', 'status': false ,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':false,'subheadervalue': '22','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Close Procedure', 'Role': 'MD', 'Step': '3.0', 'index': 3, 'class': 'fa fa-caret-right', 'header': true, 'headertype': 'mainheader', 'headervalue': '3', 'openstatus': true, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#bee4f3' }}, 'chkval': false, 'status': true,'checkbox':false,'Type': 'Heading','typeicon': '','typecolor': { 'color': '' },'contenttype': 'String','buttonStatus': '','comments': '','subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'','parentIndex':''},
            { 'Content': 'Update the shift log with procedure close status / notes', 'Type': 'Action', 'Role': 'MD', 'Step': '3.1', 'index': 3.1, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''} ,'contenttype':'String','buttonStatus': '','comments':'','checkbox':true,'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
            { 'Content': 'Close the procedure in Quantum (complete this step)', 'Type': 'Action', 'Role': 'MD', 'Step': '3.2', 'index': 3.2, 'class': 'fa fa-caret-right', 'header': false, 'headertype': 'listitem', 'headervalue': '3', 'openstatus': false, 'rowstyle': { 'rowcolor': { 'backgroundColor': '#e9f6fb' }}, 'chkval': false, 'typeicon': 'fa fa-cog', 'status': true,'typecolor':{color:''},'contenttype':'String','buttonStatus': '','comments':'','checkbox':true , 'subheadervalue': '3','sectionbtn': { 'styles': { 'color': '' }},'parent':'3.0','parentIndex':8},
        ];

        var procedureOutput = [];

        expect(procedureService.getAllParentTree(1,procedureInput)).toEqual(procedureOutput);

    });

});
