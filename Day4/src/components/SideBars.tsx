import { SidebarProvider,Sidebar, SidebarHeader, SidebarContent, SidebarGroup } from "./ui/sidebar";

export const Sidebars=()=>{
    return(

        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>Hello</SidebarHeader>
                <SidebarContent>
                    <SidebarContent>
                        <SidebarGroup>
                            
                        </SidebarGroup>
                    </SidebarContent>
                </SidebarContent>
            </Sidebar>
        </SidebarProvider>
    );
}