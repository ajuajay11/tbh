"use server";
import { redirect } from 'next/navigation';
 
export async function loginUser(formData:FormData) {
  try {
    const user = {
      firstname: formData.get("firstname")?.toString(),
      password: formData.get("password")?.toString(),
    };
    const response = await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    const data = await response.json();
    console.log(data);
    console.log(response);
    
    if (data) {
     redirect('/');
    }
    if (!response.ok) {
      return { error: data.message || "Something went wrong" };
    }

    return { success: "User registered successfully" };
  } catch (error:unknown) {
    console.error(error,'error');
    return { error: "Server error: Unknown error occurred" };
  }
}
