import { Account } from '../types/Account';
import Logger from '../utils/Logger';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { getUserByIdFromDb, registerUserInDb } from '@/firebaseApi';

const accountService = {
    async registerUser(userData: Partial<Account>): Promise<Account> {
        if (userData.password) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
        }

        const newAccount = await registerUserInDb(userData);
        return newAccount;
    },

    async getUserByUserId(userId: string): Promise<Account | null> {
        return await getUserByIdFromDb(userId);
    },

    async loginUser(userId: string, password: string): Promise<{ user: Account, token: string } | null> {
        try {
            const user = await getUserByIdFromDb(userId);

            if (!user) {
                Logger.warn(`Login failed: User not found with ID ${userId}`);
                return null;
            }

            if (!user.password) {
                Logger.error(`Login failed for user ${userId}: Password not stored or retrieved.`);
                return null;
            }

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) {
                Logger.warn(`Login failed: Invalid password for user ID ${userId}`);
                return null;
            }

            const payload = { userId: user.userId };

            const token = jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '1h' });

            const userWithoutPassword: Account = { ...user };
            delete userWithoutPassword.password;

            return { user: userWithoutPassword, token };

        } catch (error) {
            Logger.error(`Error during login for user ${userId}:`, error);
            throw new Error('Failed to log in');
        }
    },
};

export default accountService;
