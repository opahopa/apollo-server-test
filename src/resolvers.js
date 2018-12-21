module.exports = {
    User: {
        campaigns: async (_, __, { dataSources }) => {
            return await dataSources.userAPI.getCampaignsByUser();
        }
    },
    Campaign: {
        user: async (parent, args, context, info) => parent.getUser(),
    },
    Query: {
        campaigns: async (_, __, { dataSources }) =>
            dataSources.campaignAPI.findAll(),
        campaign: (_, { id }, { dataSources }) =>
            dataSources.campaignAPI.findById(id),

        me: async (_, __, { dataSources }) =>
            dataSources.userAPI.findOrCreateUser(),
    },

    Mutation: {
        login: async (_, { email }, { dataSources }) => {
            const user = await dataSources.userAPI.findOrCreateUser({ email });
            if (user) return new Buffer(email).toString('base64');
        },

        createCampaign: async (_, {name, description, target}, { dataSources }) => {
            const result = await dataSources.campaignAPI.createCampaign({ name, description, target });
            return {
                success: !result ? false : true,
                message: 'created',
                campaign: result
            };
        },
        updateCampaign: async (_, { id, name, description, target }, { dataSources }) => {
            const result = await dataSources.campaignAPI.updateCampaign({ id, name, description, target });
            return {
                success: result,
                message: 'updated',
                campaign: dataSources.campaignAPI.findById(id)
            };
        },
        deleteCampaign: async (_, { id }, { dataSources }) => {
            return await dataSources.campaignAPI.deleteCampaign({ id });
        },
    },
};
