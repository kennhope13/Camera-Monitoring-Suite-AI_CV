import {
    LayoutGrid, // Dashboard
    Camera,     // Live Feeds
    BarChart,   // Analytics
    MapPin,     // Station Map
    List,       // Event Logs
    Settings,   // Settings
    HelpCircle  // Support
  } from "lucide-react"
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
  
export const Sidebar = () => {
    return (
        <aside className="inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
                {/* Dashboard */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <LayoutGrid className="h-5 w-5" />
                            <span className="sr-only">Dashboard</span>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent side="right">Dashboard</TooltipContent>
                </Tooltip>
                {/* Live Feeds */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <Camera className="h-5 w-5" />
                            <span className="sr-only">Live Feeds</span>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent side="right">Live Feeds</TooltipContent>
                </Tooltip>
                {/* Analytics */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <BarChart className="h-5 w-5" />
                            <span className="sr-only">Analytics</span>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent side="right">Analytics</TooltipContent>
                </Tooltip>
                {/* Station Map */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <MapPin className="h-5 w-5" />
                            <span className="sr-only">Station Map</span>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent side="right">Station Map</TooltipContent>
                </Tooltip>
                {/* Event Logs */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <List className="h-5 w-5" />
                            <span className="sr-only">Event Logs</span>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent side="right">Event Logs</TooltipContent>
                </Tooltip>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
                <Separator />
                {/* Settings */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <Settings className="h-5 w-5" />
                            <span className="sr-only">Settings</span>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent side="right">Settings</TooltipContent>
                </Tooltip>
                {/* Support */}
                <Tooltip>
                    <TooltipTrigger asChild>
                        <a
                            href="#"
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                        >
                            <HelpCircle className="h-5 w-5" />
                            <span className="sr-only">Support</span>
                        </a>
                    </TooltipTrigger>
                    <TooltipContent side="right">Support</TooltipContent>
                </Tooltip>
            </nav>
        </aside>
    )
}