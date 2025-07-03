import { Show, ShowStatus } from "../src/types/Show";
import { testLogin } from "./test_account";
import { API_URL } from "./test_constant";

const addShow = async (token: string, data: Show) => {
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
  } catch (error: any) {
    console.error('Error calling addShow API:', error.message);
  }
}
const getShows = async (token: string): Promise<Show[] | undefined> => {
  const url = API_URL + '/shows';
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

const updateShow = async (token: string, id: string, updateData: Partial<Show>): Promise<Show | undefined> => {
  const url = `${API_URL}/shows/${id}`;
  const body = JSON.stringify(updateData);
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

const deleteShow = async (token: string, id: string): Promise<boolean> => {
  const url = `${API_URL}/shows/${id}`;
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

const getShow = async (token: string, id: string): Promise<Show | undefined> => {
  const url = `${API_URL}/shows/${id}`;
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

const testImageUpload = async (token: string, showId: string) => {
  const url = `${API_URL}/shows/${showId}/background-image`;

  // Create a dummy image buffer for testing
  // This is a very basic placeholder. In a real test, you might read a file.
  const dummyImageData = new Uint8Array([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137,
    0, 0, 0, 11, 73, 68, 64, 84, 24, 87, 99, 248, 15, 4, 0, 9, 243, 3, 253, 167, 50, 197, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
  ]); // A tiny 1x1 transparent PNG
  const dummyFile = new File([dummyImageData], "test_image.png", { type: "image/png" });

  const formData = new FormData();
  formData.append("backgroundImage", dummyFile); // 'backgroundImage' should match the field name in the multer middleware

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // fetch API automatically sets Content-Type for FormData
      },
      body: formData,
    });

    console.log(`Image upload response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    console.log('Image upload API Response:', result);
    return result; // 업로드 후 업데이트된 Show 객체 반환
  } catch (error: any) {
    console.error('Error uploading image:', error.message);
    throw error; // 오류를 다시 던져서 호출하는 곳에서 처리하도록 함
  }
}


const testImageDelete = async (token: string, showId: string) => {
  try {
    // 이미지 삭제 API 엔드포인트 URL
    const deleteUrl = `${API_URL}/shows/${showId}/background-image`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log(`Image deletion response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    console.log('Image deletion API Response:', result);
    // 여기서 응답 결과를 바탕으로 삭제 성공 여부를 판단할 수 있습니다.
    // 예: return result.message === 'Background image deleted and show updated successfully';
    return result; // 삭제 후 업데이트된 Show 객체 또는 성공 메시지 반환

  } catch (error: any) {
    console.error('Error during image deletion test:', error.message);
    throw error; // 오류를 다시 던져서 호출하는 곳에서 처리하도록 함
  }
}


const testImageModify = async (token: string, showId: string) => {
  try {
    // 새로운 더미 이미지 데이터 생성 (다른 파일처럼 보이도록)
    const dummyImageData2 = new Uint8Array([
      137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 2, 0, 0, 0, 149, 68, 231, 60, // A different tiny PNG (color)
      0, 0, 0, 12, 73, 64, 65, 84, 8, 220, 99, 248, 255, 255, 63, 195, 132, 188, 108, 0, 4, 253, 254, 10, 102, 105, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
    ]);
    const dummyFile2 = new File([dummyImageData2], "test_image_modify.png", { type: "image/png" });

    // 이미지 업로드 API 엔드포인트 URL
    const uploadUrl = `${API_URL}/shows/${showId}/background-image`;

    const formData = new FormData();
    formData.append("backgroundImage", dummyFile2); // 'backgroundImage'는 서버에서 기대하는 필드 이름

    console.log("Attempting to upload new image for modification...");
    const uploadResponse = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        // fetch API는 FormData에 대해 Content-Type을 자동으로 multipart/form-data로 설정
      },
      body: formData,
    });

    console.log(`New image upload response status: ${uploadResponse.status}`);

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      throw new Error(`HTTP error! status: ${uploadResponse.status}, body: ${errorText}`);
    }

    const uploadResult = await uploadResponse.json();
    console.log('New image upload API Response:', uploadResult);

    // 이미지 업로드 API는 보통 업데이트된 Show 객체를 반환하므로,
    // 별도의 updateShow 호출 없이도 backgroundImageUrl이 설정됩니다.
    // 만약 업로드 API가 파일 URL만 반환한다면, 여기서 updateShow 호출 필요.
    // 현재 백엔드 구현은 업데이트된 Show를 반환하므로 추가 updateShow 호출은 불필요.

    console.log("Image modification test successful.");
    // Show 정보를 다시 가져와서 backgroundImageUrl이 새 URL인지 확인 (선택 사항)
    const showAfterModify = await getShow(token, showId);
    console.log("Show after image modification:", showAfterModify?.backgroundImageUrl);

    return showAfterModify; // 업데이트된 Show 객체 반환

  } catch (error: any) {
    console.error('Error during image modification test:', error.message);
    throw error; // 오류를 다시 던져서 호출하는 곳에서 처리하도록 함
  }
}





testLogin().then(async (token) => {
  // Generate random values for the sample show
  const randomString = (length: number) => Math.random().toString(36).substring(2, 2 + length);
  const statuses = Object.values(ShowStatus);
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomId = Math.random().toString(36).substring(2, 15);

  const sampleShow: Show = {
    title: `테스트 쇼 제목 - ${randomString(5)}`,
    details: `이것은 테스트를 위한 샘플 쇼 설명입니다. ${randomString(10)}`,
    backgroundImageUrl: ``,
    quizzes: [],
    status: randomStatus,
    url: `https://example.com/shows/${randomId}`,
    createdAt: "",
    startTime: "",
    endTime: "",
    updatedAt: ""
  };

  if (token) {
    const testShowId = "BZa1wph9Usn1TYWLkm3A"
    await addShow(token, sampleShow)
    // await getShows(token)
    // await getShow(token, testShowId)
    // await updateShow(token, testShowId, { title: "Updated Title" }); // Replace with a valid Show ID
    // await deleteShow(token, "YOUR_VALID_SHOW_ID"); // Replace with a valid Show ID
    // await testImageUpload(token, testShowId);
    // await testImageModify(token, testShowId);
    // await testImageDelete(token, testShowId);
  }
})
