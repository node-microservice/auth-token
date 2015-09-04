var assert = require('assert'),
	Token = require('./');

describe('Token', function() {

	it('can build multiple configurations', function() {
		var A = Token.alg('HS512').secret('another');
		var B = Token.alg('HS256').secret('secret');

		assert.equal(B.create().alg, 'HS256');
		assert.equal(A.create().alg, 'HS512');
	});

	it('can define claims and properties', function() {
		var Factory = Token.secret('foo').properties({
			tenantId: 'aud',
			iss: 'iss'
		});

		var token = Factory.create({
			aud: 'start',
			iss: 'untouched'
		});

		assert.equal(token.iss, 'untouched');
		assert.equal(token.aud, 'start');
		assert.equal(token.tenantId, 'start');
		assert.equal(JSON.stringify(token), '{"aud":"start","iss":"untouched"}');

		token.tenantId = 'finish';

		var decoded = Factory.create(token.toString());

		assert.equal(decoded.iss, 'untouched');
		assert.equal(decoded.aud, 'finish');
		assert.equal(decoded.tenantId, 'finish');
		assert.equal(JSON.stringify(token), '{"aud":"finish","iss":"untouched"}');
	});

	it('can decode a token it creates', function() {
		var Factory = Token.secret('secret');

		var token = Factory.create({
			foo: 'bar'
		});

		var other = Factory.create(token.toString());

		assert.equal(token.foo, other.foo);
	});

	describe('decoding a token with a different secret', function() {
		var token, Factory;

		before(function() {
			Factory = Token.secret('secret');

			token = Token.create('other', {
				foo: 'bar'
			}).toString();
		});

		it('works with the right secret', function() {
			var decoded = Factory.decode('other', token);

			assert.equal(decoded.foo, 'bar');
		});

		it('fails with the wrong secret', function() {
			var decoded = Factory.decode('wrong', token);

			assert.equal(decoded, null);
		});
	});
});
