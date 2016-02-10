
var graphql = require('graphql').graphql
var express = require('express')
var graphQLHTTP = require('express-graphql')
var Schema = require('./schema')

// var getSchema = require('@risingstack/graffiti-mongoose');
// var Employee = require('./EmployeeSchema');
//
// var options = {
//   mutation: false // mutation fields can be disabled
// };
// var Schema = getSchema([Employee], options);


var query = 'query { employeedetails { id, firstname, lastname, designation, active , fullname } }'

graphql(Schema, query).then( function(result) {
  console.log(JSON.stringify(result, null, " "));
});

var app = express();

app .use('/graphql', graphQLHTTP({
  schema: Schema,
  pretty: true,
  graphiql: true
}));

app.listen(8081, function(result) {
  console.log('GraphQL server is now running on localhost:8081')
});
