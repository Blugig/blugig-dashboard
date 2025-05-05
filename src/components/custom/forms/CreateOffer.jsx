import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Newspaper } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { postDataToAPI, putDataToAPI } from "@/lib/api"
import { toast } from "sonner"
import { useState } from "react"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    description: z.string().min(10, {
        message: "Description must be at least 10 characters.",
    }),
    timeline: z.string({
        required_error: "Please select a timeline.",
    }),
    budget: z.number().min(1, {
        message: "Budget must be at least 1.",
    }),
})

export function CreateOffer({ uid, sendOfferMessage, offer = null }) {
    const [open, setOpen] = useState(false)
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: offer?.name || "",
            description: offer?.description || "",
            timeline: offer?.timeline || "",
            budget: offer?.budget || 0,
        },
    })

    async function onSubmit(values) {
        const endpoint = offer ? "/update-offer" : "/create-offer";
        
        const payload = {
            name: values.name,
            description: values.description,
            timeline: values.timeline,
            budget: values.budget,
            user_id: uid,
            ...(offer && { offerId: offer.id })
        };

        const res = await postDataToAPI(endpoint, payload);

        if (res) {
            toast.success(offer ? "Offer updated successfully" : "Offer created successfully");
            form.reset();

            if (!offer) {
                sendOfferMessage(res);
            }
            setOpen(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="mr-4">
                    <Newspaper className="size-4 mr-2" />
                    {offer ? "Revise Offer" : "Create New Offer"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{offer ? "Revise Offer" : "Create Offer"}</DialogTitle>
                    <DialogDescription>
                        {offer ? "Update your offer by modifying the form below." : "Create a new offer by filling out the form below."}
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Offer name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Offer description" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="timeline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Timeline</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select timeline" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="1week">1 Week</SelectItem>
                                            <SelectItem value="2weeks">2 Weeks</SelectItem>
                                            <SelectItem value="1month">1 Month</SelectItem>
                                            <SelectItem value="3months">3 Months</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="budget"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Budget</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="Enter budget"
                                            {...field}
                                            onChange={event => field.onChange(Number(event.target.value))}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="submit">{offer ? "Update Offer" : "Create Offer"}</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}
