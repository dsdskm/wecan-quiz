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
Object.defineProperty(exports, "__esModule", { value: true });
const Show_1 = require("../src/types/Show");
const API_URL = "http://localhost:3000";
function loginAccount(userId, password) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = API_URL + '/accounts/login';
        const body = JSON.stringify({
            userId: userId,
            password: password,
        });
        console.log('loginAccount body', body);
        try {
            const response = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body,
            });
            console.log(`response`, response.status);
            const data = yield response.json();
            console.log('API Response:', data);
            return data;
        }
        catch (error) {
            console.error('Error calling Login API:', error.message);
        }
    });
}
function addShow(token, data) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = API_URL + '/shows';
        const body = JSON.stringify(data);
        console.log('addShow body', body);
        try {
            const response = yield fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: body,
            });
            console.log(`addShow response`, response.status);
            const result = yield response.json();
            console.log('addShow API Response:', result);
            return result;
        }
        catch (error) {
            console.error('Error calling addShow API:', error.message);
        }
    });
}
loginAccount("dsdskm@gmail.com", "123456").then((res) => {
    const token = res.token;
    const sampleShow = {
        title: '테스트 쇼 제목',
        details: '이것은 테스트를 위한 샘플 쇼 설명입니다.',
        backgroundImageUrl: 'http://example.com/test-background.jpg',
        quizzes: [],
        status: Show_1.ShowStatus.Waiting, // 초기 상태는 waiting
        url: 'http://example.com/test-show',
    };
    if (token) {
        addShow(token, sampleShow);
    }
});
//# sourceMappingURL=test_show.js.map