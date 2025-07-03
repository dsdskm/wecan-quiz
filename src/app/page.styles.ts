import styled from 'styled-components';

// Styled Components 정의
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #e0f7fa; /* Light blue background */
`;

export const Form = styled.form`
  background-color: #ffffff; /* White background for the form */
  padding: 40px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
  max-width: 400px;
`;

export const FormTitle = styled.h1`
  text-align: center;
  color: #0288d1; /* Complementary blue */
  margin-bottom: 30px;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Label = styled.label`
  margin-bottom: 8px;
  font-weight: bold;
  color: #01579b; /* Darker blue for labels */
`;

export const Input = styled.input`
  padding: 12px;
  border: 1px solid #b3e5fc; /* Light blue border */
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #0288d1; /* Highlight on focus */
  }
`;

export const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-top: -10px; /* Adjust spacing */
`;

export const CheckboxLabel = styled.label`
  margin-left: 8px;
  color: #01579b;
  font-weight: normal;
  font-size: 0.9rem;
  cursor: pointer;
`;

export const Button = styled.button`
  background-color: #0288d1; /* Blue button */
  color: #ffffff; /* White text */
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #0277bd; /* Slightly darker on hover */
  }

  &:active {
    background-color: #01579b; /* Even darker when active */
  }
`;

export const LoadingIndicator = styled.div`
  text-align: center;
  color: #0288d1;
  font-size: 1.1rem;
  margin-top: 10px;
`;