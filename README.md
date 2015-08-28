# auth-token

Library for creating and decoding JWT-base auth tokens.

## Install

	$ npm install --save @microservice/auth-token

## Usage

```javascript
var Token = require('@microservice/auth-token');

var token = new Token('some_secret', { my: 'claims' });

console.log(token.my); // 'claims'
console.log(token.toString()); // signed value
console.log(token.toAuthorizationHeader()) // JWT {{toString}}
console.log(token.toXsrfToken());
```

use a custom algorithm:

`token = new Token('HS512', 'some_secret', { my: 'claims' });`

preconfigure the constructor:

```javascript
var Token = require('@microservice/auth-token')
	.secret('some_secret')
	.alg('HS512');

var token = new Token({ my: 'claims' });
var decoded = new Token(token.toString());
```
