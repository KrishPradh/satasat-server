const express = require('express');
const cartRouter = express.Router();
const { addToCart, getCart, removeFromCart, updateCartQuantity, getCartByUser }= require('../../controller/cartController/cartController');

cartRouter.post('/addtocart', addToCart);
cartRouter.get('/getcart', getCart);
cartRouter.get('/:userId/cart', getCartByUser);
cartRouter.delete('/remove/:bookId', removeFromCart);
cartRouter.patch('/update/:id', updateCartQuantity);

module.exports = cartRouter;
