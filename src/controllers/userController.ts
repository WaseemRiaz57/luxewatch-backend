import { Response } from 'express';
import User from '../models/User';
import { comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { ProtectedRequest } from '../middleware/protect';

export const updateUserProfile = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const { name, email, password, firstName, lastName, oldPassword } = req.body;

    if (typeof name === 'string' && name.trim().length > 0) {
      const trimmedName = name.trim();
      const [first, ...rest] = trimmedName.split(' ');
      user.firstName = first;
      if (rest.length > 0) {
        user.lastName = rest.join(' ');
      }
    }

    if (typeof firstName === 'string' && firstName.trim().length > 0) {
      user.firstName = firstName.trim();
    }

    if (typeof lastName === 'string' && lastName.trim().length > 0) {
      user.lastName = lastName.trim();
    }

    if (typeof email === 'string' && email.trim().length > 0) {
      user.email = email.trim().toLowerCase();
    }

    if (typeof password === 'string' && password.trim().length > 0) {
      if (typeof oldPassword !== 'string' || oldPassword.trim().length === 0) {
        res.status(400).json({ message: 'Old password is required to set a new password' });
        return;
      }

      const isMatch = await comparePassword(oldPassword, user.password);
      if (!isMatch) {
        res.status(401).json({ message: 'Invalid old password' });
        return;
      }

      user.password = password;
    }

    await user.save();

    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.status(200).json({
      message: 'Profile updated successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};

export const getUserProfile = async (req: ProtectedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await User.findById(req.user.userId).select('-password');

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();

    res.status(200).json({
      id: user._id,
      name: fullName,
      email: user.email,
      isAdmin: user.role === 'admin',
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: String(error) });
  }
};
