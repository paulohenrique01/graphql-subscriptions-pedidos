
const { gql, withFilter } = require('apollo-server-express');

let pedidos = [
    { id: 1, numero: '590', clienteId: 1 },
    { id: 2, numero: '610', clienteId: 1 },
    { id: 3, numero: '722', clienteId: 2 }
];

const pedido = gql`
type Pedido {
    id: ID
    numero: String!
    clienteId: Int!  
}

input SolicitarPedidoInput {  
    empresa: String!
    clienteId: Int!             
}

extend type Query {    
    getPedidos: [Pedido!]! 
}

extend type Mutation {
    solicitarUltimoPedido(input: SolicitarPedidoInput!):Boolean!
    enviarUltimoPedido(jsonPedido: JSON!): Boolean! 
}

type Subscription {
    pedidoRecebido(empresa: String!): JSON
    solicitacoesPedido(empresa: String!): JSON
}

`;

const pedidoResolver = {
    Query: {
        async getPedidos(root, args, { }) {
            return pedidos;
        },
    },
    Mutation: {
        async solicitarUltimoPedido(root, { input }, { pubsub }) {
            try {            

                console.log(input)
                pubsub.publish('solicitacoesPedido', { solicitacoesPedido: input });


            } catch (error) {
                console.log(error);
                return false;
            }

            return true;
        },
        async enviarUltimoPedido(root, { jsonPedido }, { pubsub }) {
            try {
                console.log(jsonPedido)
                pubsub.publish('pedidoRecebido', { pedidoRecebido: jsonPedido });
            } catch (error) {
                console.log(error);
                return false;
            }

            return true;
        }
    },

    Subscription: {
        pedidoRecebido: {
            subscribe: withFilter(
                (root, { empresa }, { pubsub }) => pubsub.asyncIterator('pedidoRecebido'),
                (payload, variables) => {
                    return (payload.pedidoRecebido.empresa === variables.empresa);
                },
            ),
        },
        solicitacoesPedido: {
            subscribe: withFilter(
                (root, { empresa }, { pubsub }) => pubsub.asyncIterator('solicitacoesPedido'),
                (payload, variables) => {
                    return (payload.solicitacoesPedido.empresa === variables.empresa);
                },
            ),
        },
    },

};


module.exports = { pedido, pedidoResolver };
