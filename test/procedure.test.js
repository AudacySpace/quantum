var chai = require("chai");
var spies = require('chai-spies');
chai.use(spies);
var sinon = require('sinon');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var expect = chai.expect;
var assert = chai.assert;
var Procedure = require('../server/models/procedure');

describe('Test Suite for Procedure Model ', function() {
    it('should be invalid if the model is empty', function() {
        var m = new Procedure();
        m.validate(function(err) {
            expect(err.errors['procedure.id']).to.exist;
            expect(err.errors['procedure.title']).to.exist;
            expect(err.errors['procedure.sections']).to.exist;
            expect(err.errors['procedure.eventname']).to.exist;
        });
    });

    it('should validate if all of the properties are defined with valid data types', function() {
        var m = new Procedure({
            procedure : {
                id : '1.1',
                title: 'Audacy Zero - Procedure Example',
                lastuse:'2018 - 060.00:29:29 UTC' ,
                sections:[{},{}],
                eventname:'Audacy Zero'

            },
            instances : [{},{}]
        });
        m.validate(function(err){
            assert.isNull(err);
        });  
    });

    it('should invalidate if procedure id is not a string type', function() {
        var m = new Procedure({
            procedure : {
                id :{},
                title: 'Audacy Zero - Procedure Example',
                lastuse:'2018 - 060.00:29:29 UTC' ,
                sections:[{},{}],
                eventname:'Audacy Zero'

            },
            instances : [{},{}]
        });
        m.validate(function(err){
            expect(err.errors['procedure.id'].name).to.exist;
            expect(err.errors['procedure.id'].name).to.equal('CastError');
        });  
    });


    it('should invalidate if procedure title is not a string type', function() {
        var m = new Procedure({
            procedure : {
                id : '1.1',
                title: {},
                lastuse:'2018 - 060.00:29:29 UTC' ,
                sections:[{},{}],
                eventname:'Audacy Zero'
            },
            instances : [{},{}]
        });
        m.validate(function(err){
            expect(err.errors['procedure.title'].name).to.exist;
            expect(err.errors['procedure.title'].name).to.equal('CastError');
        });  
    });

    it('should validate if procedure lastuse is not defined as its not mandatory', function() {
        var m = new Procedure({
            procedure : {
                id : '1.1',
                title: 'Audacy Zero - Procedure Example',
                sections:[{},{}],
                eventname:'Audacy Zero'
            },
            instances : [{},{}]
        });
        m.validate(function(err){
           assert.isNull(err);
        });  
    });

    it('should invalidate if procedure sections is not defined', function() {
        var m = new Procedure({
            procedure : {
                id : '1.1',
                title: 'Audacy Zero - Procedure Example',
                lastuse:'2018 - 060.00:29:29 UTC' ,
                eventname:'Audacy Zero'
            },
            instances : [{},{}]
        });
        m.validate(function(err){
            expect(err.errors['procedure.sections'].name).to.exist;
            expect(err.errors['procedure.sections'].name).to.equal('ValidatorError');
        });  
    });

    it('should invalidate if procedure eventname is not a string type', function() {
        var m = new Procedure({
            procedure : {
                id : '1.1',
                title: 'Audacy Zero - Procedure Example',
                lastuse:'2018 - 060.00:29:29 UTC' ,
                sections:[{},{}],
                eventname:{}
            },
            instances : [{},{}]
        });
        m.validate(function(err){
            expect(err.errors['procedure.eventname'].name).to.exist;
            expect(err.errors['procedure.eventname'].name).to.equal('CastError');
        });  
    });

    it('should validate if instances is not defined as its not mandatory', function() {
        var m = new Procedure({
            procedure : {
                id : '1.1',
                title: 'Audacy Zero - Procedure Example',
                lastuse:'2018 - 060.00:29:29 UTC' ,
                sections:[{},{}],
                eventname:'Audacy Zero',
            }
        });
        m.validate(function(err){
            assert.isNull(err);
        });  
    });

});

