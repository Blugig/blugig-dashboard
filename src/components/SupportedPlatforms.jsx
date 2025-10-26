import Image from "next/image";

const PLATFORMS = [
    { name: "Monday.com", logo: "/services/monday.png" },
    { name: "Trello", logo: "/services/trello.png" },
    { name: "Smartsheet", logo: "/services/smartsheet.png" },
    { name: "ClickUp", logo: "/services/clickup.png" },
    { name: "Wrike", logo: "/services/wrike.png" },
    { name: "Jira", logo: "/services/jira.png" },
    { name: "Asana", logo: "/services/asana.png" },
    { name: "Notion", logo: "/services/notion.png" },
    { name: "Microsoft Project", logo: "/services/msproject.png" },
];

export default function SupportedPlatforms() {
    return (
        <div className="mt-auto pt-8 max-w-xl">
            <p className="text-white/80 text-sm italic mb-4">Supported Platforms</p>
            <div className="flex flex-wrap gap-3">
                {PLATFORMS.map((platform) => (
                    <div
                        key={platform.name}
                        className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 hover:bg-white/20 transition-colors duration-200"
                    >
                        <Image
                            src={platform.logo}
                            alt={platform.name}
                            width={20}
                            height={20}
                            className="w-6 h-6 object-contain"
                        />
                        <span className="text-white text-lg font-medium">{platform.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
