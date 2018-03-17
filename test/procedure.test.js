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