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
        <Link href={attachment} target="_blank">
            {attachmentType?.startsWith('image/')? (
                <img src={attachment} width={200} height={200} alt="Attachment" />
            ) : (
                <span className="text-blue-500">View</span>
            )}
        </Link>
    )
}

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
    { accessorKey: "project_name", header: "Project Name" },
    { accessorKey: "project_type", header: "Project Type" },
    { accessorKey: "industry", header: "Industry" },
    { accessorKey: "project_goals", header: "Goals" },
    { accessorKey: "timeline", header: "Timeline" },
    { accessorKey: "budget", header: "Budget" },
    { accessorKey: "contact_preference", header: "Contact Preference" },
    { accessorKey: "attachment", header: "Attachment", cell: renderAttachment, },
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
    { accessorKey: "add_on_to_configure", header: "Add-on to Configure" },
    { accessorKey: "objective", header: "Objective" },
    { accessorKey: "current_setup_status", header: "Setup Status" },
    { accessorKey: "integration_needs", header: "Integration Needs" },
    { accessorKey: "smartsheet_plan", header: "Smartsheet Plan" },
    {
        accessorKey: "start_date",
        header: "Start Date",
        cell: ({ row }) => formatDate(row.getValue("start_date"))
    },
    { accessorKey: "instruction", header: "Instructions" },
    { accessorKey: "contact_preference", header: "Contact Preference" },
    { accessorKey: "attachment", header: "Attachment", cell: renderAttachment, },
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
    { accessorKey: "target_application", header: "Target App" },
    { accessorKey: "integration_objective", header: "Objective" },
    { accessorKey: "timeline", header: "Timeline" },
    { accessorKey: "budget", header: "Budget" },
    { accessorKey: "instructions", header: "Instructions" },
    { accessorKey: "attachment", header: "Attachment", cell: renderAttachment, },
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
    { accessorKey: "requirements", header: "Requirements" },
    { accessorKey: "is_full_time", header: "Full Time", cell: ({ row }) => <Badge>{row.getValue("is_full_time") ? "Yes" : "No"}</Badge> },
    { accessorKey: "project_scope", header: "Scope" },
    { accessorKey: "expected_duration", header: "Duration" },
    { accessorKey: "domain_focus", header: "Domain" },
    { accessorKey: "start_date", header: "Start Date", cell: ({ row }) => formatDate(row.getValue("start_date")) },
    { accessorKey: "attachment", header: "Attachment", cell: renderAttachment, },
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
    { accessorKey: "company_name", header: "Company" },
    { accessorKey: "number_of_users", header: "Users" },
    { accessorKey: "type_of_support", header: "Support Type" },
    { accessorKey: "start_date", header: "Start Date", cell: ({ row }) => formatDate(row.getValue("start_date")) },
    { accessorKey: "budget", header: "Budget" },
    { accessorKey: "support_needs", header: "Support Needs" },
    { accessorKey: "contact_preference", header: "Contact" },
    { accessorKey: "attachment", header: "Attachment", cell: renderAttachment, },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => <Link href={`/forms/details/${row.original.form_submission_id}-ADM`} className="text-blue-500">View</Link>,
    }
];

export const ReportsDashboardColumns = [
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <Link href={`/dashboard/users/${row.original.user?.id}`} className="text-blue-500">{row.original.user?.name}</Link>,
    },
    { accessorKey: "request_type", header: "Request Type" },
    { accessorKey: "requirements", header: "Requirements" },
    { accessorKey: "attachment", header: "Attachment", cell: renderAttachment, },
    { accessorKey: "timeline", header: "Timeline" },
    { accessorKey: "instructions", header: "Instructions" },
    { accessorKey: "contact_preference", header: "Contact Preference" },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => <Link href={`/forms/details/${row.original.form_submission_id}-REP`} className="text-blue-500">View</Link>,
    }
];

export const BookOneOnOneColumns = [
    {
        accessorKey: "user",
        header: "User",
        cell: ({ row }) => <Link href={`/dashboard/users/${row.original.user?.id}`} className="text-blue-500">{row.original.user?.name}</Link>,
    },
    { accessorKey: "consultation_focus", header: "Focus" },
    { accessorKey: "time_slot", header: "Time Slot" },
    { accessorKey: "time_zone", header: "Time Zone" },
    { accessorKey: "preferred_meeting_platform", header: "Platform" },
    { accessorKey: "full_name", header: "Name" },
    { accessorKey: "company_name", header: "Company" },
    { accessorKey: "business_email", header: "Email" },
    { accessorKey: "phone_number", header: "Phone" },
    { accessorKey: "agenda", header: "Agenda" },
    { accessorKey: "attachment", header: "Attachment", cell: renderAttachment, },
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
    { accessorKey: "service_type", header: "Service Type" },
    { accessorKey: "industry", header: "Industry" },
    { accessorKey: "project_details", header: "Details" },
{
    accessorKey: "expected_projects",
    header: ({ column }) => {
        return (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                Expected Projects
                <ArrowDownUp className="ml-2 h-4 w-4" />
            </Button>
        )
    },
},
    { accessorKey: "smartsheet_admin_access", header: "Admin Access" },
    { accessorKey: "current_setup", header: "Setup Status", cell: ({ row }) => <Badge>{row.getValue("current_setup") ? "Yes" : "No"}</Badge> },
    { accessorKey: "timeline", header: "Timeline" },
    { accessorKey: "contact_preference", header: "Contact" },
    { accessorKey: "attachment", header: "Attachment", cell: renderAttachment, },
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
    { accessorKey: "name", header: "Name" },
    { accessorKey: "company_email", header: "Email" },
    { accessorKey: "license_type", header: "License Type" },
    { accessorKey: "premium_add_ons", header: "Premium Add-ons" },
    { accessorKey: "instructions", header: "Instructions" },
    { accessorKey: "number_of_licenses", header: "Qty" },
    { accessorKey: "attachment", header: "Attachment", cell: renderAttachment, },
    {
        id: "action",
        header: "Action",
        cell: ({ row }) => <Link href={`/forms/details/${row.original.form_submission_id}-LIR`} className="text-blue-500">View</Link>,
    }
];
