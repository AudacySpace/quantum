describe('Test Suite for Right Sidebar Component', function () {
    var $controller, userService;
    var windowMock = {
        location: {href : ''}
    };


    beforeEach(function () {
        // load the module
        module('quantum', function ($provide) {
            $provide.value('$window', windowMock);
        });

        inject(function($componentController){

            userService = jasmine.createSpyObj('userService', ['userRole', 'getUserName']);
            
            userService.getUserName.and.callFake(function() {
                return 'John Smith';
            });
            userService.userRole.and.callFake(function() {
                return { cRole : { 'callsign' : 'MD'}};
            });            

            $controller = $componentController('rightSidebar', {
                userService : userService
            });

        });

    });

    it('should define the right sidebar component', function() {
        expect($controller).toBeDefined();
    });

    it('should define user name', function() {
        expect(userService.getUserName).toHaveBeenCalled();
        expect($controller.name).toEqual('John Smith');
    });

    it('should define user role', function() {
        expect($controller.role).toBeDefined();
        expect($controller.role).toEqual(userService.userRole);
    });

    it('should define logout function', function() {
        expect($controller.logout).toBeDefined();
        $controller.logout();
        expect(windowMock.location.href).toEqual('/logout');
    });

});
