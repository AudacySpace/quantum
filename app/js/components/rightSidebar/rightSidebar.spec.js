describe('Test Suite for Right Sidebar Controller', function () {
    var $controller, userService;
    var windowMock = {
        location: {href : ''},
        innerWidth: 1000,
        user : {
            currentRole : {}
        }
    };


    beforeEach(function () {
        // load the module
        module('quantum', function ($provide) {
            $provide.value('$window', windowMock);
        });

        inject(function($componentController){

            userService = jasmine.createSpyObj('userService', ['userRole', 'getUserName','getUserEmail','getOnlineUsers']);
            
            userService.getUserName.and.callFake(function() {
                return 'John Smith';
            });
            userService.userRole.and.callFake(function() {
                return { cRole : { 'callsign' : 'MD'}};
            }); 

            userService.getUserEmail.and.callFake(function() {
                return 'jsmith@gmail.com';
            });

            userService.getOnlineUsers.and.callFake(function() {
                return [{
                    "name":"John Smith",
                    "status":"true",
                    "email":"johnsmith@gmail.com",
                    "role":"SYS"
                }];
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

        //update innerWidth for the next test
        windowMock.innerWidth = 768;
    });

    it('should define user role as observer on smaller screens', function() {
        var role = {
                    cRole : {
                        "name": "Observer",
                        "callsign": "VIP"
                    }
                };

        expect($controller.role).toBeDefined();
        expect($controller.role).toEqual(role);
    });

    it('should define logout function', function() {
        expect($controller.logout).toBeDefined();
        $controller.logout();
        expect(windowMock.location.href).toEqual('/logout');
    });

});
