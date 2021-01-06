# Strapi plugin strapi-plugin-membership-light

Use this plugin to integrate a membership system on your products into your ecommerce website
## Installation
``` 
npm i strapi-plugin-membership-light
```
## Unlock a product after payment 
```javascript
await strapi.plugins['strapi-plugin-membership-light'].services.product.unlockProduct(user, productId)
```
## Functions
### unlockProduct
After verifying the payment you can call this function to unlock the product for the user.
| Parameter | Description           |
|-----------|-----------------------|
| number    | Id for the user       |
| number    | Id for the product    |