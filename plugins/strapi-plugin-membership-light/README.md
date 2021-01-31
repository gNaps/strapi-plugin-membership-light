# Strapi plugin strapi-plugin-membership-light

Use this plugin to integrate a membership system on your products into your ecommerce website
## Installation
``` 
npm i strapi-plugin-membership-light
```

Once installed you have to update content-type Users by adding a relationship many-to-many with the model products of the plugin.

## Retrieve the products for a user
| Method    | Url                                       | Description                                                                                |
|-----------|-------------------------------------------|--------------------------------------------------------------------------------------------|
| GET       | /membership-light/products  | Returns the list of products, if the product has not been bought the link will be censured |

## Unlock a product after payment 
```javascript
await strapi.plugins['membership-light'].services.product.unlockProduct(user, productId)
```
## Functions
### unlockProduct
After verifying the payment you can call this function to unlock the product for the user.
| Parameter | Description           |
|-----------|-----------------------|
| number    | Id for the user       |
| number    | Id for the product    |