"use server";

import axios from "axios";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";
import { freelancerApiClient } from "./api";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

export async function freelanceLogin(formData) {
    try {
        const res = await freelancerApiClient.post("freelancers/login/", formData)

        if (res.data.success) {
            const data = res.data.data;
            const accessToken = data.access_token;

            const perms = ["FREELANCER"];

            const encoded_perms = btoa(JSON.stringify(perms))

            const decodedToken = jwtDecode(accessToken);
            const expires = new Date(decodedToken.exp * 1000)

            cookies().set('session', accessToken, { expires, httpOnly: true })
            cookies().set('sessperms', encoded_perms, { expires, httpOnly: true })
        }
        return res.data.success;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export async function login(formData) {
    try {
        const res = await axios.post("admin/login/", formData)

        if (res.data.success) {
            const data = res.data.data;
            const accessToken = data.access_token;

            const perms = data.permissions;
            if (data.is_super_admin) {
                perms.push("SUPER")
            }

            perms.push("ADMIN");

            const encoded_perms = btoa(JSON.stringify(perms))

            const decodedToken = jwtDecode(accessToken);
            const expires = new Date(decodedToken.exp * 1000)

            cookies().set('session', accessToken, { expires, httpOnly: true })
            cookies().set('sessperms', encoded_perms, { expires, httpOnly: true })
        }
        return res.data.success;
    } catch (error) {
        console.log(error)
        return false;
    }
}

export async function logout() {
    cookies().delete('session')
    cookies().delete('sessperms')
    
    // Clear Authorization header from axios defaults
    delete axios.defaults.headers.common["Authorization"]
}

export async function verifySession(request) {
    // 1. Get current context: hostname, path, and session cookies
    const { pathname } = request.nextUrl;
    const hostname = request.headers.get("host");
    const session = request.cookies.get('session')?.value;
    const sessperms = request.cookies.get('sessperms')?.value;

    // 2. Define your hostnames from environment variables
    const adminHost = process.env.NEXT_PUBLIC_ADMIN_HOST || "admin.localhost:3000";
    const freelancerHost = process.env.NEXT_PUBLIC_FREELANCER_HOST || "freelancer.localhost:3000";

    const isFreelancerPortal = hostname === freelancerHost;
    const isAdminPortal = hostname === adminHost;

    // --- HANDLE UNAUTHENTICATED USERS ---
    if (!session) {
        if (isAdminPortal && !pathname.startsWith('/admin/login')) {
            // If on admin portal and not logged in, force redirect to admin login
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
        if (isFreelancerPortal && !pathname.startsWith('/login')) {
            // If on freelancer portal and not logged in, force redirect to freelancer login
            return NextResponse.redirect(new URL('/login', request.url));
        }
        // For other cases (like main domain), use default login logic
        if (!pathname.includes('/login')) {
            return NextResponse.redirect(new URL('/login', request.url));
        }
        return NextResponse.next();
    }

    // --- HANDLE AUTHENTICATED USERS ---
    // At this point, the user has a session cookie.
    
    // A. Parse user permissions from the cookie
    let userPermissions = [];
    if (sessperms) {
        try {
            userPermissions = JSON.parse(atob(sessperms));
        } catch (error) {
            console.error('Error parsing user permissions:', error);
            // If permissions are invalid, redirect to a safe login page
            const logoutUrl = isFreelancerPortal ? '/login' : '/admin/login';
            return NextResponse.redirect(new URL(logoutUrl, request.url));
        }
    }

    const isSuperUser = userPermissions.includes('ADMIN');
    const isFreelancerUser = userPermissions.includes('FREELANCER');

    // B. Enforce portal access: Ensure the user's role matches the portal
    // THIS IS THE KEY LOGIC TO PREVENT FREELANCERS FROM ACCESSING ADMIN AREAS
    if (isAdminPortal && !isSuperUser) {
        // A user without SUPER permissions is on the admin portal.
        // Redirect them away to the freelancer portal.
        return NextResponse.redirect(`http://${freelancerHost}`);
    }

    if (isFreelancerPortal && !isFreelancerUser) {
        // An admin or other non-freelancer is on the freelancer portal.
        // Redirect them to the admin portal.
        return NextResponse.redirect(`http://${adminHost}/dashboard`);
    }

    // C. If user is logged in, redirect away from any login page
    if (pathname.includes('/login')) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    // D. Enforce route-level access within the correct portal
    if (isFreelancerPortal && isFreelancerUser) {
        // Only allow access to profile ('/'), jobs, and forms for freelancers.
        const isAllowed = pathname === '/' || pathname.startsWith('/jobs') || pathname.startsWith('/forms');
        
        if (!isAllowed) {
            // Redirect to a safe default page for freelancers if they access an invalid URL.
            return NextResponse.redirect(new URL('/jobs', request.url));
        }
    }

    // If all checks pass, allow the request to proceed
    return NextResponse.next();
}

export async function getRoutes() {
    "use server";

    const decoded_user_perms = JSON.parse(atob(cookies().get('sessperms')?.value))

    return decoded_user_perms;
}