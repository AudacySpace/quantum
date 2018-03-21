var chai = require("chai");
var spies = require('chai-spies');
chai.use(spies);
var sinon = require('sinon');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var expect = chai.expect;
var assert = chai.assert;
var Procedure = require('../server/models/procedure');
var multer = require('multer');
var XLSX = require("xlsx");

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
        sinon.stub(Procedure.prototype,'save');
    });
 
 
    afterEach(function() {
        Procedure.find.restore();
        Procedure.findOne.restore();
        Procedure.prototype.save.restore();
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

    it('should upload a procedure', function() {
        procedure = require('../server/controllers/procedure.controller');
        Procedure.prototype.save.yields(null,{"data":"100","status":200});
        var req = {};
        // var req = { 
        //     body: {
        //         file:{
        //             fieldname: 'file',
        //             originalname: '1.1 - Audacy Zero - Procedure Example.xlsx',
        //             encoding: '7bit',
        //             mimetype: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        //             destination: '/tmp/uploads',
        //             filename: '1.1 - Audacy Zero - Procedure Example.xlsx',
        //             path: './testfiles/1.1 - Audacy Zero - Procedure Example.xlsx',
        //             size: 11795 
        //         }
        //     }, ReadableState: {
        //         objectMode: false,
        //         highWaterMark: 16384,
        //        // buffer: [ <Buffer 2d 2d 2d 2d 2d 2d 57 65 62 4b 69 74 46 6f 72 6d 42 6f 75 6e 64 61 72 79 71 65 41 54 79 53 39 44 35 5a 4b 37 63 50 4b 44 0d 0a 43 6f 6e 74 65 6e 74 2d ... > ],
        //         length: 12078,
        //         pipes: null,
        //         pipesCount: 0,
        //         flowing: null,
        //         ended: true,
        //         endEmitted: false,
        //         reading: false,
        //         sync: true,
        //         needReadable: false,
        //         emittedReadable: true,
        //         readableListening: false,
        //         resumeScheduled: false,
        //         defaultEncoding: 'utf8',
        //         ranOut: false,
        //         awaitDrain: 0,
        //         readingMore: true,
        //         decoder: null,
        //         encoding: null 
        //     },
  
        //     headers:{ 
        //         connection: 'upgrade',
        //         host: 'localhost',
        //         'content-length': '12078',
        //         accept: 'application/json, text/plain, */*',
        //         origin: 'https://localhost',
        //         'user-agent': 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.186 Mobile Safari/537.36',
        //         'content-type': 'multipart/form-data; boundary=----WebKitFormBoundary2adRYnQZO7Fk5Cy6',
        //         referer: 'https://localhost/dashboard',
        //         'accept-encoding': 'gzip, deflate, br',
        //         'accept-language': 'en-US,en;q=0.9',
        //         cookie: 'connect.sid=s%3Aquo--K5WE18K6vMeL8WnpAE9XtW_-PUU.%2F%2FAHCOGnn%2BRm5N7FC7Zd8%2BdRbyl%2FlN7JpGabheK%2BxKA' },
        // };

        var res = {
            json: sinon.stub()
        };
 
        // procedure.uploadFile(req, res);
        // expect(res.json.calledOnce).to.be.true;
        // sinon.assert.calledWith(res.json, {error_code:0,err_desc:null});
    });

    it('should save a procedure instance', function() {
        procedure = require('../server/controllers/procedure.controller');
        var error = null;
        var procs = {    
            "instances": [],
            "procedure": {
                "eventname": "SF Earth Station",
                "lastuse": "",
                "title": "SF Earth Station - Procedure Example copy 2",
                "id": "2.3",
                "sections": [
                    {
                        "Content": "Issue null command and confirm response",
                        "Type": "Action",
                        "Role": "MD, CC",
                        "Step": "1.0"
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
                        "Step": "2.1"
                    },
                    {
                        "Content": "Close the procedure in Quantum (complete this step)",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.2"
                    }
                ]
            },
            save:function(callback){
                var err = null;
                var res = {"data":""};
                callback(err,res);
            }
        };

        Procedure.findOne.yields(error,procs);
        var req = { 
            body: {
                id:'2.3',
                usernamerole:'Taruni Gattu (MD)',
                lastuse:'2018 - 045.19:59:43 UTC'
            }
        };

        var res = {
            send: sinon.stub()
        };
 
        procedure.saveProcedureInstance(req, res);
        sinon.assert.calledWith(Procedure.findOne,{ 'procedure.id' : '2.3' },sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send, {"revision":1});
    });

    it('should not save a procedure instance when error', function() {
        procedure = require('../server/controllers/procedure.controller');
        var error = {name:"MongoError"};
        var procs = null
        Procedure.findOne.yields(error,procs);
        var req = { 
            body: {
                id:'2.3',
                usernamerole:'Taruni Gattu (MD)',
                lastuse:'2018 - 045.19:59:43 UTC'
            }
        };

        var res = {
            send: sinon.stub()
        };
 
        procedure.saveProcedureInstance(req, res);
        sinon.assert.calledWith(Procedure.findOne,{ 'procedure.id' : '2.3' },sinon.match.func);
        expect(res.send.calledOnce).to.be.false;
    });

    it('should set info for a procedure step', function() {
        procedure = require('../server/controllers/procedure.controller');
        var error = null;
        var procs = {    
            "instances": [
                {
                    "Steps":[
                        { "step": "1.0",
                            "info": "2018 - 057.21:54:35 UTC Taruni Gattu(MD)"
                        },
                        {
                            "step": "2.0",
                            "info": ""
                        },
                        {
                            "step": "2.1",
                            "info": ""
                        },
                        {
                            "step": "2.2",
                            "info": ""
                        }
                    ],
                    "openedBy": "Taruni Gattu(MD)",
                    "closedBy": "",
                    "startedAt": "2018 - 057.21:53:35 UTC",
                    "completedAt": "",
                    "revision": 1,
                    "running": true
                }
            ],
            "procedure": {
                "eventname": "SF Earth Station",
                "lastuse": "2018 - 057.21:56:35 UTC",
                "title": "SF Earth Station - Procedure Example copy 2",
                "id": "2.3",
                "sections": [
                    {
                        "Content": "Issue null command and confirm response",
                        "Type": "Action",
                        "Role": "MD, CC",
                        "Step": "1.0"
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
                        "Step": "2.1"
                    },
                    {
                        "Content": "Close the procedure in Quantum (complete this step)",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.2"
                    }
                ]
            },
            save:function(callback){
                var err = null;
                var res = {"data":""};
                callback(err,res);
            },
            markModified:function(field){

            }
        };

        Procedure.findOne.yields(error,procs);
        var req = { 
            body: {
                id:'2.3',
                usernamerole:'Taruni Gattu(MD)',
                lastuse:'2018 - 045.19:59:43 UTC',
                info:'2018 - 045.19:59:43 UTC Taruni Gattu(MD)',
                revision:1,
                step:1,
            }
        };

        var res = {
            send: sinon.stub()
        };
 
        procedure.setInfo(req, res);
        sinon.assert.calledWith(Procedure.findOne,{ 'procedure.id' : '2.3' },sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,{"data":""});
    });

    it('should not set info for a procedure step when error', function() {
        procedure = require('../server/controllers/procedure.controller');
        var error = {name:"MongoError"};
        var procs = null;

        Procedure.findOne.yields(error,procs);
        var req = { 
            body: {
                id:'2.3',
                usernamerole:'Taruni Gattu(MD)',
                lastuse:'2018 - 045.19:59:43 UTC',
                info:'2018 - 045.19:59:43 UTC Taruni Gattu(MD)',
                revision:1,
                step:1,
            }
        };

        var res = {
            send: sinon.stub()
        };
 
        procedure.setInfo(req, res);
        sinon.assert.calledWith(Procedure.findOne,{ 'procedure.id' : '2.3' },sinon.match.func);
        expect(res.send.calledOnce).to.be.false;
    });

    it('should set procedure instance as completed', function() {
        procedure = require('../server/controllers/procedure.controller');
        var error = null;
        var procs = {    
            "instances": [
                {
                    "Steps":[
                        { "step": "1.0",
                            "info": "2018 - 057.21:54:35 UTC Taruni Gattu(MD)"
                        },
                        {
                            "step": "2.0",
                            "info": "2018 - 057.21:55:35 UTC Taruni Gattu(MD)"
                        },
                        {
                            "step": "2.1",
                            "info": "2018 - 057.21:57:35 UTC Taruni Gattu(MD)"
                        },
                        {
                            "step": "2.2",
                            "info": ""
                        }
                    ],
                    "openedBy": "Taruni Gattu(MD)",
                    "closedBy": "",
                    "startedAt": "2018 - 057.21:53:35 UTC",
                    "completedAt": "",
                    "revision": 1,
                    "running": true
                }
            ],
            "procedure": {
                "eventname": "SF Earth Station",
                "lastuse": "2018 - 057.21:57:35 UTC",
                "title": "SF Earth Station - Procedure Example copy 2",
                "id": "2.3",
                "sections": [
                    {
                        "Content": "Issue null command and confirm response",
                        "Type": "Action",
                        "Role": "MD, CC",
                        "Step": "1.0"
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
                        "Step": "2.1"
                    },
                    {
                        "Content": "Close the procedure in Quantum (complete this step)",
                        "Type": "Action",
                        "Role": "MD",
                        "Step": "2.2"
                    }
                ]
            },
            save:function(callback){
                var err = null;
                var res = {"data":""};
                callback(err,res);
            },
            markModified:function(field){

            }
        };

        Procedure.findOne.yields(error,procs);
        var req = { 
            body: {
                id:'2.3',
                usernamerole:'Taruni Gattu(MD)',
                lastuse:'2018 - 057.21:59:35 UTC',
                info:'2018 - 057.21:59:35 UTC Taruni Gattu(MD)',
                revision:1,
                step:3,
            }
        };

        var res = {
            send: sinon.stub()
        };
 
        procedure.setInstanceCompleted(req, res);
        sinon.assert.calledWith(Procedure.findOne,{ 'procedure.id' : '2.3' },sinon.match.func);
        expect(res.send.calledOnce).to.be.true;
        sinon.assert.calledWith(res.send,{"data":""});
    });

    it('should not set procedure instance as completed when error', function() {
        procedure = require('../server/controllers/procedure.controller');
        var error = {name:"MongoError"};
        var procs = null;
        Procedure.findOne.yields(error,procs);
        var req = { 
            body: {
                id:'2.3',
                usernamerole:'Taruni Gattu(MD)',
                lastuse:'2018 - 057.21:59:35 UTC',
                info:'2018 - 057.21:59:35 UTC Taruni Gattu(MD)',
                revision:1,
                step:3,
            }
        };

        var res = {
            send: sinon.stub()
        };
 
        procedure.setInstanceCompleted(req, res);
        sinon.assert.calledWith(Procedure.findOne,{ 'procedure.id' : '2.3' },sinon.match.func);
        expect(res.send.calledOnce).to.be.false;
    });
});
