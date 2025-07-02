"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = __importDefault(require("../utils/Logger"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const firebaseApi_1 = require("@/firebaseApi");
const accountService = {
    registerUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (userData.password) {
                const salt = yield bcrypt_1.default.genSalt(10);
                userData.password = yield bcrypt_1.default.hash(userData.password, salt);
            }
            const newAccount = yield (0, firebaseApi_1.registerUserInDb)(userData);
            return newAccount;
        });
    },
    getUserByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield (0, firebaseApi_1.getUserByIdFromDb)(userId);
        });
    },
    loginUser(userId, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield (0, firebaseApi_1.getUserByIdFromDb)(userId);
                if (!user) {
                    Logger_1.default.warn(`Login failed: User not found with ID ${userId}`);
                    return null;
                }
                if (!user.password) {
                    Logger_1.default.error(`Login failed for user ${userId}: Password not stored or retrieved.`);
                    return null;
                }
                const passwordMatch = yield bcrypt_1.default.compare(password, user.password);
                if (!passwordMatch) {
                    Logger_1.default.warn(`Login failed: Invalid password for user ID ${userId}`);
                    return null;
                }
                const payload = { userId: user.userId };
                const token = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
                const userWithoutPassword = Object.assign({}, user);
                delete userWithoutPassword.password;
                return { user: userWithoutPassword, token };
            }
            catch (error) {
                Logger_1.default.error(`Error during login for user ${userId}:`, error);
                throw new Error('Failed to log in');
            }
        });
    },
};
exports.default = accountService;
//# sourceMappingURL=accountService.js.map