describe('Test Suite for Homepage Controller', function () {
    var $controller, dashboardService, procedureService, userService, deferredMission;
    var windowMock = {
        innerWidth: ''
    };
    var modalInstance = { open: function() {} };

    beforeEach(function () {
        // load the module
        module('quantum', function ($provide) {
            $provide.value('$window', windowMock);
            // sideNavOpenMock = jasmine.createSpy();
            // $provide.factory('$mdSidenav', function() {
            //     return function(sideNavId){
            //         return { open: sideNavOpenMock };
            //     };
            // });
        });

        inject(function($componentController, _$q_){
            dashboardService = jasmine.createSpyObj('dashboardService', ['getLock','setRightLock','setHeaderLocation','getSidePanelButton']);
            procedureService = jasmine.createSpyObj('procedureService', ['setHeaderStyles', 'setProcedureName','getProcedureName','getHeaderStyles','getIconStyles']);
            userService = jasmine.createSpyObj('userService', ['userRole', 'getUserName', 'getUserEmail', 'setMissionForUser']);
            
            userService.getUserName.and.callFake(function() {
                return 'John Smith';
            });
            userService.getUserEmail.and.callFake(function() {
                return 'john.smith@gmail.com';
            });
            userService.userRole.and.callFake(function() {
                return { cRole : { 'callsign' : 'MD'}};
            });

            deferredMission = _$q_.defer();

            userService.setMissionForUser.and.callFake(function() {
                return deferredMission.promise;
            });
            dashboardService.getLock.and.callFake(function() {
                return { lockLeft : false, lockRight : false };
            });

            procedureService.getProcedureName.and.callFake(function(){
                return { id:"1.1", name:"Procedure Example",status:"Open Procedure",fullname : "Open Procedure: 1.1 - Procedure Example"}
            });

            procedureService.getHeaderStyles.and.callFake(function(){
                return { styles:{}, namestyles:{}}
            });

            procedureService.getIconStyles.and.callFake(function(){
                return { icon1style:"", icon2style:"",icon3style:"",icon4style : ""}
            });

            $controller = $componentController('homepage', {
                dashboardService: dashboardService,
                procedureService : procedureService,
                userService : userService,
                $uibModal : modalInstance
            });
        });

    });

    it('should define the dashboard component', function() {
        expect($controller).toBeDefined();
    });

    it('should define the role of the user', function() {
        expect(userService.setMissionForUser).toHaveBeenCalled();
    });

    it('should define user name and role', function() {
        expect(userService.getUserName).toHaveBeenCalled();
        expect($controller.name).toEqual('John Smith');
        expect($controller.role).toBeDefined();
        expect($controller.role).toEqual(userService.userRole);
    });

    it('should define locks', function() {
        expect(dashboardService.getLock).toHaveBeenCalled();
        expect($controller.locks).toEqual({ lockLeft : false, lockRight : false });
    });

    it('should define procedure,header styles and icon styles', function() {
        expect(procedureService.getProcedureName).toHaveBeenCalled();
        expect($controller.procedure).toEqual({id:"1.1", name:"Procedure Example",status:"Open Procedure",fullname : "Open Procedure: 1.1 - Procedure Example"});
        expect(procedureService.getHeaderStyles).toHaveBeenCalled();
        expect($controller.header).toEqual({  styles:{}, namestyles:{}});
        expect(procedureService.getIconStyles).toHaveBeenCalled();
        expect($controller.icons).toEqual({ icon1style:"", icon2style:"",icon3style:"",icon4style : ""});
    });

    // it('should define the function openRightNav', function(){
    //     expect($controller.openRightNav).toBeDefined();
    // });

    // it('should open the right navigation menu, window width less than 800', function(){
    //     windowMock.innerWidth = 768;
    //     $controller.openRightNav();

    //     //expect the mocked mdSidenav open function to be called
    //     expect(sideNavOpenMock).toHaveBeenCalled();
    // });

    // it('should not open the right navigation menu, window width 800 or more', function(){
    //     windowMock.innerWidth = 1000;
    //     $controller.openRightNav();

    //     //expect the right lock to be false
    //     expect($controller.locks.lockRight).toEqual(false);
    //     expect(dashboardService.setRightLock).toHaveBeenCalledWith(false);
    // });

    it('should define the function setColor', function(){
        expect($controller.setColor).toBeDefined();
    });

    it('should set Color of the header and update the procedure name', function(){
        windowMock.innerWidth = 1000;
        $controller.setColor();

        //expect the setHeaderStyles and setProcedureName to be called
        expect(procedureService.setHeaderStyles).toHaveBeenCalledWith('block','none','#ffffff','#000000','inline-block','none',windowMock.innerWidth);
        expect(procedureService.setProcedureName).toHaveBeenCalledWith('','',"Home");
    });

    it('should define the function showSettings', function(){
        expect($controller.showSettings).toBeDefined();
    });

    it('should open the modal settings menu', function(){
        var fakeModal = {
            result: {
                then: function(confirmCallback, cancelCallback) {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }
            }
        };
        spyOn(modalInstance, 'open').and.returnValue(fakeModal);
        $controller.showSettings();

        //expect the mocked modal open function to be called
        expect(modalInstance.open).toHaveBeenCalled();
    });

    it('should define the function showAdminMenu', function(){
        expect($controller.showAdminMenu).toBeDefined();
    })

    it('should open the modal for the administrator', function(){
        var fakeModal = {
            result: {
                then: function(confirmCallback, cancelCallback) {
                    //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
                    this.confirmCallBack = confirmCallback;
                    this.cancelCallback = cancelCallback;
                }
            }
        };
        spyOn(modalInstance, 'open').and.returnValue(fakeModal);
        $controller.showAdminMenu();

        //expect the mocked modal open function to be called
        expect(modalInstance.open).toHaveBeenCalled();
    });

});
