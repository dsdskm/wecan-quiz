import { Show, ShowStatus } from "../src/types/Show";

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

async function addShow(token: string, data: Show) {
  const url = API_URL + '/shows';
  const body = JSON.stringify(data);
  console.log('addShow body', body);
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: body,
    });
    console.log(`addShow response`, response.status);
    const result = await response.json();
    console.log('addShow API Response:', result);
    return result;
  } catch (error) {
    console.error('Error calling addShow API:', error.message);
  }
}

async function getShows(token: string): Promise<Show[] | undefined> {
  const url = API_URL + '/shows';
  console.log('Fetching shows from:', url);
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const shows: Show[] = await response.json();
    console.log('Fetched Shows:', shows);
    return shows;
  } catch (error) {
    console.error('Error fetching shows:', error.message);
  }
}

async function updateShow(token: string, id: string, updateData: Partial<Show>): Promise<Show | undefined> {
  const url = `${API_URL}/shows/${id}`;
  const body = JSON.stringify(updateData);
  console.log(`Updating show with ID ${id} at:`, url);
  console.log('Update data:', body);
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: body,
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const updatedShow: Show = await response.json();
    console.log(`Updated Show with ID ${id}:`, updatedShow);
    return updatedShow;
  } catch (error) {
    console.error(`Error updating show with ID ${id}:`, error.message);
  }
}

async function deleteShow(token: string, id: string): Promise<boolean> {
  const url = `${API_URL}/shows/${id}`;
  console.log(`Deleting show with ID ${id} from:`, url);
  try {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    console.log(`Delete show response status: ${response.status}`);
    return response.ok;
  } catch (error) {
    console.error(`Error deleting show with ID ${id}:`, error.message);
    return false;
  }
}

async function getShow(token: string, id: string): Promise<Show | undefined> {
  const url = `${API_URL}/shows/${id}`;
  console.log(`Fetching show with ID ${id} from:`, url);
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const show: Show = await response.json();
    console.log(`Fetched Show with ID ${id}:`, show);
    return show;
  } catch (error) {
    console.error(`Error fetching show with ID ${id}:`, error.message);
  }
}

loginAccount("dsdskm@gmail.com", "123456").then(async (res) => {
  const token = res.token

  // Generate random values for the sample show
  const randomString = (length: number) => Math.random().toString(36).substring(2, 2 + length);
  const statuses = Object.values(ShowStatus);
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomId = Math.random().toString(36).substring(2, 15);

  const sampleShow: Show = {
    title: `테스트 쇼 제목 - ${randomString(5)}`,
    details: `이것은 테스트를 위한 샘플 쇼 설명입니다. ${randomString(10)}`,
    backgroundImageUrl: `https://example.com/backgrounds/${randomString(8)}.jpg`,
    quizzes: [],
    status: randomStatus,
    url: `https://example.com/shows/${randomId}`,
    // createdAt and updatedAt will be set by the server
    // id will be set by the server
  };

  if (token) {
    // await addShow(token, sampleShow);
    // await getShows(token)
    // await getShow(token, "1751330904549")
    // await updateShow(token, "1751330904549", { title: "Updated Title" });
    await deleteShow(token, "1751330904549");
  }
})