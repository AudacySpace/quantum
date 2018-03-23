var chai = require("chai");
var spies = require('chai-spies');
chai.use(spies);
var sinon = require('sinon');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var expect = chai.expect;
var assert = chai.assert;
var Usr = require('../server/models/user');
var configRole = require('../config/role');

describe('Test Suite for User Model ', function() {
    it('should be invalid if the model is empty', function() {
        var m = new Usr();
        m.validate(function(err) {
            expect(err.errors['google.id']).to.exist;
            expect(err.errors['google.token']).to.exist;
            expect(err.errors['google.email']).to.exist;
            expect(err.errors['google.name']).to.exist;
        });
    });

    it('should validate if all of the properties are defined with valid data types', function() {
        var m = new Usr({
            google : {
                id : '102010',
                token: 'fhdhgretvsg',
                email:'tgattu@gmail.com' ,
                name:'Taruni Gattu'

            },
            grid : [{},{}],
            missions: [{},{}]
        });
        m.validate(function(err){
            assert.isNull(err);
        });  
    });

    it('should invalidate if google id is not a string type', function() {
        var m = new Usr({
            google : {
                id : {},
                token: 'fhdhgretvsg',
                email:'tgattu@gmail.com' ,
                name:'Taruni Gattu'

            },
            grid : [{},{}],
            missions: [{},{}]
        });
        m.validate(function(err){
            expect(err.errors['google.id'].name).to.exist;
            expect(err.errors['google.id'].name).to.equal('CastError');
        });  
    });


    it('should invalidate if google token is not a string type', function() {
        var m = new Usr({
            google : {
                id : '102010',
                token: {},
                email:'tgattu@gmail.com' ,
                name:'Taruni Gattu'

            },
            grid : [{},{}],
            missions: [{},{}]
        });
        m.validate(function(err){
            expect(err.errors['google.token'].name).to.exist;
            expect(err.errors['google.token'].name).to.equal('CastError');
        });  
    });

    it('should invalidate if google email is not a string type', function() {
        var m = new Usr({
            google : {
                id : '102010',
                token: 'fhdhgretvsg',
                email:{} ,
                name:'Taruni Gattu'

            },
            grid : [{},{}],
            missions: [{},{}]
        });
        m.validate(function(err){
            expect(err.errors['google.email'].name).to.exist;
            expect(err.errors['google.email'].name).to.equal('CastError');
        });  
    });

    it('should invalidate if google name is not a string type', function() {
        var m = new Usr({
            google : {
                id : '102010',
                token: 'fhdhgretvsg',
                email:'tgattu@gmail.com',
                name:{}

            },
            grid : [{},{}],
            missions: [{},{}]
        });
        m.validate(function(err){
            expect(err.errors['google.name'].name).to.exist;
            expect(err.errors['google.name'].name).to.equal('CastError');
        });  
    });

    it('should invalidate if grid is not defined as its not mandatory', function() {
        var m = new Usr({
            google : {
                id : '102010',
                token: 'fhdhgretvsg',
                email:'tgattu@gmail.com',
                name:'Taruni Gattu'

            },
            missions: [{},{}]
        });
        m.validate(function(err){
            assert.isNull(err);
        });  
    });

    it('should validate if missions is not defined as its not mandatory', function() {
        var m = new Usr({
            google : {
                id : '102010',
                token: 'fhdhgretvsg',
                email:'tgattu@gmail.com',
                name:'Taruni Gattu'

            },
            grid : [{},{}]
        });
        m.validate(function(err){
            assert.isNull(err);
        });  
    });

});

