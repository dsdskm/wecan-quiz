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
const storage_1 = require("../utils/storage");
const firebaseApi_1 = require("@/firebaseApi");
const Logger_1 = __importDefault(require("@/utils/Logger"));
const showService = {
    createShow(showData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newShow = yield (0, firebaseApi_1.createShowInDb)(showData);
                return newShow;
            }
            catch (error) {
                Logger_1.default.error(error);
                throw error;
            }
        });
    },
    getShowById(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, firebaseApi_1.getShowFromDb)(showId);
            }
            catch (error) {
                Logger_1.default.error(error);
                throw error;
            }
        });
    },
    getAllShows() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield (0, firebaseApi_1.getAllShowsFromDb)();
            }
            catch (error) {
                Logger_1.default.error(error);
                throw error;
            }
        });
    },
    updateShow(showId, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedShow = yield (0, firebaseApi_1.updateShowInDb)(showId, updateData);
                if (!updatedShow) {
                    return null;
                }
                return updatedShow;
            }
            catch (error) {
                Logger_1.default.error(error);
                throw error;
            }
        });
    },
    deleteShow(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const showToDelete = yield (0, firebaseApi_1.getShowFromDb)(showId);
                if (showToDelete && showToDelete.backgroundImageUrl) {
                    yield (0, storage_1.deleteFileByUrl)(showToDelete.backgroundImageUrl);
                }
                return yield (0, firebaseApi_1.deleteShowFromDb)(showId);
            }
            catch (error) {
                Logger_1.default.error(error);
                throw error;
            }
        });
    },
    updateShowStatus(showId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateData = { status };
            const updatedShow = yield (0, firebaseApi_1.updateShowInDb)(showId, updateData);
            return updatedShow !== null;
        });
    },
    updateShowBackgroundImageUrl(showId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingShow = yield (0, firebaseApi_1.getShowFromDb)(showId);
                if (!existingShow) {
                    return null;
                }
                if (existingShow.backgroundImageUrl) {
                    yield (0, storage_1.deleteFileByUrl)(existingShow.backgroundImageUrl);
                }
                const destinationPathWithFileName = (0, storage_1.generateShowBackgroundImagePath)(showId, file.originalname);
                const contentType = file.mimetype;
                const newImageUrl = yield (0, storage_1.uploadFile)(file.buffer, destinationPathWithFileName, contentType);
                const updateData = { backgroundImageUrl: newImageUrl };
                const updatedShow = yield (0, firebaseApi_1.updateShowInDb)(showId, updateData);
                if (!updatedShow) {
                    yield (0, storage_1.deleteFileByUrl)(newImageUrl);
                    return null;
                }
                return updatedShow;
            }
            catch (error) {
                Logger_1.default.error(error);
                throw error;
            }
        });
    },
    deleteShowBackgroundImage(showId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const showToDelete = yield (0, firebaseApi_1.getShowFromDb)(showId);
                if (!showToDelete) {
                    return true;
                }
                if (showToDelete.backgroundImageUrl) {
                    yield (0, storage_1.deleteFileByUrl)(showToDelete.backgroundImageUrl);
                }
                yield (0, firebaseApi_1.updateShowInDb)(showId, { backgroundImageUrl: "" });
                Logger_1.default.info(`Successfully cleared backgroundImageUrl for show ${showId}`);
                return true;
            }
            catch (error) {
                Logger_1.default.error(`Failed to delete background image or update show data for show ${showId}:`, error);
                throw error;
            }
        });
    },
};
exports.default = showService;
//# sourceMappingURL=showService.js.map