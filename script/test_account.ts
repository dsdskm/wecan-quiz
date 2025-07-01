const API_URL = "http://localhost:3000"
const API_KEY = "aabbccdd"

async function base() {
  console.log(`base`)
  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });
    console.log(`response - server status`, response.statusText)
    // const data = await response.json();
    // console.log('API Response:', data);

  } catch (error) {
    console.error('Error calling API:', error);
  }
}

async function registerAccount(email, password) {

  const url = API_URL + '/accounts/register'; // Assuming the API is hosted on the same origin
  const body = JSON.stringify({
    userId: email, // 또는 적절한 userId 값
    username: 'dsdskm', // 또는 적절한 username 값
    email: email,
    password: password,
  })
  console.log(`regisetrAccount body`, body)
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
      body: body,
    });
    console.log(`response`, response.statusText)
    // const data = await response.json();
    // console.log('API Response:', data);

  } catch (error) {
    console.error('Error calling API:', error);
  }
}

async function deleteAccount(email) {

  const url = API_URL + `/accounts/${email}`; // Assuming the API is hosted on the same origin
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });
    console.log(`response`, response.statusText)
    // const data = await response.json();
    // console.log('API Response:', data);

  } catch (error) {
    console.error('Error calling API:', error);
  }
}

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
  } catch (error) {
    console.error('Error calling Login API:', error.message);
  }
}

async function logoutAccount(userId,token) {
  const url = API_URL + '/accounts/logout';
  const body = JSON.stringify({
    userId: userId
  });
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'Authorization': `Bearer ${token}`,
      }, body: body
    });
    console.log(`response`, response.statusText)
    // const data = await response.json();
    // console('Logout API Response:', data);
  } catch (error) {
    console.error('Error calling Logout API:', error);
  }
}

async function getAllAccountsTest() {
  const url = API_URL + '/accounts';
  console.log('getAllAccountsTest');
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
      },
    });
    const data = await response.json();
    console.log('Get All Accounts API Response:', data);
  } catch (error) {
    console.error('Error calling Get All Accounts API:', error);
  }
}
// Example usage:
// base()
// registerAccount('dsdskm@gmail.com', '123456');
// registerAccount('dsdskm3@gmail.com', '123456');
loginAccount('dsdskm@gmail.com', '123456');
// deleteAccount('dsdskm@gmail.com');
// logoutAccount('dsdskm@gmail.com',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkc2Rza21AZ21haWwuY29tIiwiaWF0IjoxNzUxMjY2MjM4LCJleHAiOjE3NTEyNjk4Mzh9.gG3zBtZk5l9Anj_c_gcOmsspcDAolB2jkVDOFwBZ4aQ");
// getAllAccountsTest();