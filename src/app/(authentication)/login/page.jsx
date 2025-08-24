"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, RefreshCw } from "lucide-react";
import { useState } from "react";
import { freelanceLogin, login } from "@/lib/auth";
import { toast } from "sonner";
import useProfileStore from "@/store/session.store";

const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(4)
})

export default function Login() {

    const router = useRouter();
    const { refreshProfile } = useProfileStore()

    const [loading, setLoading] = useState(false)
    const [visible, setVisible] = useState(false)

    const toggleVisible = () => {
        setVisible(prev => !prev)
    }

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })


    async function onSubmit(values) {
        setLoading(true)
        const res = await freelanceLogin(values)

        if (res) {
            setLoading(true);
            await refreshProfile();
            router.replace('/')
        } else {
            toast("Login Error", {
                description: "Invalid Credentials. Please try again.",
            })
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Login Form */}
            <div className="flex-1 flex flex-col justify-center px-8 sm:px-16 lg:px-24">
                <div className="max-w-md w-full mx-auto">
                    {/* Logo */}
                    <div className="flex items-center mb-8">
                        <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center mr-3">
                            <span className="text-white font-bold text-sm">B</span>
                        </div>
                        <span className="text-xl font-semibold">Blugig</span>
                    </div>
                    
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                            Freelancer Login
                        </h1>
                        <p className="text-sm text-gray-600">
                            Sign in to manage your freelance projects and gigs
                        </p>
                    </div>

                    {/* Login Form */}
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Email*</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Enter your email" 
                                                className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                                                {...field} 
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-medium text-gray-700">Password*</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={visible ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    className="h-11 border-gray-300 focus:border-purple-500 focus:ring-purple-500 pr-10"
                                                    {...field}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={toggleVisible}
                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                                >
                                                    {visible ? <Eye size={18} /> : <EyeOff size={18} />}
                                                </button>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button 
                                type="submit" 
                                className="w-full h-11 bg-gray-900 hover:bg-gray-800 text-white font-medium" 
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : "Sign In"}
                            </Button>
                        </form>
                    </Form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            Don't have an account? <a href="https://blugig.com/" className="text-purple-600 hover:text-purple-700 cursor-pointer font-medium">Sign Up Now</a>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Marketing Content */}
            <div className="hidden lg:flex flex-1 bg-gradient-to-br from-purple-400 via-purple-500 to-purple-600 relative overflow-hidden">
                <div className="flex flex-col justify-center items-center p-12 text-white relative z-10">
                    {/* Testimonial */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-8">
                        <p className="text-lg leading-relaxed mb-4">
                            "Blugig is surprisingly handy for keeping all my business stuff in one place."
                        </p>
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-white/30 rounded-full flex items-center justify-center mr-3">
                                <span className="text-sm font-medium">DM</span>
                            </div>
                            <div>
                                <div className="font-medium">David Miller</div>
                                <div className="text-sm text-white/70">E-commerce Specialist</div>
                            </div>
                        </div>
                    </div>

                    {/* Growth Metrics */}
                    <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6">
                        <div className="text-sm text-white/70 mb-2">GROWTH</div>
                        <div className="text-3xl font-bold mb-2">+21.35%</div>
                        <div className="text-sm text-white/70 mb-3">last month</div>
                        <p className="text-sm text-white/80">
                            This significant increase in growth highlights the effectiveness of our recent strategies and continued advancement.
                        </p>
                    </div>
                </div>

                {/* Background decorative elements */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-20 right-20 w-32 h-32 bg-white rounded-full opacity-10"></div>
                    <div className="absolute bottom-32 left-16 w-24 h-24 bg-white rounded-full opacity-10"></div>
                    <div className="absolute top-1/2 right-40 w-16 h-16 bg-white rounded-full opacity-10"></div>
                </div>
            </div>
        </div>
    )
}