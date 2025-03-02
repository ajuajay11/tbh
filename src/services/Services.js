import axios from "axios";
const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

 export const fetchStoriesMatters = async () => {
  try {
    const response = await axios.get(`${baseUrl}/chroniclesOfEveryOne `);
    return response.data;
  } catch (error) {
    console.error('Error sending OTP:', error);
    throw error;
  }
};