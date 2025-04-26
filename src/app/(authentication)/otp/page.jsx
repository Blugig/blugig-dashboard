"use client";

import React from "react"
import { Button } from "@/components/ui/button";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
} from "@/components/ui/input-otp"

export default function OTP() {

    const [value, setValue] = React.useState("")

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                OTP Verification
            </h1>
            <p className="text-sm text-muted-foreground text-center mt-2 mb-12">
                Enter the OTP sent to your email dhru****@piikeup.com
            </p>

            <InputOTP
                maxLength={6}
                value={value}
                onChange={(val) => setValue(val)}
            >
                <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                </InputOTPGroup>

            </InputOTP>

            <Button className="mt-8 w-full max-w-sm">Verify & Continue</Button>
        </main>
    )
}