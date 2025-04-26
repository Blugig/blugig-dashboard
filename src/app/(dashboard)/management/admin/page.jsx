"use client";

import Pagelayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"
import { fetchFromAPI, postDataToAPI } from "@/lib/api";

import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import Link from "next/link";
import { useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from "react";
import { PERMISSIONS } from "@/lib/constant";
import { toast } from "sonner";

function createSchema() {
    const schemaShape = PERMISSIONS.reduce((acc, code) => {
        acc[code] = z.boolean();
        return acc;
    }, {});

    return z.object(schemaShape);
}

const schema = createSchema(PERMISSIONS.map(p => p.code));

export default function AllAdminUsers() {
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <AllAdminUsersContent />
      </Suspense>
    );
  }

function AllAdminUsersContent() {
    const searchParams = useSearchParams()
    const [email, setEmail] = useState(searchParams.get('email') || "")
    const [adminUser, setAdminUser] = useState("")
    const [codes, setCodes] = useState([])
    const [defaultValues, setDefaultValues] = useState({});

    const form = useForm({
        resolver: zodResolver(schema),
        defaultValues,
    });

    useEffect(() => {
        if (email) {
            getAdminUser()
        }
    }, [])

    useEffect(() => {
        // Update the form when defaultValues change
        form.reset(defaultValues);
    }, [defaultValues]);

    async function getAdminUser() {
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            toast('Error', {
                description: "Enter a valid email address."
            });
            return;
        }
        
        const res = await fetchFromAPI('get-admin-details/' + email);
        setAdminUser(res)
        
        let perm_codes = res?.permissions.split(",");
        
        let defaultPermissions = PERMISSIONS.reduce((acc, permission) => {
            acc[permission.code] = perm_codes?.includes(permission.code);
            return acc;
        }, {})
        console.log(defaultPermissions);

        setDefaultValues(defaultPermissions)
        setCodes(perm_codes)
    }

    async function onSubmit() {

        const values = form.getValues();
        const perms_keys = Object.keys(values).filter(key => values[key]);

        try {
            const res = await postDataToAPI("update-admin/", {
                email,
                permissions: perms_keys,
            });

            if (res) {
                toast("Success", {
                    description: "Permissions updated successfully!"
                });
            } else {
                toast("Error", {
                    description: res?.message || "Something went wrong"
                });
            }
        } catch (error) {
            toast("Error", {
                description: "Failed to update permissions"
            });
        }
    }

    async function deleteUser() {
        if (!email) {
            toast("Error", {
                description: "Please provide a valid email."
            });
            return;
        }

        try {
            const res = await postDataToAPI("delete-admin/", {
                email
            });

            if (res?.success) {
                toast.success("Success", {
                    description: "User deleted successfully!"
                });
                setEmail("");
                setAdminUser("");
                setCodes([]);
                setDefaultValues({});
            } else {
                toast("Error", {
                    description: res?.message || "Failed to delete user"
                });
            }
        } catch (error) {
            toast("Error", {
                description: "Failed to delete user"
            });
        }
    }

    return (
        <Pagelayout title={"Admin User Permissions"}>
            <div className="w-full flex items-center justify-between space-x-4 mb-8">
                <Input type="email" placeholder="user@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                <Button onClick={getAdminUser}>See Permissions</Button>
                <Button variant="destructive" onClick={deleteUser}>
                    Remove User
                </Button>
                <span className="text-sm text-gray-400">OR</span>
                <Link href={"admin/add/"}>
                    <Button>Add Admin User</Button>
                </Link>
            </div>

            {adminUser && codes.length > 0 ? (
                <Form {...form}>
                    <form
                        className="w-full flex flex-col space-y-4"
                        // onSubmit={form.handleSubmit(onSubmit)}
                    >
                        {PERMISSIONS.map(perm => (
                            <FormField
                                key={perm.code}
                                control={form.control}
                                name={perm.code}
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                {perm.name}
                                            </FormLabel>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        ))}

                        <Button className="mt-4 w-1/4" type="button" onClick={onSubmit}>
                            Update Permissions
                        </Button>
                    </form>
                </Form>
            ) : (
                <h1>
                    {email
                        ? 'No admin user found with that email, add a new user instead.'
                        : "Enter an admin user's email to see their permissions."}
                </h1>
            )}
        </Pagelayout>
    );
}