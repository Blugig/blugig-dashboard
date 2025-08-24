"use server";

import axios from "axios";
import { cookies } from "next/headers";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL + "admin/"
axios.defaults.headers.common["Content-Type"] = 'application/json'

// Create reusable API clients
const adminApiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL + "admin/",
    headers: {
        "Content-Type": "application/json"
    }
});

const freelancerApiClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

// Helper function to add auth token to client
function addAuthToken(client) {
    const token = cookies().get("session")?.value;
    if (token) {
        client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    }
    return client;
}

export async function verifyTokenBackend(token) {
    try {
        const res = await axios.get("verifyGoogleToken/", {
            token,
        });

        return res.data;
    } catch (error) {
        console.error("API call error:", error);
        return { success: false };
    }
}

export async function fetchFromAPI(url, is_freelancer=false) {
    const client = addAuthToken(is_freelancer ? freelancerApiClient : adminApiClient);
    
    try {
        const res = await client.get(url);
        return res.data.data;
    } catch (error) {
        console.error("API call error:", error.response?.data);
        return { success: false };
    }
}

export async function postDataToAPI(url, data, sendingFile = false, is_freelancer = false) {
    const client = addAuthToken(is_freelancer ? freelancerApiClient : adminApiClient);
    
    // Set content type for file uploads
    if (sendingFile) {
        client.defaults.headers.common["Content-Type"] = "multipart/form-data";
    } else {
        client.defaults.headers.common["Content-Type"] = "application/json";
    }

    try {
        const response = await client.post(url, data);
        if (response.data?.success === false) {
            throw new Error(response.data.message);
        }
        return response.data.data;
    } catch (error) {
        console.error("API call error:", error.response.data);
        throw new Error(error.response.data?.message);
    }
}