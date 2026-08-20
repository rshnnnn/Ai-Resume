import axios from "axios";

export async function register({ username, email, password }) {
  try {
    const response = await axios.post(
      "https://ai-resumebackend.onrender.com/api/auth/register",
      {
        username,
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function login({ email, password }) {
  try {
    const response = await axios.post(
      "https://ai-resumebackend.onrender.com/api/auth/login",
      {
        email,
        password,
      },
      {
        withCredentials: true,
      },
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function logout() {
  try {
    const response = await axios.get("https://ai-resumebackend.onrender.com/api/auth/logout", {
      withCredentials: true,
    });
    return response.data
  } catch (error) {
    console.log(error);
  }
}

export async function getMe() {
  try {
    const response = await axios.get("https://ai-resumebackend.onrender.com/api/auth/get-me", {
      withCredentials: true,
    });
    return response.data
  } catch (error) {
    console.log(error);
  }
}
