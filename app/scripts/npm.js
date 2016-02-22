window.moment = require('moment');
window._ = require('lodash');
window.async = require('async');
window.npm = {
  api: {
    client: require('o-api-client').default
  },
  rdf: {
    serializers: {
      jsonld: require('rdf-serializer-jsonld')
    },
    parsers: {
      jsonld: require('rdf-parser-jsonld')
    }
  }
};