describe('Test Suite for User Model Route Controller', function() {
    beforeEach(function() {
        sinon.stub(Usr, 'find');
        sinon.stub(Usr,'findOne');
        sinon.stub(Usr.prototype,'save');
        sinon.stub(Usr,'count');
    });
 
 
    afterEach(function() {
        Usr.find.restore();
        Usr.findOne.restore();
        Usr.prototype.save.restore();
        Usr.count.restore();
    });
 
    it('should get current role of the user', function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = null;
        var user = {
                google:{},
                missions:[
                {
                    name:"AZero",
                    currentRole:'MD',
                    allowedRoles:[
                        {callsign:'SYS'},
                        {callsign:'CC'}
                    ]
                }]
            }
        Usr.findOne.yields(error, user);
        var req = {
            query : {
                mission:'AZero',
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        }

        userCtrl.getCurrentRole(req, res);
        sinon.assert.calledWith(Usr.findOne,{ 'google.email' : 'tgattu@gmail.com', 'missions.name' : 'AZero' },{'missions.$' : 1 },sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send, 'MD');
    });

    it('should not get current role of the user when error', function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = {name:"MongoError"};
        var user = null;
        Usr.findOne.yields(error,user);
        var req = {
            query : {
                mission:'AZero',
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        }

        userCtrl.getCurrentRole(req, res);
        sinon.assert.calledWith(Usr.findOne,{ 'google.email' : 'tgattu@gmail.com', 'missions.name' : 'AZero' },{'missions.$' : 1 },sinon.match.func);
        expect(res.send.calledOnce).to.be.false;
    });

    it('should get allowed roles of the user', function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = null;
        var user = {
                google:{},
                missions:[
                {
                    name:"AZero",
                    currentRole:'MD',
                    allowedRoles:[
                        {callsign:'SYS'},
                        {callsign:'CC'}
                    ]
                }]
            }
        Usr.findOne.yields(error, user);
        var req = {
            query : {
                mission:'AZero',
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        }

        userCtrl.getAllowedRoles(req, res);
        sinon.assert.calledWith(Usr.findOne,{ 'google.email' : 'tgattu@gmail.com', 'missions.name' : 'AZero' },{'missions.$' : 1 },sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send, [{callsign:'SYS'},{callsign:'CC'}]);
    });

    it('should not get allowed roles of the user when error', function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = {name:"MongoError"};
        var user = null;
        Usr.findOne.yields(error,user);
        var req = {
            query : {
                mission:'AZero',
                email:'tgattu@gmail.com'
            }
        }
        var res = {
            send: sinon.spy()
        }

        userCtrl.getAllowedRoles(req, res);
        sinon.assert.calledWith(Usr.findOne,{ 'google.email' : 'tgattu@gmail.com', 'missions.name' : 'AZero' },{'missions.$' : 1 },sinon.match.func);
        expect(res.send.calledOnce).to.be.false;
    });

    it('should get all users', function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = null;
        var users = [
                {
                    google:{},
                    missions:[
                        {
                            name:"AZero",
                            currentRole:'MD',
                            allowedRoles:[
                                {callsign:'SYS'},
                                {callsign:'CC'}
                            ]
                        }
                    ]
                }
                            
            ];
        Usr.find.yields(error, users);
        var req = {
            query : {
                mission:'AZero'
            }
        }
        var res = {
            send: sinon.spy()
        }

        userCtrl.getUsers(req, res);
        sinon.assert.calledWith(Usr.find,{ 'missions.name' : 'AZero' },{'google' : 1, 'missions.$' : 1 },sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send, [{ allowedRoles: { CC: 1, SYS: 1 }, currentRole: "MD", google: {  } }]);
    });

    it('should not get all users when error', function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = {name:"MongoError"};
        var users = null;
        Usr.find.yields(error,users);
        var req = {
            query : {
                mission:'AZero'
            }
        }
        var res = {
            send: sinon.spy()
        }

        userCtrl.getUsers(req, res);
        sinon.assert.calledWith(Usr.find,{ 'missions.name' : 'AZero' },{'google' : 1, 'missions.$' : 1 },sinon.match.func);
        expect(res.send.calledOnce).to.be.false;
    });

    it('should get all roles', function() {
        userCtrl = require('../server/controllers/user.controller');
        var req = {}
        var res = {
            send: sinon.spy()
        }
        var output = require('../config/role');

        userCtrl.getRoles(req, res);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send, output);
    });

    it("should post role for user", function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = null;
        var user = {
                google:{},
                missions:[
                    {
                        name:"AZero",
                        currentRole:'MD',
                        allowedRoles:[
                            {callsign:'SYS'},
                            {callsign:'CC'}
                        ]
                    }
                ],
                markModified: function(message){},
                save: function(cb){
                    var err = null;
                    var result = {
                        "data":{
                            google:{},
                            missions:[
                                {
                                    name:"AZero",
                                    currentRole:'SYS',
                                    allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'IT'},
                                        {callsign:'PROXY'}
                                    ]
                                }
                            ]
                        },"status":200
                    };
                    cb(err,result);
                }
            };
        Usr.findOne.yields(error,user);
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:'SYS'
            }
        }
        var res = {
            send: sinon.spy()
        }
        var output = {
            "data":{
                google:{},
                missions:[{
                    name:"AZero",
                    currentRole:'SYS',
                    allowedRoles:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
                }]
            },
            "status":200
        };

        userCtrl.setUserRole(req, res);
        sinon.assert.calledWith(Usr.findOne,{ 'google.email' : 'tgattu@gmail.com', 'missions.name' : 'AZero' },sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);

    });

    it("should not post role for user when error", function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = {name:"MongoError"};
        var user = null;
        Usr.findOne.yields(error,user);
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:'SYS'
            }
        }
        var res = {
            send: sinon.spy()
        }
        var output = {
            "data":{
                google:{},
                missions:[{
                    name:"AZero",
                    currentRole:'SYS',
                    allowedRoles:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
                }]
            },
            "status":200
        };

        userCtrl.setUserRole(req, res);
        sinon.assert.calledWith(Usr.findOne,{ 'google.email' : 'tgattu@gmail.com', 'missions.name' : 'AZero' },sinon.match.func);
        expect(res.send.calledOnce).to.be.false;
    });

    it("should post allowed roles for user", function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = null;
        var user = 
            {
                google:{},
                missions:[
                    {
                        name:"AZero",
                        currentRole:'MD',
                        allowedRoles:[
                            {callsign:'SYS'},
                            {callsign:'CC'}
                        ]
                    }
                ],
                markModified: function(message){},
                save: function(cb){
                    var err = null;
                    var result = {
                        "data":{
                            google:{},
                            missions:[
                                {
                                    name:"AZero",
                                    currentRole:'SYS',
                                    allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'IT'},
                                        {callsign:'PROXY'}
                                    ]
                                }]
                        },"status":200
                    };
                    cb(err,result);}
            };
        Usr.findOne.yields(error,user);
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
            }
        }
        var res = {
            send: sinon.spy()
        }
        var output = {
            "data":{
                google:{},
                missions:[{
                    name:"AZero",
                    currentRole:'SYS',
                    allowedRoles:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
                }]
            },
            "status":200
        };

        userCtrl.setAllowedRoles(req, res);
        sinon.assert.calledWith(Usr.findOne,{ 'google.email' : 'tgattu@gmail.com', 'missions.name' : 'AZero' },sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);

    });

    it("should not post allowed roles for user when error", function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = {name:"MongoError"};
        var user = null;
        Usr.findOne.yields(error,user);
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
            }
        }
        var res = {
            send: sinon.spy()
        }
        var output = {
            "data":{
                google:{},
                missions:[{
                    name:"AZero",
                    currentRole:'SYS',
                    allowedRoles:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
                }]
            },
            "status":200
        };

        userCtrl.setAllowedRoles(req, res);
        sinon.assert.calledWith(Usr.findOne,{ 'google.email' : 'tgattu@gmail.com', 'missions.name' : 'AZero' },sinon.match.func);
        expect(res.send.calledOnce).to.be.false;

    });

    it("should set first user as 'MD' and post mission for user when no users are available for that mission", function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = null;
        var count = 0;
        var user = {
            google:{},
            missions:[
                {
                    name:"AZero",
                    currentRole:'MD',
                    allowedRoles:[
                        {callsign:'SYS'},
                        {callsign:'CC'}
                    ]
                }
            ],
            markModified: function(message){},
            save: function(cb){
                var err = null;
                var result = {
                    "data":{
                        google:{},
                        missions:[
                            {
                                name:"AZero",
                                currentRole:'SYS',
                                allowedRoles:[
                                    {callsign:'SYS'},
                                    {callsign:'IT'},
                                    {callsign:'PROXY'}
                                ]
                            }
                        ]
                    },"status":200
                };
                cb(err,result);
            }                          
        };
        Usr.count.yields(error,count);
        Usr.findOne.yields(error,user);
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
            }
        }
        var res = {
            send: sinon.spy()
        }
        var defaultRole = {
            'name'     : configRole.roles['MD'].name,
            'callsign' : configRole.roles['MD'].callsign
        };
        var output = {
            allowedRoles: [{ callsign: "VIP", name: "Observer" }, { callsign: "MD", name: "Mission Director" }],
            currentRole: defaultRole,
            name: "AZero"
        }
        userCtrl.setMissionForUser(req, res);
        sinon.assert.calledWith(Usr.count,{ 'missions.name' : 'AZero' },sinon.match.func)
        sinon.assert.calledWith(Usr.findOne,{ 'google.email' : 'tgattu@gmail.com'},sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
        
    });


    it("should  not set first user as 'MD' and post mission for user when no users are available for that mission but database error", function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = {name:"MongoError"};
        var count = null;
        var user = null;
        Usr.count.yields(error,count);
        Usr.findOne.yields(error,user);
        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
            }
        }
        var res = {
            send: sinon.spy()
        }
        var defaultRole = {
            'name'     : configRole.roles['MD'].name,
            'callsign' : configRole.roles['MD'].callsign
        };
        var output = {
            allowedRoles: [{ callsign: "VIP", name: "Observer" }, { callsign: "MD", name: "Mission Director" }],
            currentRole: defaultRole,
            name: "AZero"
        }
        userCtrl.setMissionForUser(req, res);
        sinon.assert.calledWith(Usr.count,{ 'missions.name' : 'AZero' },sinon.match.func)
        sinon.assert.calledWith(Usr.findOne,{ 'google.email' : 'tgattu@gmail.com'},sinon.match.func);
        expect(res.send.calledOnce).to.be.false;        
    });

    it("should set mission for user when no missions are available", function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = null;
        var count = 2;
        var user = {
            google:{},
            missions:[],
            markModified: function(message){},
            save: function(cb){
                var err = null;
                var result = {
                    "data":{
                        google:{},
                        missions:[
                            {
                                name:"AZero",
                                currentRole:'SYS',
                                allowedRoles:[
                                    {callsign:'SYS'},
                                    {callsign:'IT'},
                                    {callsign:'PROXY'}
                                ]
                            }
                        ]
                    },"status":200
                };
                cb(err,result);}
        };
        Usr.count.yields(error,count);
        Usr.findOne.yields(error,user);

        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
            }
        }
        var res = {
            send: sinon.spy()
        }
        var defaultRole = {
                        'name'     : configRole.roles['MD'].name,
                        'callsign' : configRole.roles['MD'].callsign
                    };
        var output = { 
            name: 'AZero',
            currentRole: { name: 'Observer', callsign: 'VIP' },
            allowedRoles: [ { name: 'Observer', callsign: 'VIP' } ] 
        }

  
        userCtrl.setMissionForUser(req, res);
        sinon.assert.calledWith(Usr.count,{ 'missions.name' : 'AZero' },sinon.match.func)
        sinon.assert.calledWith(Usr.findOne,{ 'google.email' : 'tgattu@gmail.com'},sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
        
    });

    it("should not set mission for user when no missions are available but database error", function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = null;
        var count = 2;
        var user = {
            google:{},
            missions:[],
            markModified: function(message){},
            save: function(cb){
                var err = {name:'MongoError'};
                var result = null;
                cb(err,result);}
        };
        Usr.count.yields(error,count);
        Usr.findOne.yields(error,user);

        var req = {
            body : {
                mission:'AZero',
                email:'tgattu@gmail.com',
                role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
            }
        }
        var res = {
            send: sinon.spy()
        }
        var defaultRole = {
                        'name'     : configRole.roles['MD'].name,
                        'callsign' : configRole.roles['MD'].callsign
                    };
        var output = { 
            name: 'AZero',
            currentRole: { name: 'Observer', callsign: 'VIP' },
            allowedRoles: [ { name: 'Observer', callsign: 'VIP' } ] 
        }

  
        userCtrl.setMissionForUser(req, res);
        sinon.assert.calledWith(Usr.count,{ 'missions.name' : 'AZero' },sinon.match.func)
        sinon.assert.calledWith(Usr.findOne,{ 'google.email' : 'tgattu@gmail.com'},sinon.match.func);
        expect(res.send.calledOnce).to.be.false;
        
    });


    it("should set mission for user when missions are available", function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = null;
        var count = 2;

        var user = 
            {
                google:{},
                missions:[
                    {
                        name:"AZero",
                        currentRole:'MD',
                        allowedRoles:[
                            {callsign:'SYS'},
                            {callsign:'CC'}
                        ]
                    },
                    {
                        name:"AZero",
                        currentRole:'MD',
                        allowedRoles:[
                            {callsign:'SYS'},
                            {callsign:'CC'}
                        ]
                    }
                ],
                markModified: function(message){},
                save: function(cb){
                    var err = null;
                    var result = {
                        "data":{
                            google:{},
                            missions:[
                                {
                                    name:"AZero",
                                    currentRole:'SYS',
                                    allowedRoles:[
                                        {callsign:'SYS'},
                                        {callsign:'IT'},
                                        {callsign:'PROXY'}
                                    ]
                                }
                            ]
                        },"status":200
                    };
                cb(err,result);}
            };

            Usr.count.yields(error,count);
            Usr.findOne.yields(error,user);
            var req = {
                body : {
                    mission:'AZero',
                    email:'tgattu@gmail.com',
                    role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
                }
            }
            var res = {
                send: sinon.spy()
            }
            var defaultRole = {
                'name'     : configRole.roles['MD'].name,
                'callsign' : configRole.roles['MD'].callsign
            };
            var output = {
                allowedRoles: [{ callsign: "SYS" }, { callsign: "CC" }],
                currentRole: { callsign: "VIP", name: "Observer" },
                name: "AZero"
            }
  
    
        userCtrl.setMissionForUser(req, res);
        sinon.assert.calledWith(Usr.count,{ 'missions.name' : 'AZero' },sinon.match.func)
        sinon.assert.calledWith(Usr.findOne,{ 'google.email' : 'tgattu@gmail.com'},sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,output);
        
    });

    it("should not set mission for user when missions are available but database error", function() {
        userCtrl = require('../server/controllers/user.controller');
        var error = null;
        var count = 2;

        var user = 
            {
                google:{},
                missions:[
                    {
                        name:"AZero",
                        currentRole:'MD',
                        allowedRoles:[
                            {callsign:'SYS'},
                            {callsign:'CC'}
                        ]
                    },
                    {
                        name:"AZero",
                        currentRole:'MD',
                        allowedRoles:[
                            {callsign:'SYS'},
                            {callsign:'CC'}
                        ]
                    }
                ],
                markModified: function(message){},
                save: function(cb){
                    var err = {name:"MongoError"};
                    var result = null;
                cb(err,result);}
            };

            Usr.count.yields(error,count);
            Usr.findOne.yields(error,user);
            var req = {
                body : {
                    mission:'AZero',
                    email:'tgattu@gmail.com',
                    role:[
                        {callsign:'SYS'},
                        {callsign:'IT'},
                        {callsign:'PROXY'}                    
                    ]
                }
            }
            var res = {
                send: sinon.spy()
            }
            var defaultRole = {
                'name'     : configRole.roles['MD'].name,
                'callsign' : configRole.roles['MD'].callsign
            };
            var output = {
                allowedRoles: [{ callsign: "SYS" }, { callsign: "CC" }],
                currentRole: { callsign: "VIP", name: "Observer" },
                name: "AZero"
            }
  
    
        userCtrl.setMissionForUser(req, res);
        sinon.assert.calledWith(Usr.count,{ 'missions.name' : 'AZero' },sinon.match.func)
        sinon.assert.calledWith(Usr.findOne,{ 'google.email' : 'tgattu@gmail.com'},sinon.match.func);
        expect(res.send.calledOnce).to.be.false;
        
    });
});
