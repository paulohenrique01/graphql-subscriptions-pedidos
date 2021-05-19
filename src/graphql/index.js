const { gql } = require('apollo-server-express');
const GraphQLJSON = require('graphql-type-json');
const { makeExecutableSchema } = require('graphql-tools');
const { pedido, pedidoResolver } = require('./schemas/pedido');

//Generic
const typeDef = gql`
scalar Date   
scalar JSON

type Query{
    _empty: String
}
type Mutation {
    _empty: String
}

`;

const typeDefs = [typeDef, pedido];

const resolveFunctions = {
    JSON: GraphQLJSON
};

const schema = makeExecutableSchema({
    typeDefs,
    resolvers: [resolveFunctions, pedidoResolver]
})

module.exports = schema;