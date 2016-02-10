var graphql = require('graphql');
var mongoose = require('mongoose');
//var employeeDetails = require('./employeeDetails');
// var EMPLOYEEEDEATILs = [
//   {
//     "id": 1,
//     "firstname": "dilip",
//     "lastname": "g",
//     "designation": "Software Engineer",
//     "active": false
//   },
//   {
//     "id": "kfgkfkfh",
//     "firstname": "ramesh",
//     "lastname": "k",
//     "designation": 6,
//     "active": 1
//   }
// ];
// Mongoose Schema definition
var EMPLOYEEEDEATIL = mongoose.model('employees', {
  id: String,
  firstname: String,
  lastname: String,
  designation: String,
  active: Boolean
});

var COMPOSE_URI_DEFAULT = 'mongodb://localhost:27017/documents';
mongoose.connect(process.env.COMPOSE_URI || COMPOSE_URI_DEFAULT, function (error) {
  if (error) console.error(error)
  else console.log('mongo connected')
});

// entity for json data and defining type
var EmployeeDetailType = new graphql.GraphQLObjectType({
  name: 'employeedetail',
  description: 'This Schema related to employee details table',
  fields: function(){
    return {
      id: {

        type: graphql.GraphQLInt
      //  type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
      },
      firstname: {
        type: graphql.GraphQLString
      },
      lastname: {
        type: graphql.GraphQLString
      },
      designation: {
        type: graphql.GraphQLString
      },
      active: {
        type: graphql.GraphQLBoolean
      },
      fullname: {
      type: graphql.GraphQLString,
      resolve(obj) {
        return obj.firstname + ' ' + obj.lastname
      }
    }
    }
  }
});


var promiseListAll = () => {
  return new Promise((resolve, reject) => {
    EMPLOYEEEDEATIL.find((err, employees) => {
      if (err) reject(err)
      else resolve(employees)
    })
  })
};

// query for data and schema
// employeedetails  we will define in query
var queryType = new graphql.GraphQLObjectType({
  name:'schema',
  description:'Database Schema and tables',
  fields: function() {
    return {
      employeedetails: {
        type: new graphql.GraphQLList(EmployeeDetailType),
        resolve: function () {
          //return new Promise(function (reslove, reject) {
          //  setTimeout(function () {
            //  reslove(EMPLOYEEEDEATILs)
        //    }, 4000)
        //  });
        return promiseListAll();
        }
      }
    }
  }
});

var MutationAdd = {
  type: EmployeeDetailType,
  description: 'Add a Employee Details',
  args: {
    id: {
      name: 'employee id',
      type: new graphql.GraphQLNonNull(graphql.GraphQLInt)
    },
    firstname: {
      name: 'employee firstname',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    lastname: {
      name: 'employee lastname',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    designation: {
      name: 'employee designation',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    },
    active: {
      name: 'employee active or not by passing 0 or 1',
      type: new graphql.GraphQLNonNull(graphql.GraphQLString)
    }
  },
  resolve: (root, args) => {
    var newEmployee = new EMPLOYEEEDEATIL({
      id: args.id,
      firstname: args.firstname,
      lastname: args.lastname,
      designation: args.designation,
      active: args.active
    })
    newEmployee.id = newEmployee._id
    return new Promise((resolve, reject) => {
      newEmployee.save(function (err) {
        if (err) reject(err)
        else resolve(newEmployee)
      })
    })
  }
}

var mutationType = new graphql.GraphQLObjectType({
  name: 'Mutation',
  fields: {
    add: MutationAdd
  }
});

//  module exports
module.exports = new graphql.GraphQLSchema({
  query: queryType,
  mutation: mutationType
});
