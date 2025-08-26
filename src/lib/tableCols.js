import { ArrowDownUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn, formatDate } from "./utils"


const renderAttachment = ({ row }) => {
    const attachment = row.getValue("attachment");
    const attachmentType = row.original?.attachmentType;
    console.log(attachmentType, row);

    if (!attachment) return <div>-</div>;

    return (
        <Link href={attachment} target="_blank" className="text-blue-500">
            {attachmentType?.startsWith('image/') ? (
                <img src={attachment} width={200} height={200} alt="Attachment" />
            ) : (
                <span className="text-blue-500">View</span>
            )}
        </Link>
    )
}

export const JobParticipantsColumns = [
    {
        accessorKey: "id",
        header: "User ID",
        cell: ({ row }) => <div className="text-blue-500">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "name",
        header: "User Name",
        cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "user_type",
        header: "User Type",
        cell: ({ row }) => {
            const userType = row.getValue("user_type");
            return (
                <Badge variant={userType === 'admin' ? 'default' : 'secondary'}>
                    {userType === 'admin' ? 'Admin' : userType === 'freelancer' ? 'Freelancer' : 'User'}
                </Badge>
            );
        },
    },
    {
        accessorKey: "offers_count",
        header: "Offers Made",
        cell: ({ row }) => {
            const count = row.getValue("offers_count");
            return (
                <div className="text-center">
                    <span className={cn(
                        "px-2 py-1 rounded-full text-sm font-medium",
                        count > 0 
                            ? "bg-green-100 text-green-800" 
                            : "bg-gray-100 text-gray-600"
                    )}>
                        {count}
                    </span>
                </div>
            );
        },
    },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => {
            const userType = row.getValue("user_type");
            const userId = row.getValue("id");
            
            let route = "#";
            if (userType === 'admin') {
                route = `/management/permissions`;
            } else if (userType === 'freelancer') {
                route = `/dashboard/freelancers/${userId}`;
            }
            
            return (
                <Link href={route} className="text-blue-500 hover:underline">
                    View Profile
                </Link>
            );
        },
    },
];

export const UserDetailsColumns = [
    {
        accessorKey: "id",
        header: "User ID",
        cell: ({ row }) => <div className="text-blue-500">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => <div>{row.getValue("phone")}</div>,
    },
    {
        accessorKey: "user_type",
        header: "User Type",
        cell: ({ row }) => <Badge>{row.getValue("user_type")}</Badge>,
    },
    {
        accessorKey: "is_active",
        header: "Account Status",
        cell: ({ row }) => <Badge>{row.getValue("is_active") ? "Active" : "Inactive"}</Badge>,
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Account Creation Date
                    <ArrowDownUp className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{formatDate(row.getValue("created_at"))}</div>,
    },
    {
        id: "action",
        enableHiding: false,
        header: "Action",
        cell: ({ row }) => <Link href={`users/${row.getValue('id')}/`} className="text-blue-500">View</Link>,
    },
];

export const FreelancerDetailsColumns = [
    {
        accessorKey: "id",
        header: "User ID",
        cell: ({ row }) => <div className="text-blue-500">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "email",
        header: "Email",
        cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
        accessorKey: "phone",
        header: "Phone",
        cell: ({ row }) => <div>{row.getValue("country_code")} {row.getValue("phone")}</div>,
    },
    {
        accessorKey: "is_active",
        header: "Account Status",
        cell: ({ row }) => (
            <Badge className={row.getValue("is_active") ? "bg-success" : "bg-destructive"}>
                {row.getValue("is_active") ? "Active" : "Inactive"}
            </Badge>
        ),
    },
    {
        accessorKey: "is_approved",
        header: "Approval Status",
        cell: ({ row }) => (
            <Badge className={row.getValue("is_approved") ? "bg-success" : "bg-destructive"}>
                {row.getValue("is_approved") ? "Approved" : "Pending"}
            </Badge>
        ),
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Account Creation Date
                    <ArrowDownUp className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{formatDate(row.getValue("created_at"))}</div>,
    },
    {
        id: "action",
        enableHiding: false,
        header: "Action",
        cell: ({ row }) => <Link href={`freelancers/${row.getValue('id')}/`} className="text-blue-500">View</Link>,
    },
];

