import { Quiz } from "../src/types/Quiz";
import { testLogin } from "./test_account";
import { API_URL } from "./test_constant";

const createQuiz = async (token: string, data: Partial<Quiz>): Promise<Quiz | undefined> => {
    const url = API_URL + '/quiz';
    const body = JSON.stringify(data);
    console.log('createQuiz body', body);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: body,
        });
        console.log(`createQuiz response`, response.status);
        const result = await response.json();
        console.log('createQuiz API Response:', result);
        return result;
    } catch (error: any) {
        console.error('Error calling createQuiz API:', error.message);
    }
};

const getQuiz = async (token: string, id: string): Promise<Quiz | undefined> => {
    const url = `${API_URL}/quiz/${id}`;
    console.log(`Fetching quiz with ID ${id} from:`, url);
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const quiz: Quiz = await response.json();
        console.log(`Fetched Quiz with ID ${id}:`, quiz);
        return quiz;
    } catch (error: any) {
        console.error(`Error fetching quiz with ID ${id}:`, error.message);
    }
};

const getAllQuizzes = async (token: string): Promise<Quiz[] | undefined> => {
    const url = API_URL + '/quiz';
    console.log('Fetching all quizzes from:', url);
    try {
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const quizzes: Quiz[] = await response.json();
        console.log('Fetched All Quizzes:', quizzes);
        return quizzes;
    } catch (error: any) {
        console.error('Error fetching all quizzes:', error.message);
    }
};

const updateQuiz = async (token: string, id: string, updateData: Partial<Quiz>): Promise<Quiz | undefined> => {
    const url = `${API_URL}/quiz/${id}`;
    const body = JSON.stringify(updateData);
    console.log(`Updating quiz with ID ${id} at:`, url);
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
        const updatedQuiz: Quiz = await response.json();
        console.log(`Updated Quiz with ID ${id}:`, updatedQuiz);
        return updatedQuiz;
    } catch (error: any) {
        console.error(`Error updating quiz with ID ${id}:`, error.message);
    }
};

const deleteQuiz = async (token: string, id: string): Promise<boolean> => {
    const url = `${API_URL}/quiz/${id}`;
    console.log(`Deleting quiz with ID ${id} from:`, url);
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        console.log(`Delete quiz response status: ${response.status}`);
        return response.ok;
    } catch (error: any) {
        console.error(`Error deleting quiz with ID ${id}:`, error.message);
        return false;
    }
};

const testQuizReferenceImageUpload = async (token: string, quizId: string) => {
  const url = `${API_URL}/quiz/${quizId}/reference-image`;
  console.log(`Testing image upload for Quiz ID ${quizId} to:`, url);

  const dummyImageData = new Uint8Array([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 13, 73, 72, 68, 82, 0, 0, 0, 1, 0, 0, 0, 1, 8, 6, 0, 0, 0, 31, 21, 196, 137,
    0, 0, 0, 11, 73, 64, 84, 24, 87, 99, 248, 15, 4, 0, 9, 243, 3, 253, 167, 50, 197, 0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130,
  ]); // A tiny 1x1 transparent PNG
  const dummyFile = new File([dummyImageData], "test_quiz_image.png", { type: "image/png" });

  const formData = new FormData();
  formData.append("referenceImage", dummyFile); // Field name should match backend expectation

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    console.log(`Quiz image upload response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    console.log('Quiz image upload API Response:', result);
    return result; // Return updated Quiz object or success indicator
  } catch (error: any) {
    console.error('Error uploading quiz image:', error.message);
    throw error;
  }
};

const testQuizReferenceImageDelete = async (token: string, quizId: string) => {
  console.log(`
--- Testing Quiz Image Deletion for Quiz ID: ${quizId} ---`);
  try {
    const deleteUrl = `${API_URL}/quiz/${quizId}/reference-image`;

    const response = await fetch(deleteUrl, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    console.log(`Quiz image deletion response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    console.log('Quiz image deletion API Response:', result);
    return result; // Return updated Quiz object or success message

  } catch (error: any) {
    console.error('Error during quiz image deletion test:', error.message);
    throw error;
  }
};

// Main test execution block
testLogin().then(async (token) => {
    if (!token) {
        console.error("Failed to login. Cannot run quiz tests.");
        return;
    }

    console.log("\n--- Starting Quiz API Tests ---");

    // Sample Quiz Data
    const sampleQuiz: Partial<Quiz> = {
        question: "What is the capital of France?",
        options: ["Berlin", "Madrid", "Paris", "Rome"],
        correctAnswer: "Paris", // Assuming correctAnswer is a string
        quizType: "multiple-choice",
    };

    // Test Create Quiz
    
    let testQuizId = "rk57TF2xcil8ig86cFN7"

    if (token) {
        await createQuiz(token, sampleQuiz);
        // Test Get Quiz by ID
        // await getQuiz(token, testQuizId);

        // Test Get All Quizzes
        // await getAllQuizzes(token);

        // Test Update Quiz
        // await updateQuiz(token, testQuizId, { question: "What is the capital of Spain?" });

        // Test Quiz Reference Image Upload
        // await testQuizReferenceImageUpload(token, testQuizId);

        // Test Quiz Reference Image Delete
        // await testQuizReferenceImageDelete(token, testQuizId); // Uncomment to test deletion

        // Test Delete Quiz
        // await deleteQuiz(token, testQuizId); // Uncomment to test deletion
    } else {
        console.error("Failed to create quiz, skipping further tests.");
    }

    console.log("--- Quiz API Tests Finished ---");
});
