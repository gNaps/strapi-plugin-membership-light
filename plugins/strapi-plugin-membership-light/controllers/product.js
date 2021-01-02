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
            entities = await strapi.plugins['strapi-plugin-membership-light'].services.product.find(ctx.query);
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
            })
        }

        return entities.map(entity => sanitizeEntity(entity, { model: strapi.plugins['strapi-plugin-membership-light'].models.product }));
    },
    /**
     * Retrieve a record.
     *
     * @return {Object}
     */

    async findOne(ctx) {
        const { id } = ctx.params;
        const { user } = ctx.state

        const entity = await strapi.plugins['strapi-plugin-membership-light'].services.product.findOne({ id });

        if(entity) {
            if(user && entity.users){
                const found = entity.users.find((element) => { return element.id === user.id})
    
                if(!found) {
                    entity.download = 'Please purchase this product, get in touch with support for help'
                }
            } else {
                entity.download = 'Please purchase this product, get in touch with support for help'
            }
        }
        
        return sanitizeEntity(entity, { model: strapi.plugins['strapi-plugin-membership-light'].models.product });
    },
    /**
     * Count records.
     *
     * @return {Number}
     */

    count(ctx) {
        if (ctx.query._q) {
            return strapi.plugins['strapi-plugin-membership-light'].services.product.countSearch(ctx.query);
        }
        return strapi.plugins['strapi-plugin-membership-light'].services.product.count(ctx.query);
    },
    /**
     * Create a record.
     *
     * @return {Object}
     */

    async create(ctx) {
        let entity;
        entity = await strapi.plugins['strapi-plugin-membership-light'].services.product.create(ctx.request.body);

        return sanitizeEntity(entity, { model: strapi.plugins['strapi-plugin-membership-light'].models.product });
    },
    /**
     * Update a record.
     *
     * @return {Object}
     */

    async update(ctx) {
        const { id } = ctx.params;

        let entity;
        entity = await strapi.plugins['strapi-plugin-membership-light'].services.product.update({ id }, ctx.request.body);

        return sanitizeEntity(entity, { model: strapi.plugins['strapi-plugin-membership-light'].models.product });
    },
    /**
     * Delete a record.
     *
     * @return {Object}
     */
    async delete(ctx) {
        const { id } = ctx.params;
    
        const entity = await strapi.plugins['strapi-plugin-membership-light'].services.product.delete({ id });
        return sanitizeEntity(entity, { model: strapi.plugins['strapi-plugin-membership-light'].models.product });
    },
    /**
     * Links a product to a user.
     *
     * @return {Object}
     */
    async unlockProduct(ctx) {
        const user = ctx.state.user.id
        const productId = ctx.params.id
        console.log('user', user)
        console.log('productId', productId)

        const products = await strapi.query('product', 'strapi-plugin-membership-light').find({users_contains: user});
        const found = products.find((product) => { return product.id == productId})

        if(found) {
            ctx.throw(400, 'The product is already linked to this user');
        }

        console.log(products)

        let entity;
        entity = await strapi.plugins['strapi-plugin-membership-light'].services.product.unlockProduct(user, productId, products);

        //console.log('entity', entity)

        return sanitizeEntity(entity, { model: strapi.plugins['users-permissions'].models.user });
    }

};