export const UserSubmissionsColumns = [
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Submission Date
                    <ArrowDownUp className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{formatDate(row.getValue("created_at"))}</div>,
    },
    {
        accessorKey: "form_id",
        header: "Form ID",
        cell: ({ row }) => <div className="text-blue-500">{row.getValue("form_id")}</div>,
    },
    {
        accessorKey: "form_type",
        header: "Form Type",
        cell: ({ row }) => <Badge>{row.getValue("form_type")}</Badge>,
    },
    {
        accessorKey: "form_name",
        header: "Form Name",
        cell: ({ row }) => <div>{row.getValue("form_name")}</div>,
    },
    {
        accessorKey: "form_title",
        header: "Title",
        cell: ({ row }) => <div>{row.getValue("form_title") || "-"}</div>,
    },
    {
        accessorKey: "form_description",
        header: "Description",
        cell: ({ row }) => <div>{row.getValue("form_description") || "-"}</div>,
    },
    {
        accessorKey: "conversation_uuid",
        header: "Conversation Exists",
        cell: ({ row }) => <div>{row.getValue("conversation_uuid") ? "Yes" : "No"}</div>,
    },
    {
        id: "action",
        enableHiding: false,
        header: "Action",
        cell: ({ row }) => (
            <Link
                href={`/forms/details/${row.getValue("form_id")}-${row.getValue("form_type")}`}
                className="text-blue-500"
            >
                View
            </Link>
        ),
    },
];

export const SolutionImplementationColumns = [
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <Link href={`/dashboard/users/${row.original.user?.id}`} className="text-blue-500">{row.original.user?.name}</Link>,
    },
    { accessorKey: "project_title", header: "Project Title" },
    { accessorKey: "implementation_type", header: "Implementation Type" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "team_size", header: "Team Size" },
    { accessorKey: "timeline", header: "Timeline" },
    { accessorKey: "budget", header: "Budget" },
    { accessorKey: "current_tools", header: "Current Tools" },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => (
            <Link href={`/forms/details/${row.original.form_submission_id}-SOL`} className="text-blue-500">View</Link>
        ),
    }
];

export const PremiumAppSupportColumns = [
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <Link href={`/dashboard/users/${row.original.user?.id}`} className="text-blue-500">{row.original.user?.name}</Link>,
    },
    { accessorKey: "organization_name", header: "Organization" },
    { accessorKey: "premium_addons", header: "Premium Add-ons" },
    { accessorKey: "primary_use_case", header: "Primary Use Case" },
    { accessorKey: "current_smartsheet_plan", header: "Smartsheet Plan" },
    { accessorKey: "team_size", header: "Team Size" },
    { accessorKey: "implementation_scope", header: "Implementation Scope" },
    { accessorKey: "timeline", header: "Timeline" },
    { accessorKey: "budget", header: "Budget" },
    { accessorKey: "primary_contact_email", header: "Contact Email" },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => <Link href={`/forms/details/${row.original.form_submission_id}-PRM`} className="text-blue-500">View</Link>,
    }
]

export const ApiIntegrationColumns = [
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <Link href={`/dashboard/users/${row.original.user?.id}`} className="text-blue-500">{row.original.user?.name}</Link>,
    },
    { accessorKey: "integration_type", header: "Integration Type" },
    { accessorKey: "source_system", header: "Source System" },
    { accessorKey: "data_to_sync", header: "Data to Sync" },
    { accessorKey: "sync_direction", header: "Sync Direction" },
    { accessorKey: "sync_frequency", header: "Sync Frequency" },
    { accessorKey: "data_volumne", header: "Data Volume" },
    { accessorKey: "timeline", header: "Timeline" },
    { accessorKey: "budget", header: "Budget" },
    { accessorKey: "description", header: "Description" },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => <Link href={`/forms/details/${row.original.form_submission_id}-API`} className="text-blue-500">View</Link>,
    }
];

export const HireSmartsheetExpertColumns = [
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <Link href={`/dashboard/users/${row.original.user?.id}`} className="text-blue-500">{row.original.user?.name}</Link>,
    },
    { accessorKey: "position_type", header: "Position Type" },
    { accessorKey: "job_title", header: "Job Title" },
    { accessorKey: "company_name", header: "Company" },
    { accessorKey: "location", header: "Location" },
    { accessorKey: "experience_level", header: "Experience Level" },
    { accessorKey: "budget", header: "Budget" },
    { accessorKey: "start_date", header: "Start Date" },
    { accessorKey: "contract_duration", header: "Duration" },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => <Link href={`/forms/details/${row.original.form_submission_id}-EXP`} className="text-blue-500">View</Link>,
    }
];

