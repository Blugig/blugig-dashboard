'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchFromAPI, postDataToAPI } from "@/lib/api";
import { toast } from "sonner";

// Client component to handle form submissions
const TaxManagementForm = ({ appConstantKey, defaultValue }) => {
    // State to manage input value
    const [value, setValue] = useState(defaultValue.toString());

    // Handle update function to send the update request to the API
    const handleUpdate = async () => {
        try {
            const response = await postDataToAPI('updateAppConstants/', { key: appConstantKey, value });

            if (response.status === 'success') {
                toast('Constant updated successfully', {
                    description: `${appConstantKey} was updated to ${value}`
                });
            } else {
                toast('Failed to update constant');
            }
        } catch (error) {
            toast('Failed to update constant', {
                description: JSON.stringify(error)
            });
        }
    };

    // Render the input and button
    return (
        <div className="flex w-full max-w-sm items-center space-x-4 ml-auto">
            <Input
                type="number"
                id={appConstantKey}
                name={appConstantKey}
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
            <Button
                type="button"
                onClick={handleUpdate}
            >
                Update
            </Button>
        </div>
    );
};

export default TaxManagementForm;
