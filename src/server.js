require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ApolloServer } = require('apollo-server-express');
const { createServer } = require('http');
const { execute, subscribe } = require('graphql');
const { PubSub } = require('graphql-subscriptions');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const schema = require('./graphql/index');

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));


const pubsub = new PubSub();
const server = new ApolloServer({
  schema, context: (context) => {
    return {
      ...context,
      pubsub
    }
  },
  playground: true
});

const httpServer = createServer(app);

server.applyMiddleware({ app });

server.installSubscriptionHandlers(httpServer);


const port = process.env.PORT || 4000;

httpServer.listen(port, () => {
  console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`,);
  console.log(`🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`,);
});

/*

app.listen(, function () {

});
*/