export const SystemAdminSupportColumns = [
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <Link href={`/dashboard/users/${row.original.user?.id}`} className="text-blue-500">{row.original.user?.name}</Link>,
    },
    { accessorKey: "support_needed", header: "Support Needed" },
    { accessorKey: "smartsheet_plan", header: "Smartsheet Plan" },
    { accessorKey: "number_of_users", header: "Number of Users" },
    { accessorKey: "current_admin_experience", header: "Admin Experience" },
    { accessorKey: "current_challenges", header: "Current Challenges" },
    { accessorKey: "support_frequency", header: "Support Frequency" },
    { accessorKey: "timezone", header: "Timezone" },
    { accessorKey: "urgency_level", header: "Urgency Level" },
    { accessorKey: "budget", header: "Budget" },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => <Link href={`/forms/details/${row.original.form_submission_id}-ADM`} className="text-blue-500">View</Link>,
    }
];

export const AdhocRequestColumns = [
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <Link href={`/dashboard/users/${row.original.user?.id}`} className="text-blue-500">{row.original.user?.name}</Link>,
    },
    { accessorKey: "need_help_with", header: "Help Needed With" },
    { accessorKey: "description", header: "Description" },
    { accessorKey: "urgency_level", header: "Urgency Level" },
    { accessorKey: "budget", header: "Budget" },
    { accessorKey: "expected_timeline", header: "Expected Timeline" },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => <Link href={`/forms/details/${row.original.form_submission_id}-ADH`} className="text-blue-500">View</Link>,
    }
];

export const BookOneOnOneColumns = [
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <Link href={`/dashboard/users/${row.original.user?.id}`} className="text-blue-500">{row.original.user?.name}</Link>,
    },
    { accessorKey: "preferred_date", header: "Preferred Date" },
    { accessorKey: "preferred_time", header: "Preferred Time" },
    { accessorKey: "consultation_focus", header: "Consultation Focus" },
    { accessorKey: "smartsheet_experience", header: "Smartsheet Experience" },
    { accessorKey: "team_size", header: "Team Size" },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => <Link href={`/forms/details/${row.original.form_submission_id}-ONE`} className="text-blue-500">View</Link>,
    }
];

export const PmoControlCenterColumns = [
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <Link href={`/dashboard/users/${row.original.user?.id}`} className="text-blue-500">{row.original.user?.name}</Link>,
    },
    { accessorKey: "organization_name", header: "Organization" },
    { accessorKey: "control_centre_type", header: "Control Centre Type" },
    { accessorKey: "required_features", header: "Required Features" },
    { accessorKey: "expected_project_scale", header: "Project Scale" },
    { accessorKey: "team_size", header: "Team Size" },
    { accessorKey: "current_smartsheet_experience", header: "Smartsheet Experience" },
    { accessorKey: "budget", header: "Budget" },
    { accessorKey: "timeline", header: "Timeline" },
    { accessorKey: "primary_contact_email", header: "Contact Email" },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => <Link href={`/forms/details/${row.original.form_submission_id}-PMO`} className="text-blue-500">View</Link>,
    }
];

export const LicenseRequestColumns = [
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <Link href={`/dashboard/users/${row.original.user?.id}`} className="text-blue-500">{row.original.user?.name}</Link>,
    },
    { accessorKey: "license_type", header: "License Type" },
    { accessorKey: "company_name", header: "Company" },
    { accessorKey: "industry", header: "Industry" },
    { accessorKey: "team_size", header: "Team Size" },
    { accessorKey: "full_name", header: "Full Name" },
    { accessorKey: "email", header: "Email" },
    { accessorKey: "phone", header: "Phone" },
    { accessorKey: "job_title", header: "Job Title" },
    { accessorKey: "timeline", header: "Timeline" },
    { accessorKey: "project_needs", header: "Project Needs" },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => <Link href={`/forms/details/${row.original.form_submission_id}-LIR`} className="text-blue-500">View</Link>,
    }
];

