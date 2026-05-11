import {
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { Sidebar } from "@/components/Sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"

interface DashboardPageProps {
    children: React.ReactNode
}

export const DashboardPage = ({ children }: DashboardPageProps) => {
    return (
        <TooltipProvider>
            <ResizablePanelGroup
                direction="horizontal"
                className="h-full max-h-screen items-stretch"
            >
                <Sidebar />
                <ResizablePanel defaultSize={440}>
                    {children}
                </ResizablePanel>
            </ResizablePanelGroup>
        </TooltipProvider>
    )
}