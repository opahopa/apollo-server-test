const { DataSource } = require('apollo-datasource');

class CampaignAPI extends DataSource {
    constructor({ store }) {
        super();
        this.store = store;
    }

    initialize(config) {
        this.context = config.context;
    }

    async createCampaign({ name, description, target }) {
        const userId = this.context.user.id;
        const res = await this.store.campaign.create({
            name: name,
            description: description,
            target: target,
            userId: userId
        });
        return res.get(0) && res.get(0).userId ===  userId? res.get(0) : false;
    }

    async updateCampaign({ id, name, description, target }) {
        const res = await this.store.campaign.update({
                name: name,
                description: description,
                target: target,
            },
            {
                where: {
                    id: id
                }
            });
        return res[0] > 0;
    }

    async deleteCampaign({id}) {
        const res = await this.store.campaign.destroy({
            where: {
                id: id
            }
        });
        return res > 0;
    }

    async findAll() {
        return await this.store.campaign.findAll();
    }
    async findById(id) {
        return await this.store.campaign.findByPk(id);
    }
}

module.exports = CampaignAPI;
