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
import { login } from "@/lib/auth";
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

        const res = await login(values)

        if (res) {
            setLoading(true)
            await refreshProfile()
            router.replace('/')
        } else {
            toast("Login Error", {
                description: "Invalid Credentials. Please try again.",
            })
            setLoading(false)
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                Blugig Dashboard Login
            </h1>
            <p className="text-sm text-muted-foreground text-center mt-2 mb-12">Please fill in your unique admin login details below</p>

            <Form {...form} className="w-full">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-[40vw]">
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input placeholder="example@piikeup.com" {...field} />
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
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <div className="relative flex items-center select-none">
                                        <Input
                                            type={visible ? "text" : "password"}
                                            placeholder="Password"
                                            {...field}
                                        />
                                        {visible
                                            ? <Eye className="absolute right-4" role="button" onClick={toggleVisible} />
                                            : <EyeOff className="absolute right-4" role="button" onClick={toggleVisible} />
                                        }
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-[40vw]" disabled={loading}>
                        {loading ? (
                            <>
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                Loading
                            </>
                        ) : "Submit"}
                    </Button>
                </form>
            </Form>
        </main>
    )
}