export const JobDetailsColumns = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="text-blue-500">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "job_type",
        header: "Type",
        cell: ({ row }) => <Badge variant="outline">{row.getValue("job_type")}</Badge>,
    },
    {
        accessorKey: "client",
        header: "Client",
        cell: ({ row }) => {
            const client = row.getValue("client");
            return client ? (
                <Link href={`/dashboard/users/${client.id}`} className="text-blue-500">
                    {client.name}
                </Link>
            ) : <span>-</span>;
        },
    },
    {
        accessorKey: "form_submission",
        header: "Form Type",
        cell: ({ row }) => {
            const formSubmission = row.getValue("form_submission");
            return <span>{formSubmission.form_name}</span>;
        },
    },
    {
        accessorKey: "form_submission.form_title",
        header: "Form Title",
        cell: ({ row }) => {
            const formSubmission = row.original.form_submission;
            return formSubmission?.form_title || "-";
        },
    },
    {
        accessorKey: "form_submission.status",
        header: "Form Status",
        cell: ({ row }) => {
            const formSubmission = row.original.form_submission;
            return formSubmission ? (
                <Badge variant={formSubmission.status === 'completed' ? 'default' : 'secondary'}>
                    {formSubmission.status}
                </Badge>
            ) : <span>-</span>;
        },
    },
    {
        accessorKey: "awarded_to_user_type",
        header: "Awarded To",
        cell: ({ row }) => {
            const userType = row.getValue("awarded_to_user_type");
            const admin = row.getValue("awarded_admin");
            const freelancer = row.getValue("awarded_freelancer");
            
            if (!userType) {
                return <span>Not Awarded</span>;
            }
            
            if (userType === "admin" && admin) {
                return (
                    <div className="flex flex-col">
                        <Badge variant="outline">{userType}</Badge>
                        <span className="text-sm text-muted-foreground mt-1">{admin.name}</span>
                    </div>
                );
            }
            
            if (userType === "freelancer" && freelancer) {
                return (
                    <div className="flex flex-col">
                        <Badge variant="outline">{userType}</Badge>
                        <span className="text-sm text-muted-foreground mt-1">{freelancer.name}</span>
                    </div>
                );
            }
            
            return <Badge variant="outline">{userType}</Badge>;
        },
    },
    {
        accessorKey: "_count.offers",
        header: "Offers",
        cell: ({ row }) => {
            const count = row.original._count?.offers || 0;
            return <span>{count}</span>;
        },
    },
    {
        accessorKey: "_count.conversations",
        header: "Conversations",
        cell: ({ row }) => {
            const count = row.original._count?.conversations || 0;
            return <span>{count}</span>;
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created Date
                    <ArrowDownUp className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{formatDate(row.getValue("created_at"))}</div>,
    },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <Link href={`/dashboard/jobs/${row.getValue('id')}`} className="text-blue-500">
                    View
                </Link>
            </div>
        ),
    },
];

export const JobDetailsFreelancerColumns = [
    {
        accessorKey: "id",
        header: "ID",
        cell: ({ row }) => <div className="text-blue-500">{row.getValue("id")}</div>,
    },
    {
        accessorKey: "client",
        header: "Client",
        cell: ({ row }) => {
            const client = row.getValue("client");
            return client ? (
                <Link href={`/dashboard/users/${client.id}`} className="text-blue-500">
                    {client.name}
                </Link>
            ) : <span>-</span>;
        },
    },
    {
        accessorKey: "form_submission",
        header: "Job Type",
        cell: ({ row }) => {
            const formSubmission = row.getValue("form_submission");
            return <span>{formSubmission.form_name}</span>;
        },
    },
    {
        accessorKey: "form_submission.form_title",
        header: "Job Title",
        cell: ({ row }) => {
            const formSubmission = row.original.form_submission;
            return formSubmission?.form_title || "-";
        },
    },
    {
        accessorKey: "form_submission.form_description",
        header: "Job Description",
        cell: ({ row }) => {
            const formSubmission = row.original.form_submission;
            return formSubmission?.form_description || "-";
        },
    },
    {
        accessorKey: "created_at",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Created Date
                    <ArrowDownUp className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => <div>{formatDate(row.getValue("created_at"))}</div>,
    },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => (
            <div className="flex space-x-2">
                <Link href={`/jobs/${row.getValue('id')}`} className="text-blue-500">
                    View
                </Link>
            </div>
        ),
    },
]