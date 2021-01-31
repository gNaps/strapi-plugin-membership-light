'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/services.html#core-services)
 * to customize this service
 */

module.exports = {
    /**
     * Promise to fetch all records
     *
     * @return {Promise}
     */
    find(params, populate) {
        return strapi.query('product', 'membership-light').find(params, populate);
    },
    /**
    * Promise to fetch record
    *
    * @return {Promise}
    */

    findOne(params, populate) {
        return strapi.query('product', 'membership-light').findOne(params, populate);
    },

    /**
     * Promise to count record
     *
     * @return {Promise}
     */

    count(params) {
        return strapi.query('product', 'membership-light').count(params);
    },

    /**
     * Promise to add record
     *
     * @return {Promise}
     */

    async create(data, { files } = {}) {
        const validData = await strapi.entityValidator.validateEntity(strapi.models.product, data);
        const entry = await strapi.query('product', 'membership-light').create(validData);

        if (files) {
        // automatically uploads the files based on the entry and the model
        await strapi.entityService.uploadFiles(entry, files, {
            model: 'product',
            // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
        });
        return this.findOne({ id: entry.id });
        }

        return entry;
    },

    /**
     * Promise to edit record
     *
     * @return {Promise}
     */

    async update(params, data, { files } = {}) {
        const validData = await strapi.entityValidator.validateEntityUpdate(
        strapi.models.product,
        data
        );
        const entry = await strapi.query('product', 'membership-light').update(params, validData);

        if (files) {
        // automatically uploads the files based on the entry and the model
        await strapi.entityService.uploadFiles(entry, files, {
            model: 'product',
            // if you are using a plugin's model you will have to add the `source` key (source: 'users-permissions')
        });
        return this.findOne({ id: entry.id });
        }

        return entry;
    },

    /**
     * Promise to delete a record
     *
     * @return {Promise}
     */

    delete(params) {
        return strapi.query('product', 'membership-light').delete(params);
    },
    /**
     * Links a product to a user.
     *
     * @return {Object}
     */
    async unlockProduct(user, productId) {
        const products = await strapi.plugins['membership-light'].services.product.find({users_contains: user, _limit: -1});
        const found = products.find((product) => { return product.id == productId})

        if(found) {
            return {status: 'Ok'}
        }
        
        await strapi.plugins['users-permissions'].services.user.edit({id: user}, {products: [...products, productId]})
        return {status: 'Ok'}
    }
};