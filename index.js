var jwt = require('jwt-simple'),
	crypto = require('crypto'),
	objectAssign = require('object-assign');

function createToken(algorithm, secret, claims) {
	if (secret === undefined) {
		throw new Error('a secret is required to create a token');
	}

	algorithm = algorithm || 'HS256';

	var proto = {
		toString: function() {
			return jwt.encode(this, secret, algorithm);
		},
		toAuthorizationHeader: function() {
			return 'JWT ' + this.toString();
		},
		toXsrfToken: function() {
			return crypto
				.createHmac('sha1', secret)
				.update(this.toString())
				.digest('base64');
		}
	};

	var token = Object.create(proto, {
		alg: {
			get: function() {
				return algorithm;
			},
			enumerable: false
		}
	});

	objectAssign(token, claims);

	return token;
}

function Token(config) {
	config = config || {};

	if (this instanceof Token) {
		var args = [].slice.call(arguments, 1);

		var claims = args.pop() || {};
		var secret = args.pop() || config.secret;
		var algorithm = args.pop() || config.algorithm;

		if (typeof claims === 'string') {
			try {
				claims = jwt.decode(claims, secret, false, algorithm);
			} catch (error) {
				claims = {};
			}
		}

		return createToken(algorithm, secret, claims);
	} else {
		var builder = Token.bind(Token, config);

		builder.alg = function(algorithm) {
			config = objectAssign({}, config, {algorithm: algorithm});
			return Token(config);
		};

		builder.secret = function(secret) {
			config = objectAssign({}, config, {secret: secret});
			return Token(config);
		};

		builder.create = function() {
			var Factory = Token.bind.apply(Token, [Token, config].concat([].slice.call(arguments)));
			return new Factory();
		};

		return builder;
	}
}

module.exports = Token();
