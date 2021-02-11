const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  /**
   * Retrieve records.
   *
   * @return {Array}
   */

    async find(ctx) {
        let entities;

        const {user} = ctx.state

        if (ctx.query._q) {
            entities = await strapi.services.product.search(ctx.query);
        } else {
            entities = await strapi.plugins['membership-light'].services.product.find(ctx.query);
        }

        if(entities){
            entities.map(entity => {
                if(user && entity.users){
                    const found = entity.users.find((element) => { return element.id === user.id})

                    if(!found) {
                        entity.download = 'Please purchase this product, get in touch with support for help'
                    }
                } else {
                    entity.download = 'Please purchase this product, get in touch with support for help'
                }

                delete entity.users // Do not leak user data
            })
        }

        return entities.map(entity => sanitizeEntity(entity, { model: strapi.plugins['membership-light'].models.product }));
    },
    /**
     * Retrieve a record.
     *
     * @return {Object}
     */

    async findOne(ctx) {
        const { id } = ctx.params;
        const { user } = ctx.state

        const entity = await strapi.plugins['membership-light'].services.product.findOne({ id });

        if(entity) {
            if(user && entity.users){
                const found = entity.users.find((element) => { return element.id === user.id})
    
                if(!found) {
                    entity.download = 'Please purchase this product, get in touch with support for help'
                }
            } else {
                entity.download = 'Please purchase this product, get in touch with support for help'
            }
            delete entity.users // Do not leak user data
        }
        
        return sanitizeEntity(entity, { model: strapi.plugins['membership-light'].models.product });
    },
    /**
     * Count records.
     *
     * @return {Number}
     */

    count(ctx) {
        if (ctx.query._q) {
            return strapi.plugins['membership-light'].services.product.countSearch(ctx.query);
        }
        return strapi.plugins['membership-light'].services.product.count(ctx.query);
    },
    /**
     * Create a record.
     *
     * @return {Object}
     */

    async create(ctx) {
        const entity = await strapi.plugins['membership-light'].services.product.create(ctx.request.body);

        return sanitizeEntity(entity, { model: strapi.plugins['membership-light'].models.product });
    },
    /**
     * Update a record.
     *
     * @return {Object}
     */

    async update(ctx) {
        const { id } = ctx.params;

        const entity = await strapi.plugins['membership-light'].services.product.update({ id }, ctx.request.body);

        return sanitizeEntity(entity, { model: strapi.plugins['membership-light'].models.product });
    },
    /**
     * Delete a record.
     *
     * @return {Object}
     */
    async delete(ctx) {
        const { id } = ctx.params;
    
        const entity = await strapi.plugins['membership-light'].services.product.delete({ id });
        return sanitizeEntity(entity, { model: strapi.plugins['membership-light'].models.product });
    }

};