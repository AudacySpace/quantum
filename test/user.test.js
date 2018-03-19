var chai = require("chai");
var spies = require('chai-spies');
chai.use(spies);
var sinon = require('sinon');
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
var expect = chai.expect;
var assert = chai.assert;
var Usr = require('../server/models/user');

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
