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
import { postDataToAPI } from "@/lib/api"
import { toast } from "sonner"
import { useState } from "react"

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    type: z.string({
        required_error: "Please select a type.",
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
    estimated_hours: z.string().optional(),
    total_cost: z.number().optional(),
    deliverables: z.string().optional(),
})

export function CreateOffer({ uid, sendOfferMessage, offer = null }) {
    const [open, setOpen] = useState(false)
    
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            timeline: "",
            budget: 0,
            type: "general",
            estimated_hours: "",
            total_cost: 0,
            deliverables:  "",
        },
    })

    async function onSubmit(values) {
        const endpoint = "/create-offer";
        
        const payload = {
            name: values.name,
            description: values.description,
            timeline: values.timeline,
            budget: values.budget,
            type: values.type,
            estimated_hours: values.estimated_hours,
            total_cost: values.total_cost ? parseInt(values.total_cost) : null,
            deliverables: values.deliverables.split(","),
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
                    Create New Offer
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-7xl max-h-[90vh] w-[95vw] h-[90vh] flex flex-col">
                <DialogHeader className="flex-shrink-0">
                    <DialogTitle>Create Offer</DialogTitle>
                    <DialogDescription>
                        Create a new offer by filling out the form below.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex-1 overflow-y-auto pr-2">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            {/* Grid layout for form fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                                    name="type"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Offer Type</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Offer Type" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="general">General</SelectItem>
                                                    <SelectItem value="meeting">Meeting</SelectItem>
                                                </SelectContent>
                                            </Select>
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
                                <FormField
                                    control={form.control}
                                    name="estimated_hours"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Estimated Hours</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="text"
                                                    placeholder="Estimated hours (optional)"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="total_cost"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Total Cost</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    placeholder="Total cost (optional)"
                                                    {...field}
                                                    onChange={event => field.onChange(Number(event.target.value))}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Full width fields */}
                            <div className="space-y-4">
                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea 
                                                    placeholder="Offer description" 
                                                    className="min-h-[100px]"
                                                    {...field} 
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="deliverables"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Deliverables</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Enter deliverables, separated by commas"
                                                    className="min-h-[80px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            
                            <DialogFooter className="flex-shrink-0 sticky bottom-0 bg-white pt-4 border-t">
                                <Button type="submit" className="w-full md:w-auto">
                                    {offer ? "Update Offer" : "Create Offer"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    )
}
