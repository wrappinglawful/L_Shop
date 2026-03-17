import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
import { ProductController } from '../controllers/product.controller';
import { BasketController } from '../controllers/basket.controller';
import { DeliveryController } from '../controllers/delivery.controller';

const router = Router();

// User routes
router.post('/register', UserController.register);
router.post('/login', UserController.login);
router.post('/logout', UserController.logout);
router.get('/me', UserController.getMe);

// Product routes
router.get('/products', ProductController.getAll);
router.get('/products/:id', ProductController.getById);

// Basket routes
router.get('/basket', BasketController.getBasket);
router.post('/basket', BasketController.addToBasket);
router.put('/basket', BasketController.updateCount);
router.delete('/basket/:productId', BasketController.removeFromBasket);

// Delivery routes
router.post('/delivery', DeliveryController.createDelivery);
router.get('/delivery', DeliveryController.getDeliveries);

export default router;
