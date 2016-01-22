'use strict';

var async = require('async');
var expect = require('chai').expect;

var manager = require('../manager');
var fixtures = manager.fixtures.sessions;
var sessionStore = manager.sessionStore;

describe('SessionStore#destroy(session_id, cb)', function() {

	before(manager.setUp);
	after(manager.tearDown);

	describe('when the session exists', function() {

		before(manager.populateSessions);

		it('should delete the session', function(done) {

			async.each(fixtures, function(fixture, nextFixture) {

				var session_id = fixture.session_id;
				var data = fixture.data;

				sessionStore.destroy(session_id, function(error) {

					expect(error).to.equal(undefined);

					sessionStore.get(session_id, function(error, session) {

						if (error) {
							return nextFixture(error);
						}

						expect(session).to.equal(null);

						nextFixture();
					});
				});

			}, done);

		});
	});

	describe('when the session does not exist', function() {

		before(manager.clearSessions);

		it('should do nothing', function(done) {

			async.each(fixtures, function(fixture, nextFixture) {

				var session_id = fixture.session_id;
				var data = fixture.data;

				sessionStore.destroy(session_id, function(error) {

					expect(error).to.equal(undefined);

					nextFixture();
				});

			}, done);

		});
	});
});
