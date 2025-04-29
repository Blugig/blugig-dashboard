"use server";

import axios from "axios";
import { cookies } from "next/headers";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL
axios.defaults.headers.common["Content-Type"] = 'application/json'

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

export async function fetchFromAPI(url) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${cookies().get("session").value}`
    try {
        const res = await axios.get(url);
        return res.data.data;
    } catch (error) {
        console.error("API call error:", error.response.data);
        return { success: false };
    }
}

export async function postDataToAPI(url, data, sendingFile = false) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${cookies().get("session").value}`
    if (sendingFile) {
        axios.defaults.headers.common["Content-Type"] = "multipart/form-data"
    }
    try {
        const response = await axios.post(url, data);
        return response.data.data;
    } catch (error) {
        console.error("API call error:", error.response.data);
        return { success: false };
    }
}