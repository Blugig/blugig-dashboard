"use client";

import Pagelayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { postDataToAPI } from "@/lib/api";
import { PERMISSIONS } from "@/lib/constant";
import { useState } from "react";
import { toast } from "sonner";

export default function AddAdminUsers() {
    const [email, setEmail] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState({});
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    function handleSwitchChange(code) {
        setSelectedPermissions((prevPermissions) => ({
            ...prevPermissions,
            [code]: !prevPermissions[code],
        }));
    };

    async function handleSubmit() {
        const selectedCodes = Object.keys(selectedPermissions).filter(
            (code) => selectedPermissions[code]
        );

        if (email && selectedCodes.length > 0) {
            const res = await postDataToAPI('/create-admin', {
                name: email.split('@')[0],
                email,
                permissions: selectedCodes,
                is_super_admin: isSuperAdmin
            });

            if (res.status === 'success') {
                toast("User Added Successfully");
                setEmail("");
                setSelectedPermissions({});
                setIsSuperAdmin(false);
            } else {
                toast("Error", {
                    description: res.message || "Failed to add user.",
                });
            }
        } else {
            toast("Error Occurred", {
                description: "Make sure to enter a valid email and select at least one permission.",
            });
        }
    };

    return (
        <Pagelayout title={"Add Admin User"}>
            <div className="w-full flex items-center justify-between space-x-4 mb-8">
                <Input
                    type="email"
                    placeholder="user@piikeup.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Button onClick={handleSubmit}>Add User</Button>
            </div>

            <div className="w-full flex flex-col space-y-8">

                {/* Super Admin Switch */}
                <div className="w-full flex items-center justify-between border-b pb-4 mb-4">
                    <h4 className="scroll-m-20 text-lg font-semibold tracking-tight mr-auto">
                        Super Admin
                    </h4>
                    <Switch
                        id="super-admin-switch"
                        checked={isSuperAdmin}
                        onCheckedChange={() => setIsSuperAdmin(prev => !prev)}
                    />
                </div>

                {/* Permissions */}
                {PERMISSIONS.map(perm => (
                    <div key={perm.code} className="w-full flex items-center justify-between">
                        <h4 className="scroll-m-20 text-lg font-semibold tracking-tight mr-auto">
                            {perm.name}
                        </h4>
                        <Switch
                            id={perm.code}
                            checked={!!selectedPermissions[perm.code]}
                            onCheckedChange={() => handleSwitchChange(perm.code)}
                        />
                    </div>
                ))}
            </div>
        </Pagelayout>
    );
}
