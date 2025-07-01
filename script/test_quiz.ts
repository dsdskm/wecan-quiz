import { Quiz } from "../src/types/Quiz";

const API_URL = "http://localhost:3000"
async function loginAccount(userId, password) {
    const url = API_URL + '/accounts/login';
    const body = JSON.stringify({
        userId: userId,
        password: password,
    });
    console.log('loginAccount body', body);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body,
        });
        console.log(`response`, response.status)
        const data = await response.json();
        console.log('API Response:', data);
        return data
    } catch (error) {
        console.error('Error calling Login API:', error.message);
    }
}

async function addShow(token: string,showId:string, data: Quiz) {

}

async function getQuizzes(token: string,showId:string): Promise<Quiz[] | undefined> {
}

async function updateQuiz(token: string, showId:string,id: string, updateData: Partial<Quiz>): Promise<Quiz | undefined> {
}

async function deleteQuizzes(token: string, showId:string,id: string[]): Promise<boolean> {

}

async function testImageUpload(token: string, showId: string,id:string) {
}
async function testImageModify(token: string, showId: string,id:string) {
}
async function testImageDelete(token: string, showId: string,id:string) {
}
async function testVideoUpload(token: string, showId: string,id:string) {
}
async function testVideoModify(token: string, showId: string,id:string) {
}
async function testVideoDelete(token: string, showId: string,id:string) {
}

loginAccount("dsdskm@gmail.com", "123456").then(async (res) => {
    const token = res.token
    if (token) {

    }
})