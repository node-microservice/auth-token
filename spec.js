var assert = require('assert'),
	Token = require('./');

describe('Token', function() {
	var token;

	describe('new with (alg, sec, claims)', function() {
		before(function() {
			token = new Token('HS512', 'secret', {foo: 'bar'});
		});

		it('has the right alg', function() {
			assert.equal(token.alg, 'HS512');
		});

		it('has the right claims', function() {
			assert.equal(token.foo, 'bar');
		});

		it('can be decoded with correct secret and alg', function() {
			var decoded = new Token('HS512', 'secret', token.toString());
			assert.equal(decoded.foo, token.foo);
		});

		it('fails to be decoded with wrong alg', function() {
			var decoded = new Token('HS256', 'secret', token.toString());
			assert.equal(decoded.foo, undefined);
		});

		it('fails to be decoded with wrong secret', function() {
			var decoded = new Token('HS512', 'wrong_secret', token.toString());
			assert.equal(decoded.foo, undefined);
		});
	});

	describe('new with (sec, claims)', function() {
		before(function() {
			token = new Token('secret', {foo: 'bar'});
		});

		it('has the right alg', function() {
			assert.equal(token.alg, 'HS256');
		});

		it('has the right claims', function() {
			assert.equal(token.foo, 'bar');
		});
	});

	describe('create with (alg, sec, claims)', function() {
		before(function() {
			token = Token.create('HS512', 'secret', {foo: 'bar'});
		});

		it('has the right alg', function() {
			assert.equal(token.alg, 'HS512');
		});

		it('has the right claims', function() {
			assert.equal(token.foo, 'bar');
		});
	});

	describe('create with (sec, claims)', function() {
		before(function() {
			token = Token.create('HS512', 'secret', {foo: 'bar'});
		});

		it('has the right alg', function() {
			assert.equal(token.alg, 'HS512');
		});

		it('has the right claims', function() {
			assert.equal(token.foo, 'bar');
		});
	});

	describe('preconfigured with secret', function() {
		var TokenWithSecret = Token.secret('secret');

		describe('new', function() {
			before(function() {
				token = new TokenWithSecret({foo: 'bar'});
			});

			it('has the right claims', function() {
				assert.equal(token.foo, 'bar');
			});
		});
	});
});
