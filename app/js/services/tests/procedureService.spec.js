describe('Test Suite for Procedure Service', function () {
  

    var procSection = [
        {
            "Content": "Pre-Action Safety Information",
            "Type": "Heading",
            "Role": "MD",
            "Step": "1.0"
        },
        {
            "Reference": "http://somewhere on the net",
            "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder.",
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
            "Content": "Establish Com Link",
            "Type": "Heading",
            "Role": "SYS,CC",
            "Step": "2.0"
        },
        {
            "Content": "Prepare Ground Support Equipment",
            "Type": "Heading",
            "Role": "CC",
            "Step": "2.1.0"
        },
        {
            "Content": "Powerup GSE Rack if necessary",
            "Type": "Action",
            "Role": "CC",
            "Step": "2.1.1"
        },
        {
            "Content": "Verify UPS battery is fully charged, record charge state",
            "Type": "Record",
            "Role": "CC",
            "Step": "2.1.2"
        },
        {
            "Content": "Verify that OBC is fully booted and in state \"idle\"",
            "Type": "Verify",
            "Role": "SYS ",
            "Step": "2.2.0"
        },
        {
            "Content": "Close Procedure",
            "Role": "MD",
            "Step": "3.0"
        },
        {
            "Content": "Update the shift log with procedure close status / notes",
            "Type": "Action",
            "Role": "MD",
            "Step": "3.1"
        },
        {
            "Content": "Close the procedure in Quantum (complete this step)",
            "Type": "Action",
            "Role": "MD",
            "Step": "3.2"
        }
    ];

    beforeEach(function () {
        // load the module
        module('quantum');

        // get your service, also get $httpBackend
        // $httpBackend will be a mock.
        inject(function (_$httpBackend_, _procedureService_,_$window_) {
            procedureService = _procedureService_;
            httpBackend = _$httpBackend_;
            $window = _$window_;
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

    it('should define the archiveThisProcedure function', function() {
        expect(procedureService.archiveThisProcedure).toBeDefined();
    });

    it('should return error message No steps available when archiveThisProcedure is called', function() {
        expect(procedureService.archiveThisProcedure([])).toEqual("No steps available!");
    });


    it('should return false when archiveThisProcedure is called with steps having more than one step without Info', function() {
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

        expect(procedureService.archiveThisProcedure(procSectionTmp)).toEqual(false);
    });

    it('should return true when archiveThisProcedure is called with steps with close step clicked and it is the only one left', function() {
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
                "Step": "1.2",
                "Info": "Taruni Gattu 036.09:23:15 UTC"
            },
            {
                "Content": "Establish Com Link",
                "Type": "Heading",
                "Role": "SYS,CC",
                "Step": "2.0"
            }
        ];

        expect(procedureService.archiveThisProcedure(procSectionTmp)).toEqual(true);
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
                "Step": "1.2",
                "Info": "Taruni Gattu 036.09:23:15 UTC"
            },
            {
                "Content": "Establish Com Link",
                "Type": "Heading",
                "Role": "SYS,CC",
                "Step": "2.0"
            }
        ];


        expect(procedureService.getCompletedSteps(procSectionTmp)).toEqual([
            {
                "Content": "Pre-Action Safety Information",
                "Type": "Heading",
                "Role": "MD",
                "Step": "1.0",
                "Info": "Taruni Gattu 036.09:23:12 UTC",
                "rowstyle":{"rowcolor" : {'backgroundColor':'#c6ecc6'}},
                "chkval" : true,
                "status": true
            },
            {
                "Reference": "http://somewhere on the net",
                "Content": "Review applicable safety information, from documents located in Mission Specific Release Folder.",
                "Type": "Warning",
                "Role": "MD",
                "Step": "1.1",
                "Info": "Taruni Gattu 036.09:23:15 UTC",
                "rowstyle":{"rowcolor" : {'backgroundColor':'#c6ecc6'}},
                "chkval" : true,
                "status" : true

            },
            {
                "Content": "Make required safety announcement on VL-AZERO",
                "Type": "Action",
                "Role": "MD",
                "Step": "1.2",
                "Info": "Taruni Gattu 036.09:23:15 UTC",
                "rowstyle":{"rowcolor" : {'backgroundColor':'#c6ecc6'}},
                "chkval" : true,
                "status" : true
            },
            {
                "Content": "Establish Com Link",
                "Type": "Heading",
                "Role": "SYS,CC",
                "Step": "2.0",
                "rowstyle":{"rowcolor" : {'backgroundColor':'#c6ecc6'}},
                "chkval" : true,
                "status" : true
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

    it('should be able to retrieve all the procedures from database', function () {
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
        var procedures;
 
        httpBackend.expectGET('/getProcedureData?id=1.1').respond(200, result);

        procedureService.downloadProcedure(id).then( function(response){
            procedures = response.data;
            expect(response.status).toBe(200);
            expect(procedures).toBeDefined();
            expect(procedures.length).toEqual(0);
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
        var result = [];
        var procedures;
        var procedureID = '1.1';
        var currentRevision = 4;
 
        httpBackend.expectGET('/getLiveInstanceData?procedureID=1.1&currentRevision=4').respond(200, result);

        procedureService.getLiveInstanceData(procedureID,currentRevision).then( function(response){
            procedures = response.data;
            expect(response.status).toBe(200);
            expect(procedures).toBeDefined();
            expect(procedures.length).toEqual(0);
        });

        httpBackend.flush();
    });

        it('should define the getAllInstances function', function() {
        expect(procedureService.getAllInstances).toBeDefined();
    });

    it('should be able to get all instances of a procedure', function () {
        var result = [];
        var procedures;
        var procedureID = '1.1';
 
        httpBackend.expectGET('/getAllInstances?procedureID=1.1').respond(200, result);

        procedureService.getAllInstances(procedureID).then( function(response){
            procedures = response.data;
            expect(response.status).toBe(200);
            expect(procedures).toBeDefined();
            expect(procedures.length).toEqual(0);
        });

        httpBackend.flush();
    });

});
