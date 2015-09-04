# auth-token

Library for creating and encoding/decoding JWT-base auth tokens.

## Install

	$ npm install --save @microservice/auth-token

## Usage

As a factory that uses a builder style pattern to configure things:

```javascript
var Token = require('@microservice/auth-token').alg('HS512').secret('foo');
var token = Token.create();
```

This returns a plain old object that you attach the JWT claims to:

```javascript
token.foo = 'blah';

console.log(token.foo); // 'blah'
console.log(token.alg); // 'HS512'
console.log(JSON.stringify(token)); // {"foo":blah"}
console.log(token.toString()); // the token as a signed string
console.log(token.toAuthorizationHeader()) // "JWT " + toString()
console.log(token.toXsrfToken()); // etc.
```

One advantage to this is if your tokens fall in to logs somewhere, the secret is nowhere to be seen.

You can specify claims as part of `create`:

```javascript
token = Token.create({
	another: 'claim'
});

console.log(token.another); // 'claim'
```

... and decode an existing token:

```javascript
// this works because token is just an object anyway
token = Token.create(token);

// this decodes the token, or returns null if that failed
token = Token.create(token.toString());
```

You can specify the secret, and algorithm during `create`, too:

```javascript
var Factory = Token.alg('HS512').secret('secret');

// use the preconfigured secret and algorithm
one = Factory.create(incoming);

// use a different secret, but the same algorithm
two = Factory.create('other_secret', other_token);

// use a different algorithm and secret
three = Factory.create('HS256', 'other_secret', other_token);
```

You can also `decode` a token, which works like `create`:

```javascript
var A = Token.secret('secret');
var B = Token.secret('different_secret');

// create a token using 'secret'
var a = A.create({ foo: 'bar' });

// encode the token
var encoded = a.toString();

// decode the token using 'secret' and copy the claims in to a new token
// that uses 'different_secret' as configured in the factory
var b = B.decode('secret', encoded);
```

### Properties

You can configure the token factory with property aliases to give more meaningful names to things that might be terse in the token itself:

```javascript
Token = Token.secret('foo').properties({ 'tenantId': 'aud' });
token = Factory.create();

token.tenantId = 'blah';

console.log(token.tenantId); // 'blah'
console.log(token.aud); // 'blah'
console.log(JSON.stringify(token)); // {"aud":"blah"}
```
