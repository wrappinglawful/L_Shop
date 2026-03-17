import { Request, Response } from 'express';
import { FileService } from '../services/file.service';
import { User } from '../constants/types';
import { v4 as uuidv4 } from 'uuid';

export class UserController {
  static async register(req: Request, res: Response) {
    const { name, password, email, phone } = req.body;
    if (!name || !password) {
      return res.status(400).json({ message: 'Name and password are required' });
    }

    const users = await FileService.read<User>('users.json');
    if (users.find(u => u.name === name || (email && u.email === email))) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const newUser: User = { id: uuidv4(), name, password, email, phone };
    users.push(newUser);
    await FileService.write('users.json', users);

    res.cookie('userId', newUser.id, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000, // 10 minutes
    });

    res.status(201).json({ id: newUser.id, name: newUser.name });
  }

  static async login(req: Request, res: Response) {
    const { name, password } = req.body;
    const users = await FileService.read<User>('users.json');
    const user = users.find(u => u.name === name && u.password === password);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.cookie('userId', user.id, {
      httpOnly: true,
      maxAge: 10 * 60 * 1000,
    });

    res.json({ id: user.id, name: user.name });
  }

  static async logout(req: Request, res: Response) {
    res.clearCookie('userId');
    res.json({ message: 'Logged out' });
  }

  static async getMe(req: Request, res: Response) {
    const userId = req.cookies.userId;
    if (!userId) return res.status(401).json({ message: 'Not authorized' });

    const users = await FileService.read<User>('users.json');
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json({ id: user.id, name: user.name, email: user.email, phone: user.phone });
  }
}
