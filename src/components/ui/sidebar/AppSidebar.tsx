
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthState } from "@/hooks/auth";
import { Home, Link, Lock } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from "./index";

export function AppSidebar() {
  const navigate = useNavigate();
  const { user } = useAuthState();

  if (!user) return null;

  return (
    <Sidebar className="border-r border-border h-screen">
      <SidebarHeader className="p-4">
        <h2 className="text-xl font-bold">urlShort</h2>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/dashboard")}>
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/unlockers")}>
                  <Lock className="h-5 w-5" />
                  <span>URL Unlockers</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              <SidebarMenuItem>
                <SidebarMenuButton onClick={() => navigate("/biocard")}>
                  <Link className="h-5 w-5" />
                  <span>Bio Cards</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4 text-xs text-gray-500">
        © {new Date().getFullYear()} urlShort
      </SidebarFooter>
    </Sidebar>
  );
}
