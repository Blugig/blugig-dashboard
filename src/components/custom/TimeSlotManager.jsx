"use client"

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Plus, Edit, Trash2, Clock, Users } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { fetchFromAPI, postDataToAPI } from '@/lib/api';

// Zod schema for time slot validation
const timeSlotSchema = z.object({
    start_time: z.string().min(1, "Start time is required"),
    capacity: z.number().min(1, "Capacity must be at least 1").max(50, "Capacity cannot exceed 50"),
    is_active: z.boolean().default(true),
});

const timeSlotsFormSchema = z.object({
    slots: z.array(timeSlotSchema).min(1, "At least one time slot is required"),
});

// Pre-defined time options
const timeOptions = [
    "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
    "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
    "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
    "5:00 PM", "5:30 PM", "6:00 PM", "6:30 PM", "7:00 PM", "7:30 PM", "8:00 PM"
];

const TimeSlotManager = () => {
    const [timeSlots, setTimeSlots] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [editingSlot, setEditingSlot] = useState(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

    // Form for adding multiple slots
    const addForm = useForm({
        resolver: zodResolver(timeSlotsFormSchema),
        defaultValues: {
            slots: [{ start_time: "", capacity: 1, is_active: true }]
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: addForm.control,
        name: "slots"
    });

    // Form for editing single slot
    const editForm = useForm({
        resolver: zodResolver(timeSlotSchema),
        defaultValues: {
            start_time: "",
            capacity: 1,
            is_active: true
        }
    });

    // Fetch time slots
    const fetchTimeSlots = async () => {
        try {
            setIsLoading(true);
            const response = await fetchFromAPI('/time-slots');

            if (response) {
                setTimeSlots(response);
            } else {
                toast.error('Failed to fetch time slots');
            }
        } catch (error) {
            toast.error('Error fetching time slots');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Create time slots
    const onSubmitAdd = async (data) => {
        try {
            const response = await postDataToAPI("/time-slots", { slots: data.slots }, false);

            if (response) {
                toast.success('Time slots created successfully');
                setIsAddDialogOpen(false);
                addForm.reset();
                fetchTimeSlots();
            } else {
                toast.error(response.message || 'Failed to create time slots');
            }
        } catch (error) {
            toast.error('Error creating time slots');
            console.error('Error:', error);
        }
    };

    // Update time slot
    const onSubmitEdit = async (data) => {
        try {
            const response = await postDataToAPI(`/time-slots/${editingSlot.id}`, data, false);

            if (response) {
                toast.success('Time slot updated successfully');
                setIsEditDialogOpen(false);
                setEditingSlot(null);
                editForm.reset();
                fetchTimeSlots();
            } else {
                toast.error(response.message || 'Failed to update time slot');
            }
        } catch (error) {
            toast.error('Error updating time slot');
            console.error('Error:', error);
        }
    };

    // Delete time slot
    const handleDelete = async (slotId) => {
        if (!confirm('Are you sure you want to delete this time slot?')) return;

        try {
            const response = await fetch(`/api/admin/time-slots/${slotId}`, {
                method: 'DELETE',
            });

            const result = await response.json();
            if (result.success) {
                toast.success('Time slot deleted successfully');
                fetchTimeSlots();
            } else {
                toast.error(result.message || 'Failed to delete time slot');
            }
        } catch (error) {
            toast.error('Error deleting time slot');
            console.error('Error:', error);
        }
    };

    // Toggle slot status
    const handleToggleStatus = async (slot) => {
        try {
            const response = await postDataToAPI(`/time-slots/${slot.id}`, {
                is_active: !slot.is_active
            }, false);

            if (response) {
                toast.success(`Time slot ${!slot.is_active ? 'activated' : 'deactivated'}`);
                fetchTimeSlots();
            } else {
                toast.error(response.message || 'Failed to update time slot');
            }
        } catch (error) {
            toast.error('Error updating time slot');
            console.error('Error:', error);
        }
    };

    // Open edit dialog
    const handleEdit = (slot) => {
        setEditingSlot(slot);
        editForm.reset({
            start_time: slot.start_time,
            capacity: slot.capacity,
            is_active: slot.is_active
        });
        setIsEditDialogOpen(true);
    };

    useEffect(() => {
        fetchTimeSlots();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Time Slot Management</h2>
                    <p className="text-muted-foreground">
                        Manage available time slots for one-on-one consultations
                    </p>
                </div>
                <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Add Time Slots
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Add New Time Slots</DialogTitle>
                            <DialogDescription>
                                Create multiple time slots at once. You can add more slots using the "Add Another Slot" button.
                            </DialogDescription>
                        </DialogHeader>
                        <Form {...addForm}>
                            <form onSubmit={addForm.handleSubmit(onSubmitAdd)} className="space-y-4">
                                {fields.map((field, index) => (
                                    <Card key={field.id} className="p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <h4 className="font-medium">Slot {index + 1}</h4>
                                            {fields.length > 1 && (
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => remove(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <FormField
                                                control={addForm.control}
                                                name={`slots.${index}.start_time`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Start Time</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <FormControl>
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select time" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                {timeOptions.map((time) => (
                                                                    <SelectItem key={time} value={time}>
                                                                        {time}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={addForm.control}
                                                name={`slots.${index}.capacity`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Capacity</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="1"
                                                                max="50"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={addForm.control}
                                                name={`slots.${index}.is_active`}
                                                render={({ field }) => (
                                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                                        <div className="space-y-0.5">
                                                            <FormLabel>Active</FormLabel>
                                                            <FormDescription className="text-xs">
                                                                Available for booking
                                                            </FormDescription>
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
                                        </div>
                                    </Card>
                                ))}
                                <div className="flex justify-between">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => append({ start_time: "", capacity: 1, is_active: true })}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Add Another Slot
                                    </Button>
                                    <div className="space-x-2">
                                        <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                            Cancel
                                        </Button>
                                        <Button type="submit">Create Time Slots</Button>
                                    </div>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Time Slots Grid */}
            {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <Card key={i} className="animate-pulse">
                            <CardContent className="p-6">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {timeSlots.map((slot) => (
                        <Card key={slot.id} className={`relative ${!slot.is_active ? 'opacity-60' : ''}`}>
                            <CardHeader className="pb-3">
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg flex items-center">
                                        <Clock className="w-4 h-4 mr-2" />
                                        {slot.start_time}
                                    </CardTitle>
                                    <Badge variant={slot.is_active ? 'default' : 'secondary'}>
                                        {slot.is_active ? 'Active' : 'Inactive'}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="pt-0">
                                <div className="flex items-center mb-4">
                                    <Users className="w-4 h-4 mr-2 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">
                                        Capacity: {slot.capacity} booking{slot.capacity !== 1 ? 's' : ''}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(slot)}
                                    >
                                        <Edit className="w-4 h-4 mr-1" />
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleToggleStatus(slot)}
                                    >
                                        {slot.is_active ? 'Deactivate' : 'Activate'}
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleDelete(slot.id)}
                                        className="text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {timeSlots.length === 0 && !isLoading && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No time slots found</h3>
                        <p className="text-muted-foreground mb-4">
                            Get started by creating your first time slot for consultations.
                        </p>
                        <Button onClick={() => setIsAddDialogOpen(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Time Slot
                        </Button>
                    </CardContent>
                </Card>
            )}

            {/* Edit Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Time Slot</DialogTitle>
                        <DialogDescription>
                            Update the time slot details.
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...editForm}>
                        <form onSubmit={editForm.handleSubmit(onSubmitEdit)} className="space-y-4">
                            <FormField
                                control={editForm.control}
                                name="start_time"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Start Time</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select time" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {timeOptions.map((time) => (
                                                    <SelectItem key={time} value={time}>
                                                        {time}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="capacity"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Capacity</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                min="1"
                                                max="50"
                                                {...field}
                                                onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Maximum number of bookings for this time slot
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={editForm.control}
                                name="is_active"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                                        <div className="space-y-0.5">
                                            <FormLabel>Active Status</FormLabel>
                                            <FormDescription>
                                                Make this time slot available for booking
                                            </FormDescription>
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
                            <div className="flex justify-end space-x-2">
                                <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Update Time Slot</Button>
                            </div>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default TimeSlotManager;
