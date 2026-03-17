import { Request, Response } from 'express';
import { FileService } from '../services/file.service';
import { Basket, Product, BasketProduct } from '../constants/types';

export class BasketController {
  static async getBasket(req: Request, res: Response) {
    const userId = req.cookies.userId;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const baskets = await FileService.read<Basket>('baskets.json');
    let basket = baskets.find(b => b.userId === userId);
    
    if (!basket) {
      basket = { id: userId, userId, basket: [] };
    }
    res.json(basket);
  }

  static async addToBasket(req: Request, res: Response) {
    const userId = req.cookies.userId;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const { productId, count = 1 } = req.body;
    const products = await FileService.read<Product>('products.json');
    const product = products.find(p => p.id === productId);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const baskets = await FileService.read<Basket>('baskets.json');
    let basketIndex = baskets.findIndex(b => b.userId === userId);
    
    if (basketIndex === -1) {
      baskets.push({ id: userId, userId, basket: [{ count, products: product }] });
    } else {
      const itemIndex = baskets[basketIndex]!.basket.findIndex(i => i.products.id === productId);
      if (itemIndex > -1) {
        baskets[basketIndex]!.basket[itemIndex]!.count += count;
      } else {
        baskets[basketIndex]!.basket.push({ count, products: product });
      }
    }

    await FileService.write('baskets.json', baskets);
    res.json(baskets.find(b => b.userId === userId));
  }

  static async updateCount(req: Request, res: Response) {
    const userId = req.cookies.userId;
    const { productId, count } = req.body;
    const baskets = await FileService.read<Basket>('baskets.json');
    const basket = baskets.find(b => b.userId === userId);
    if (!basket) return res.status(404).json({ message: 'Basket not found' });

    const item = basket.basket.find(i => i.products.id === productId);
    if (item) {
      item.count = count;
      if (item.count <= 0) {
        basket.basket = basket.basket.filter(i => i.products.id !== productId);
      }
    }

    await FileService.write('baskets.json', baskets);
    res.json(basket);
  }

  static async removeFromBasket(req: Request, res: Response) {
    const userId = req.cookies.userId;
    const { productId } = req.params;
    const baskets = await FileService.read<Basket>('baskets.json');
    const basket = baskets.find(b => b.userId === userId);
    if (basket) {
      basket.basket = basket.basket.filter(i => i.products.id !== productId);
      await FileService.write('baskets.json', baskets);
    }
    res.json(basket);
  }
}
