"use client"

import { useEffect, useState, useCallback, useMemo, memo } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import Pagelayout from "@/components/layout/PageLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import useProfileStore from "@/store/session.store"
import { postDataToAPI } from "@/lib/api"
import { getPermName } from "@/lib/constant"
import WithdrawalSection from "@/components/custom/freelancer/WithdrawalSection"

const profileSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
})

const getInitials = (name) => {
  if (!name) return "U"
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

const SkeletonLoading = memo(() => (
  <div className="max-w-7xl mx-auto space-y-6">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-4 w-[200px]" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-[100px]" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <div className="space-y-2 text-center">
              <Skeleton className="h-6 w-[200px]" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-6 w-[100px]" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-6 w-[80px]" />
            <Skeleton className="h-6 w-[120px]" />
            <Skeleton className="h-6 w-[100px]" />
          </div>
        </CardContent>
      </Card>
    </div>
  </div>
))

const ProfileInfoCard = memo(({ profile }) => {
  const initials = useMemo(() => getInitials(profile?.name), [profile?.name])
  
  const lastLogin = useMemo(() => 
    profile?.last_login ? new Date(profile.last_login).toLocaleString() : null
  , [profile?.last_login])

  const createdAt = useMemo(() => 
    profile?.created_at ? new Date(profile.created_at).toLocaleString() : null
  , [profile?.created_at])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>
          Your current profile details and permissions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-32 w-32">
            <AvatarImage src={profile?.profile_photo} alt={profile?.name} />
            <AvatarFallback className="text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h3 className="text-2xl font-semibold">{profile?.name || "User"}</h3>
            <p className="text-muted-foreground">{profile?.email}</p>
          </div>
        </div>

        {profile?.userType !== 'freelancer' && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Account Status
            </h4>
            <div className="flex flex-wrap gap-2">
              {profile?.is_super_admin && (
                <Badge variant="destructive" className="text-xs">
                  Super Admin
                </Badge>
              )}
              <Badge variant="secondary" className="text-xs">
                Internal Admin User
              </Badge>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {profile?.userType === 'freelancer' ? 'Skills' : 'Permissions'}
          </h4>
          {profile?.userType === 'freelancer' ? (
            profile?.skills && profile.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No skills added yet</p>
            )
          ) : (
            profile?.permissions && profile.permissions.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile.permissions.map((permission, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {getPermName(permission)}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No specific permissions assigned</p>
            )
          )}
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Account Details
          </h4>
          <div className="space-y-2 text-sm">
            {lastLogin && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Login:</span>
                <span>{lastLogin}</span>
              </div>
            )}
            {createdAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Created At:</span>
                <span>{createdAt}</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
})

const EditProfileForm = memo(({ profile, onProfileUpdate }) => {
  const [isUpdating, setIsUpdating] = useState(false)
  const [profilePicture, setProfilePicture] = useState(null)
  const [previewUrl, setPreviewUrl] = useState(profile?.profile_photo || null)

  const form = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
    },
  })

  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        email: profile.email || "",
      })
      if (!profilePicture) {
        setPreviewUrl(profile.profile_photo)
      }
    }
  }, [profile, form, profilePicture])

  const handleProfilePictureChange = useCallback((event) => {
    const file = event.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB")
        return
      }

      setProfilePicture(file)

      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result)
      }
      reader.readAsDataURL(file)
    }
  }, [])

  const onSubmit = useCallback(async (values) => {
    setIsUpdating(true)
    try {
      const formData = new FormData()
      formData.append('name', values.name)
      formData.append('email', values.email)

      if (profilePicture) {
        formData.append('profile_photo', profilePicture)
      }

      await onProfileUpdate(formData)
      setProfilePicture(null)
    } catch (error) {
      console.error("Profile update error:", error)
    } finally {
      setIsUpdating(false)
    }
  }, [profilePicture, onProfileUpdate])

  const initials = useMemo(() => getInitials(profile?.name), [profile?.name])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
        <CardDescription>
          Update your personal information and profile picture
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <FormLabel>Profile Picture</FormLabel>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={previewUrl || profile?.profile_photo} alt={profile?.name} />
                    <AvatarFallback className="text-sm">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-all duration-200 rounded-full flex items-center justify-center cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfilePictureChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      disabled={isUpdating}
                    />
                    <div className="text-white text-xs font-medium opacity-0 hover:opacity-100 transition-opacity">
                      Edit
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <FormDescription>
                    Click on the avatar to change your profile picture. Supported formats: JPG, PNG, GIF (max 5MB)
                  </FormDescription>
                  {profilePicture && (
                    <p className="text-xs text-green-600 mt-1">
                      New photo selected: {profilePicture.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
                  </FormControl>
                  <FormDescription>
                    This is the name that will be displayed on your profile.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email address" type="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    This email will be used for account notifications and login.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isUpdating} className="w-full sm:w-auto">
              {isUpdating ? "Updating..." : "Update Profile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
})

export default function MyProfile() {
  const { profile, refreshProfile } = useProfileStore()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let mounted = true
    const loadProfile = async () => {
      setIsLoading(true)
      try {
        await refreshProfile()
      } catch (error) {
        toast.error("Failed to load profile data")
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    loadProfile()
    return () => {
      mounted = false
    }
  }, [refreshProfile])

  const handleUpdate = useCallback(async (formData) => {
    try {
      const res = await postDataToAPI('update-admin/', formData, true, false);

      if (res || res.success) {
        await refreshProfile()
        toast.success("Profile updated successfully!")
      } else {
        toast.error("Failed to update profile. Please try again.")
      }
    } catch (error) {
      toast.error("Failed to update profile. Please try again.")
      throw error 
    }
  }, [refreshProfile])

  

  if (isLoading || !profile) {
    return (
      <Pagelayout title={"My Profile"}>
        <SkeletonLoading />
      </Pagelayout>
    )
  }

  return (
    <Pagelayout title={"My Profile"}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EditProfileForm profile={profile} onProfileUpdate={handleUpdate} />
          <ProfileInfoCard profile={profile} />
        </div>

        {profile.userType === 'freelancer' && (
          <WithdrawalSection />
        )}
      </div>
    </Pagelayout>
  )
}