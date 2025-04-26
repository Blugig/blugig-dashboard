"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

// axios.defaults.baseURL = "http://127.0.0.1:8000/v1/admin/"
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

export async function login(formData) {
    try {
        const res = await axios.post("login/", formData)

        if (res.data.success) {
            const data = res.data.data;
            const accessToken = data.access_token;

            const perms = data.permissions;
            if (data.is_super_admin) {
                perms.push("SUPER")
            }

            const encoded_perms = btoa(JSON.stringify(perms))

            const decodedToken = jwtDecode(accessToken);
            const expires = new Date(decodedToken.exp * 1000)

            cookies().set('session', accessToken, { expires, httpOnly: true })
            cookies().set('sessperms', encoded_perms, { expires, httpOnly: true })
        }
        return res.data.success;
    } catch (error) {
        console.log(error)
        return false
    }
}

export async function logout() {
    cookies().delete('session')
    cookies().delete('sessperms')
}

export async function verifySession(request) {
    const session = request.cookies.get('session')?.value

    if (session && request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    if (!session && !request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }
}

export async function getRoutes() {
    "use server";

    const decoded_user_perms = JSON.parse(atob(cookies().get('sessperms')?.value))

    return decoded_user_perms;
}