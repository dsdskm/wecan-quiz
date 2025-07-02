import { API_URL, TEST_ID, TEST_PASSWORD } from "./test_constant";

const registerAccount = async (email: string, password: string) => {
  const url = API_URL + '/accounts/register'; // Assuming the API is hosted on the same origin
  const body = JSON.stringify({
    userId: email, // 또는 적절한 userId 값
    username: 'dsdskm', // 또는 적절한 username 값
    email: email,
    password: password,
  })
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });
    console.log(`response`, response)

  } catch (error) {
    console.error('Error calling API:', error);
  }
}

const deleteAccount = async (email: string) => {
  const url = API_URL + `/accounts/${email}`; // Assuming the API is hosted on the same origin
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(`response`, response)

  } catch (error) {
    console.error('Error calling API:', error);
  }
}

export const loginAccount = async (userId: string, password: string) => {
  const url = API_URL + '/accounts/login';
  const body = JSON.stringify({
    userId: userId,
    password: password,
  });
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body,
    });
    const data = await response.json();
    console.log(`response data`, data)
    return data.token
  } catch (error) {
    console.error('Error calling Login API:', error.message);
  }
}
const getAccount = async (token: string, userId: string) => {
  const url = API_URL + `/accounts/${userId}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`

      },
    });
    console.log(`response status`, response.status)
    if (response.status == 200) {
      const data = await response.json();
      console.log(`response data`, data)
    } 

  } catch (error) {
    console.error('Error calling Get All Accounts API:', error);
  }
}

const getAllAccounts = async () => {
  const url = API_URL + '/accounts';
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    console.log(`response data`, data)
  } catch (error) {
    console.error('Error calling Get All Accounts API:', error);
  }
}

export const testLogin = async () => {
  const token = await loginAccount(TEST_ID, TEST_PASSWORD)
  return token
}
// Example usage:
// registerAccount('dsdskm@gmail.com', '123456');
// registerAccount('dsdskm3@gmail.com', '123456');
loginAccount(TEST_ID, TEST_PASSWORD).then((token) => {
  // getAccount(token, TEST_ID);
  getAccount("ABC", TEST_ID);
  // getAllAccounts();
  // logoutAccount('dsdskm@gmail.com")
  // deleteAccount('dsdskm@gmail.com');
  // logoutAccount('dsdskm@gmail.com',"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJkc2Rza21AZ21haWwuY29tIiwiaWF0IjoxNzUxMjY2MjM4LCJleHAiOjE3NTEyNjk4Mzh9.gG3zBtZk5l9Anj_c_gcOmsspcDAolB2jkVDOFwBZ4aQ");
  // getAllAccountsTest();
});

