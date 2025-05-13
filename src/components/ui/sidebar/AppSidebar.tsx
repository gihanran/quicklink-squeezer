
import React from "react";
import { useLocation } from "react-router-dom";
import {
  Link2,
  LayoutDashboard,
  Unlock,
  User,
  CreditCard
} from "lucide-react";

import { Sidebar } from "./sidebar";
import { 
  SidebarContent, 
  SidebarHeader,
  SidebarFooter
} from "./sidebar-content";
import { 
  SidebarMenu, 
  SidebarMenuItem 
} from "./sidebar-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "./sidebar-group";

export function AppSidebar() {
  const location = useLocation();
  const path = location.pathname;

  return (
    <Sidebar>
      <SidebarHeader className="border-b py-3 px-4">
        <div className="font-bold text-lg">ShortR</div>
      </SidebarHeader>
      <SidebarContent className="flex flex-col flex-grow">
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem 
              to="/dashboard" 
              active={path === "/dashboard"}
              icon={<LayoutDashboard size={18} />}
            >
              Dashboard
            </SidebarMenuItem>
            <SidebarMenuItem 
              to="/unlockers" 
              active={path.includes("/unlocker")}
              icon={<Unlock size={18} />}
            >
              URL Unlockers
            </SidebarMenuItem>
            <SidebarMenuItem 
              to="/biocard" 
              active={path.includes("/biocard")}
              icon={<Link2 size={18} />}
            >
              Bio Cards
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Account</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem 
              to="/profile" 
              active={path === "/profile"}
              icon={<User size={18} />}
            >
              Profile
            </SidebarMenuItem>
            <SidebarMenuItem 
              to="/billing" 
              active={path === "/billing"}
              icon={<CreditCard size={18} />}
            >
              Billing
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t py-2 px-4 text-xs text-gray-500">
        © 2025 ShortR
      </SidebarFooter>
    </Sidebar>
  );
}
