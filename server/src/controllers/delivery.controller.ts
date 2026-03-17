import { Request, Response } from 'express';
import { FileService } from '../services/file.service';
import { Delivery, Basket } from '../constants/types';
import { v4 as uuidv4 } from 'uuid';

export class DeliveryController {
  static async createDelivery(req: Request, res: Response) {
    const userId = req.cookies.userId;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const { address, phone, email, paymentMethod } = req.body;
    const baskets = await FileService.read<Basket>('baskets.json');
    const basketIndex = baskets.findIndex(b => b.userId === userId);
    const basket = baskets[basketIndex];

    if (!basket || basket.basket.length === 0) {
      return res.status(400).json({ message: 'Basket is empty' });
    }

    const deliveries = await FileService.read<Delivery>('deliveries.json');
    const newDelivery: Delivery = {
      id: uuidv4(),
      userId,
      address,
      phone,
      email,
      paymentMethod,
      items: [...basket.basket],
      status: 'pending',
    };

    deliveries.push(newDelivery);
    await FileService.write('deliveries.json', deliveries);

    // Clear basket after successful delivery
    baskets[basketIndex]!.basket = [];
    await FileService.write('baskets.json', baskets);

    res.status(201).json(newDelivery);
  }

  static async getDeliveries(req: Request, res: Response) {
    const userId = req.cookies.userId;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const deliveries = await FileService.read<Delivery>('deliveries.json');
    const userDeliveries = deliveries.filter(d => d.userId === userId);
    res.json(userDeliveries);
  }
}
