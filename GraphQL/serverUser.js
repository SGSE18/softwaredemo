var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
const fs = require('fs');

// GraphQL schema
var schema = buildSchema(`
    type Query {
        user(name: String): User
        users(name: String): [User]
    },
    type User {
        name: String!
    }
`);


var userData = JSON.parse(fs.readFileSync('users.json'));

var getUser = function(args) {
    var name = args.name;
    return userData.filter(user => {
        return user["users"].name == name;
    })[0];
}

var getUsers = function(args) {
    return userData;
}

var root = {
    user: getUser,
    users : getUsers
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));
