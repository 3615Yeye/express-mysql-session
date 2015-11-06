'use strict';

var expect = require('chai').expect;

var SessionStore = require('../../index');
var sessionStore = require('../session-store');
var TestManager = require('../test-manager');

describe('SessionStore#createDatabaseTable(cb)', function() {

	before(TestManager.tearDown);

	describe('when the session database table does not yet exist', function() {

		after(TestManager.tearDown);

		it('should create it', function(done) {

			sessionStore.createDatabaseTable(function(error) {

				if (error) {
					return done(new Error(error));
				}

				var sql = 'SELECT `session_id`, `data`, `expires` FROM `sessions`';
				var params = [];

				sessionStore.connection.query(sql, params, function(error, result) {

					if (error) {
						return done(new Error(error));
					}

					done();
				});
			});
		});
	});

	describe('when the session database table does not yet exist', function() {

		before(TestManager.setUp);

		it('should do nothing', function(done) {

			sessionStore.createDatabaseTable(function(error) {

				if (error) {
					return done(new Error(error));
				}

				done();
			});
		});
	});

	describe('when \'options.createDatabaseTable\' is set to FALSE', function() {

		var originalSync;

		before(function() {

			originalSync = SessionStore.prototype.createDatabaseTable;
		});

		afterEach(function() {

			SessionStore.prototype.createDatabaseTable = originalSync;
		});

		it('should not be called when a new sessionStore object is created', function(done) {

			var called = false;

			SessionStore.prototype.createDatabaseTable = function() {

				called = true;

				done(new Error('Sync method should not have been called'));
			};

			var options = require('../config/database');

			options.createDatabaseTable = false;

			new SessionStore(options, function(error) {

				if (called) {
					return;
				}

				if (error) {
					return done(new Error(error));
				}

				done();
			});
		});
	});

	describe('when \'options.createDatabaseTable\' is set to TRUE', function() {

		var options;
		var originalSync;

		before(function() {

			options = require('../config/database');
			options.createDatabaseTable = true;

			originalSync = SessionStore.prototype.createDatabaseTable;
		});

		afterEach(function() {

			SessionStore.prototype.createDatabaseTable = originalSync;
		});

		it('should be called when a new sessionStore object is created', function(done) {

			var called = false;

			SessionStore.prototype.createDatabaseTable = function(cb) {

				called = true;

				cb && cb();
			};

			new SessionStore(options, function(error) {

				if (error) {
					return done(new Error(error));
				}

				if (!called) {
					return done(new Error('Sync method should have been called'));
				}

				done();
			});
		});

		describe('\'options.schema\'', function() {

			var sessionStore;

			before(function(done) {

				sessionStore = new SessionStore(options, done);
			});

			after(function() {

				sessionStore.closeStore();
			});

			it('should create a database table with the correct name and columns', function(done) {

				options.schema = {
					tableName: 'testSessionTable',
					columnNames: {
						session_id: 'testColumnSessionId',
						expires: 'testColumnExpires',
						data: 'testColumnData'
					}
				};

				var sql = 'SHOW COLUMNS FROM ??';
				var params = [options.schema.tableName];

				sessionStore.connection.query(sql, params, function(error, rows) {

					if (error) {
						return done(error);
					}

					expect(rows).to.be.an('array');
					expect(rows).to.have.length(3);
					expect(rows[0].Field).to.equal(options.schema.columnNames.session_id);
					expect(rows[1].Field).to.equal(options.schema.columnNames.expires);
					expect(rows[2].Field).to.equal(options.schema.columnNames.data);
					done();
				});
			});

			it('set() should work', function(done) {

				sessionStore.set('some-session-id', { some: 'data' }, done);
			});

			it('get(session_id, cb) should work', function(done) {

				var session_id = 'some-session-id';

				sessionStore.set(session_id, { some: 'data' }, function(error) {

					if (error) {
						return done(error);
					}

					sessionStore.get(session_id, done);
				});
			});

			it('destroy() should work', function(done) {

				sessionStore.destroy('some-session-id', done);
			});

			it('length() should work', function(done) {

				sessionStore.length(done);
			});

			it('clear() should work', function(done) {

				sessionStore.clear(done);
			});
		});
	});
});
