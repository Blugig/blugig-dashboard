"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Image from "next/image";

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
import { freelanceLogin } from "@/lib/auth";
import { toast } from "sonner";
import useProfileStore from "@/store/session.store";
import SupportedPlatforms from "@/components/SupportedPlatforms";

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
        <section className="flex h-screen w-full items-stretch bg-white">
            {/* Left form side */}
            <main className="flex-1 h-full flex items-center justify-center px-8 sm:px-12 lg:px-16 py-8 bg-white overflow-y-auto">
                <div className="w-full max-w-sm space-y-5">
                    {/* Logo */}
                    <div className="mb-6">
                        <Image
                            src="/logo-black.png"
                            alt="Blugig Logo"
                            width={100}
                            height={32}
                            className="h-8 w-auto"
                        />
                    </div>

                    <div>
                        <h1 className="font-gilroy text-2xl font-semibold text-[#4950EA] leading-tight">
                            Freelancer Sign In
                        </h1>
                        <p className="text-gray-900 mt-3 text-sm leading-relaxed">
                            Sign in to access projects and clients from across the globe
                        </p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3.5">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-900 text-xs font-normal">Email</FormLabel>
                                        <FormControl>
                                            <Input 
                                                placeholder="Enter your email" 
                                                {...field}
                                                className="bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg h-10 text-sm"
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
                                        <FormLabel className="text-gray-900 text-xs font-normal">Password</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input
                                                    type={visible ? "text" : "password"}
                                                    placeholder="Enter your password"
                                                    {...field}
                                                    className="bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 rounded-lg h-10 text-sm pr-10"
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
                                className="w-full bg-[#6366F1] hover:bg-[#5558E3] text-white rounded-lg h-11 text-sm font-medium mt-4"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : "Sign In"}
                            </Button>

                            <p className="text-center text-sm text-gray-900 pt-1">
                                Don't have an account?{" "}
                                <a href="https://blugig.com/" className="text-background hover:underline font-semibold">
                                    Sign Up Now
                                </a>
                            </p>
                        </form>
                    </Form>
                </div>
            </main>

            {/* Right decorative side with background image */}
            <aside className="hidden lg:flex w-[55%] h-full relative overflow-hidden">
                {/* Background Image */}
                <div className="absolute inset-0">
                    <Image
                        src="/login-bg.png"
                        alt=""
                        fill
                        className="object-cover"
                        priority
                    />
                </div>

                {/* Content overlay */}
                <div className="relative z-10 flex flex-col p-12 text-white">
                    <div className="flex-1 flex flex-col justify-center max-w-2xl">
                        <h2 className="font-gilroy text-5xl leading-tight">
                            Work with Global Clients. <br /> 
                            Grow Without Limits.
                        </h2>

                        {/* Testimonial */}
                        <div className="relative">

                            <p className="text-white text-lg leading-relaxed mb-6 pt-8">
                                Blugig connects me with clients worldwide and makes project management simple and seamless.
                            </p>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/30">
                                <Image
                                    src="https://img.freepik.com/free-photo/portrait-white-man-isolated_53876-40306.jpg?semt=ais_hybrid&w=740&q=80"
                                    alt="David Miller"
                                    width={42}
                                    height={42}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <p className="font-semibold text-white text-lg">David Miller</p>
                                <p className="text-sm text-white/80">Freelance Consultant</p>
                            </div>
                        </div>
                    </div>

                    <SupportedPlatforms />
                </div>
            </aside>
        </section>
    )
}