describe('Test Suite for Procedure Route Controller', function() {
    beforeEach(function() {
        sinon.stub(Procedure, 'find');
        sinon.stub(Procedure,'findOne');
    });
 
 
    afterEach(function() {
        Procedure.find.restore();
        Procedure.findOne.restore();
    });
 
    it('should get all procedures', function() {
        procedure = require('../server/controllers/procedure.controller');
        Procedure.find.yields(null, {"data":"100","status":200});
        var req = { 
            query : {}

        };
        var res = {
            send: sinon.stub()
        };
 
        procedure.getProcedureList(req, res);
        sinon.assert.calledWith(Procedure.find,{},{},sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send, {"data":"100","status":200});
    });

    it('should not get all procedures when error', function() {
        procedure = require('../server/controllers/procedure.controller');
        Procedure.find.yields({"name":"Mongo Error"}, {"status":403});
        var req = { 
            query : {}

        };
        var res = {
            send: sinon.stub()
        };
 
        procedure.getProcedureList(req, res);
        sinon.assert.calledWith(Procedure.find,{},{},sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,{"status":403});
    });

    it('should get a procedure section data on download', function() {
        procedure = require('../server/controllers/procedure.controller');
        var procs = {
            sections:[
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
                }
        ]};
        Procedure.findOne.yields(null, {"procedure":procs,"status":200});
        var req = { 
            query : {id:'1.1'}

        };
        var res = {
            send: sinon.stub()
        };
 
        procedure.getProcedureData(req, res);
        sinon.assert.calledWith(Procedure.findOne,{'procedure.id' : '1.1' },sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
    });

    it('should not get a procedure section data on download when error', function() {
        procedure = require('../server/controllers/procedure.controller');
        var procs = {
            sections:[

        ]};
        Procedure.findOne.yields({"name":"MongoError"}, {"status":403});
        var req = { 
            query : {id:'1.1'}

        };
        var res = {
            send: sinon.stub()
        };
 
        procedure.getProcedureData(req, res);
        sinon.assert.calledWith(Procedure.findOne,{'procedure.id' : '1.1' },sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,{});
    });

    it('should get live procedure instance data', function() {
        procedure = require('../server/controllers/procedure.controller');
        var instances = [
        {
            "openedBy": "Taruni Gattu(SYS)",
            "Steps": [
                {
                    "step": "1.0",
                    "info": "045.20:15:21 UTC Chavi Malhotra(MD)"
                },
                {
                    "step": "1.1",
                    "info": "045.20:15:28 UTC Chavi Malhotra(MD)"
                },
                {
                    "step": "1.2",
                    "info": "045.20:15:33 UTC Chavi Malhotra(MD)"
                },
                {
                    "step": "2.0",
                    "info": "045.19:59:43 UTC Taruni Gattu(SYS)"
                },
                {
                    "step": "2.1.0",
                    "info": "045.20:22:31 UTC Chavi Malhotra(CC)"
                }
            ],
            "closedBy": "",
            "startedAt": "2018 - 045.19:59:43 UTC",
            "completedAt": "",
            "revision": 1,
            "running": true
        },
        {
            "openedBy": "Taruni Gattu(SYS)",
            "Steps": [
                {
                    "step": "1.0",
                    "info": "045.20:15:21 UTC Chavi Malhotra(MD)"
                },
                {
                    "step": "1.1",
                    "info": "045.20:15:28 UTC Chavi Malhotra(MD)"
                },
                {
                    "step": "1.2",
                    "info": "045.20:15:33 UTC Chavi Malhotra(MD)"
                },
                {
                    "step": "2.0",
                    "info": "045.19:59:43 UTC Taruni Gattu(SYS)"
                },
                {
                    "step": "2.1.0",
                    "info": "045.20:22:31 UTC Chavi Malhotra(CC)"
                }
            ],
            "closedBy": "",
            "startedAt": "2018 - 045.19:59:43 UTC",
            "completedAt": "",
            "revision": 2,
            "running": true

        }
        ];
        Procedure.findOne.yields(null, {"instances":instances,"status":200});
        var req = { 
            query : {procedureID:'1.1',currentRevision:1}

        };
        var res = {
            send: sinon.stub()
        };
 
        procedure.getLiveInstanceData(req, res);
        sinon.assert.calledWith(Procedure.findOne,{'procedure.id' : '1.1' },sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,instances[0]);
    });

    it('should not get live procedure instance data when error', function() {
        procedure = require('../server/controllers/procedure.controller');

        Procedure.findOne.yields({"name":"MongoError"}, {"instances":[],"status":403});
        var req = { 
            query : {procedureID:'1.1',currentRevision:1}

        };
        var res = {
            send: sinon.stub()
        };
 
        procedure.getLiveInstanceData(req, res);
        sinon.assert.calledWith(Procedure.findOne,{'procedure.id' : '1.1' },sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,[]);
    });


    it('should get all procedure instances', function() {
        procedure = require('../server/controllers/procedure.controller');
        var proc = {
                id:'1.1',
                title:'Procedure Example',
                lastuse:'',
                eventname:'',
                sections:[],
            };
        var instances = [
            {
                "openedBy": "Taruni Gattu(SYS)",
                "Steps": [
                    {
                        "step": "1.0",
                        "info": "045.20:15:21 UTC Chavi Malhotra(MD)"
                    },
                    {
                        "step": "1.1",
                        "info": "045.20:15:28 UTC Chavi Malhotra(MD)"
                    },
                    {
                        "step": "1.2",
                        "info": "045.20:15:33 UTC Chavi Malhotra(MD)"
                    },
                    {
                        "step": "2.0",
                        "info": "045.19:59:43 UTC Taruni Gattu(SYS)"
                    },
                    {
                        "step": "2.1.0",
                        "info": "045.20:22:31 UTC Chavi Malhotra(CC)"
                    }
                ],
                "closedBy": "",
                "startedAt": "2018 - 045.19:59:43 UTC",
                "completedAt": "",
                "revision": 1,
                "running": true
            },
            {
                "openedBy": "Taruni Gattu(SYS)",
                "Steps": [
                    {
                        "step": "1.0",
                        "info": "045.20:15:21 UTC Chavi Malhotra(MD)"
                    },
                    {
                        "step": "1.1",
                        "info": "045.20:15:28 UTC Chavi Malhotra(MD)"
                    },
                    {
                        "step": "1.2",
                        "info": "045.20:15:33 UTC Chavi Malhotra(MD)"
                    },
                    {
                        "step": "2.0",
                        "info": "045.19:59:43 UTC Taruni Gattu(SYS)"
                    },
                    {
                        "step": "2.1.0",
                        "info": "045.20:22:31 UTC Chavi Malhotra(CC)"
                    }
                ],
                "closedBy": "",
                "startedAt": "2018 - 045.19:59:43 UTC",
                "completedAt": "",
                "revision": 2,
                "running": true

            }
        ];
        Procedure.findOne.yields(null, {"instances":instances,"status":200,"procedure":proc});
        var req = { 
            query : {procedureID:'1.1'}

        };
        var res = {
            send: sinon.stub()
        };
 
        procedure.getAllInstances(req, res);
        sinon.assert.calledWith(Procedure.findOne,{'procedure.id' : '1.1' },sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,{'instances':instances,'title':'Procedure Example'});
    });

    it('should not get all procedure instances when error', function() {
        procedure = require('../server/controllers/procedure.controller');

        Procedure.findOne.yields({"name":"MongoError"}, {"procs":[],"status":403,});
        var req = { 
            query : {procedureID:'1.1',currentRevision:1}

        };
        var res = {
            send: sinon.stub()
        };
 
        procedure.getAllInstances(req, res);
        sinon.assert.calledWith(Procedure.findOne,{'procedure.id' : '1.1' },sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,{});
    });
});
