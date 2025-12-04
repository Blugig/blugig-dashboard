"use client";

import React from "react";
import { fetchFromAPI, postDataToAPI } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { DollarSign, TrendingUp, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function WithdrawalSection() {
    const [withdrawalData, setWithdrawalData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [isWithdrawing, setIsWithdrawing] = React.useState(false);
    const [withdrawAmount, setWithdrawAmount] = React.useState("");
    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const fetchWithdrawalData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const res = await fetchFromAPI("freelancers/earnings-history", true);
            setWithdrawalData(res);
        } catch (err) {
            console.error("Error fetching withdrawal data:", err);
            setError(err.message || "An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    React.useEffect(() => {
        fetchWithdrawalData();
    }, []);

    const handleWithdrawal = async () => {
        const amount = parseFloat(withdrawAmount);

        if (!amount || amount <= 0) {
            toast.error("Please enter a valid amount");
            return;
        }

        if (amount > withdrawalData?.wallet?.current_balance) {
            toast.error("Insufficient balance");
            return;
        }

        if (amount < 20) {
            toast.error("Minimum withdrawal amount is $20");
            return;
        }

        setIsWithdrawing(true);
        try {
            const res = await postDataToAPI("freelancers/withdraw-earnings", { amount }, false, true);
            
            if (res) {
                toast.success("Withdrawal request submitted successfully!");
                setWithdrawAmount("");
                setIsDialogOpen(false);
                await fetchWithdrawalData(); // Refresh data
            } else {
                toast.error(res?.message || "Failed to submit withdrawal request");
            }
        } catch (err) {
            console.error("Withdrawal error:", err);
            toast.error("Failed to submit withdrawal request");
        } finally {
            setIsWithdrawing(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'processing':
                return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-600" />;
            default:
                return <Clock className="h-4 w-4 text-yellow-600" />;
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'completed':
                return 'default';
            case 'processing':
                return 'secondary';
            case 'failed':
                return 'destructive';
            default:
                return 'outline';
        }
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Earnings & Withdrawals</CardTitle>
                    <CardDescription>Loading your earnings data...</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Earnings & Withdrawals</CardTitle>
                    <CardDescription className="text-destructive">
                        Error loading data: {error}
                    </CardDescription>
                </CardHeader>
            </Card>
        );
    }

    return (
        <div className="space-y-6">
            {/* Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-green-500">
                    <CardHeader className="pb-3">
                        <CardDescription className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            Available Balance
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-green-600">
                            ${withdrawalData?.wallet?.current_balance?.toFixed(2) || "0.00"}
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button className="mt-4 w-full" size="sm">
                                    Request Withdrawal
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Request Withdrawal</DialogTitle>
                                    <DialogDescription>
                                        Enter the amount you want to withdraw from your available balance. Minimum withdrawal amount is $20.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="amount">Withdrawal Amount</Label>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                                $
                                            </span>
                                            <Input
                                                id="amount"
                                                type="number"
                                                placeholder="0.00"
                                                value={withdrawAmount}
                                                onChange={(e) => setWithdrawAmount(e.target.value)}
                                                className="pl-7"
                                                min="0"
                                                step="0.01"
                                                disabled={isWithdrawing}
                                            />
                                        </div>
                                        <p className="text-sm text-muted-foreground">
                                            Available: ${withdrawalData?.wallet?.current_balance?.toFixed(2) || "0.00"}
                                        </p>
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        disabled={isWithdrawing}
                                    >
                                        Cancel
                                    </Button>
                                    <Button onClick={handleWithdrawal} disabled={isWithdrawing}>
                                        {isWithdrawing ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Processing...
                                            </>
                                        ) : (
                                            "Submit Request"
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

                <Card className="border-l-4 border-l-blue-500">
                    <CardHeader className="pb-3">
                        <CardDescription className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Total Earned
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold text-blue-600">
                            ${withdrawalData?.wallet?.total_earned?.toFixed(2) || "0.00"}
                        </div>
                        <p className="text-sm text-muted-foreground mt-4">
                            Lifetime earnings from completed jobs
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Withdrawal History */}
            <Card>
                <CardHeader>
                    <CardTitle>Withdrawal History</CardTitle>
                    <CardDescription>
                        Track all your withdrawal requests and their status
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {withdrawalData?.withdrawals?.length > 0 ? (
                        <div className="space-y-3">
                            {withdrawalData.withdrawals.map((withdrawal, index) => (
                                <React.Fragment key={withdrawal.id}>
                                    <div className="flex items-center justify-between py-3">
                                        <div className="flex items-start gap-4">
                                            <div className="mt-1">
                                                {getStatusIcon(withdrawal.status)}
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-semibold text-lg">
                                                        ${withdrawal.amount?.toFixed(2)}
                                                    </p>
                                                    <Badge variant={getStatusVariant(withdrawal.status)} className="text-xs">
                                                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                                                    </Badge>
                                                </div>
                                                <div className="flex flex-col text-sm text-muted-foreground">
                                                    <span>ID: #{withdrawal.id}</span>
                                                    <span>
                                                        Requested: {new Date(withdrawal.created_at).toLocaleDateString('en-US', {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </span>
                                                    {withdrawal.updated_at && withdrawal.updated_at !== withdrawal.created_at && (
                                                        <span>
                                                            Updated: {new Date(withdrawal.updated_at).toLocaleDateString('en-US', {
                                                                year: 'numeric',
                                                                month: 'short',
                                                                day: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {index < withdrawalData.withdrawals.length - 1 && <Separator />}
                                </React.Fragment>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                            <h3 className="font-semibold text-lg mb-2">No Withdrawals Yet</h3>
                            <p className="text-muted-foreground text-sm max-w-md mx-auto">
                                You haven't made any withdrawal requests yet. Once you have available balance, 
                                you can request a withdrawal using the button above.
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}