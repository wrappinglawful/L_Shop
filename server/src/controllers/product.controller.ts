import { Request, Response } from 'express';
import { FileService } from '../services/file.service';
import { Product } from '../constants/types';

export class ProductController {
  static async getAll(req: Request, res: Response) {
    let products = await FileService.read<Product>('products.json');
    const { search, category, minPrice, maxPrice, sortBy, order, available } = req.query;

    if (search) {
      const s = String(search).toLowerCase();
      products = products.filter(p => 
        p.title.toLowerCase().includes(s) || 
        p.description.toLowerCase().includes(s)
      );
    }

    if (category) {
      products = products.filter(p => p.categories.includes(String(category)));
    }

    if (minPrice) {
      products = products.filter(p => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      products = products.filter(p => p.price <= Number(maxPrice));
    }

    if (available === 'true') {
      products = products.filter(p => p.isAvailable);
    }

    if (sortBy) {
      products.sort((a, b) => {
        const valA = a[sortBy as keyof Product];
        const valB = b[sortBy as keyof Product];
        if (typeof valA === 'number' && typeof valB === 'number') {
          return order === 'desc' ? valB - valA : valA - valB;
        }
        return 0;
      });
    }

    res.json(products);
  }

  static async getById(req: Request, res: Response) {
    const products = await FileService.read<Product>('products.json');
    const product = products.find(p => p.id === req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  }
}
