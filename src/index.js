const fs  = require("fs");
const path  = require("path");
const faker = require('faker');
const times  = require('lodash.times');
const random  = require('lodash.random');
const isEmail = require('isemail');

const { ApolloServer } = require('apollo-server');
const { createStore } = require('./utils');
const resolvers = require('./resolvers');
const UserAPI = require('./datasources/user');
const campaignAPI = require('./datasources/campaign');


const typeDefs = fs.readFileSync(path.join(__dirname, "schema.graphqls"), "utf8");
const store = createStore();

const context = async ({ req }) => {
    // simple auth check on every request
    const auth = (req.headers && req.headers.authorization) || '';
    const email = new Buffer.from(auth, 'base64').toString('ascii');

    // if the email isn't formatted validly, return null for user
    if (!isEmail.validate(email)) return { user: null };
    // find a user by their email
    const users = await store.users.findOrCreate({ where: { email } });
    const user = users && users[0] ? users[0] : null;

    return { user: { ...user.dataValues } };
};

const server = new ApolloServer({
    typeDefs,
    context,
    resolvers,
    dataSources: () => ({
        campaignAPI: new campaignAPI({store}),
        userAPI: new UserAPI({store}),
    }),
    engine: {
        apiKey: process.env.ENGINE_API_KEY
    },

});



// Populate DB and run server
store.db.sync().then(async () => {

    const campaigns = await store.campaign.findAll();
    if (campaigns.length < 10) {
        store.users.bulkCreate(
            times(10, () => ({
                email: faker.internet.email()
            }))
        );

        store.campaign.bulkCreate(
            times(10, () => ({
                name: faker.lorem.sentence(),
                description: faker.lorem.paragraph(),
                target: random(10000, 100000),
                userId: random(1, 10)
            }))
        );
    }
});

const port = process.env.PORT || 4000;
server.listen({ port }).then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});