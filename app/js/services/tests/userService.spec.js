// Be descriptive with titles here. The describe and it titles combined read like a sentence.
describe('Test Suite for User Service', function() {

	var userService, httpBackend;

    var windowMock = { user : 
    	{_id: "5a5d11f9e1b4fc0036336f5e", 
    		google: {
    			email: "taruni92@gmail.com", 
    			name: "Taruni Gattu", 
    			id: "108429282787435449886"
    		},
    		currentRole : {
    			name: "Mission Director", 
    			callsign: "MD"
    		},
    		allowedRoles : [
    		{
    			name: "Mission Director", 
    			callsign: "MD"
    		},
    		{
    			name: "Observer", 
    			callsign: "VIP"
    		}
    		]
    	} 
    };

    beforeEach(function () {
        // load the module with a mock window object
        module('quantum', function ($provide) {
        	$provide.value('$window', windowMock);
        });
 
        // get your service, also get $httpBackend
        // $httpBackend will be a mock.
        inject(function (_$httpBackend_, _userService_) {
            userService = _userService_;
            httpBackend = _$httpBackend_;
        });
    });
 
    // make sure no expectations were missed in your tests.
    afterEach(function () {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    //userService should exist in the application
    it('userService should exist', function() {
    	expect(userService).toBeDefined();
    });

 	it('userService should get the user name', function () {
    	var userName = "Taruni Gattu";
    	expect(userService.getUserName()).toEqual(userName);
    });

    it('userService should get the user callsign', function () {
    	var callsign = 'MD'
    	expect(userService.getCurrentCallSign()).toEqual(callsign);
    });

});