var jwt = require('jwt-simple'),
	crypto = require('crypto'),
	objectAssign = require('object-assign');

function createToken(algorithm, secret, claims, properties) {
	if (secret === undefined) {
		throw new Error('a secret is required to create a token');
	}

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

	if (properties && typeof properties === 'object') {
		Object.keys(properties).forEach(function(key) {
			var claim = properties[key];

			if (claim === key) {
				return;
			}

			Object.defineProperty(token, key, {
				get: function() {
					return this[claim];
				},
				set: function(value) {
					this[claim] = value;
				}
			});
		});
	}

	if (claims && typeof claims === 'object') {
		objectAssign(token, claims);
	}

	return token;
}

function Token(defaults) {
	return {
		alg: function(algorithm) {
			var config = objectAssign({}, defaults, {algorithm: algorithm});
			return Token(config);
		},
		secret: function(secret) {
			var config = objectAssign({}, defaults, {secret: secret});
			return Token(config);
		},
		properties: function(properties) {
			var config = objectAssign({}, defaults, {properties: properties});
			return Token(config);
		},
		create: function() {
			var args = [].slice.call(arguments);

			var claims = args.pop() || {};
			var config = args.pop() || {};

			if (typeof config === 'string') {
				config = {
					secret: config
				};
			}

			if (args.length > 0) {
				config.algorithm = args.pop();
			}

			var secret = config.secret || defaults.secret;
			var algorithm = config.algorithm || defaults.algorithm;
			var properties = config.properties || defaults.properties;

			if (typeof claims === 'string') {
				try {
					claims = jwt.decode(claims, secret, false, algorithm);
				} catch (e) {
					return null;
				}
			}

			return createToken(algorithm, secret, claims, properties);
		},
		decode: function() {
			var token = this.create.apply(this, arguments);

			return token ? this.create(token) : null;
		}
	};
}

module.exports = Token({
	algorithm: 'HS256'
});
