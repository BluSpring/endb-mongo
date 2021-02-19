# `@endb/mongo`

> MongoDB adapter for [Endb](https://github.com/chroventer/endb)

## Installation

```shell
npm install @endb/mongo
```

## Usage

```javascript
const Endb = require('endb');
const endb = new Endb('mongodb://user:pass@localhost:27017/dbname');
```

```javascript
const EndbMongo = require('@endb/mongo');

const store = new EndbMongo({
  uri: 'mongodb://user:pass@localhost:27017/dbname',
  collection: 'cache',
});
const endb = new Endb({ store });
```
