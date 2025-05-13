
import React from "react"
import { cn } from "@/lib/utils"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export interface SidebarMenuProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarMenu({ className, children, ...props }: SidebarMenuProps) {
  return (
    <div className={cn("space-y-1", className)} {...props}>
      {children}
    </div>
  )
}

export interface SidebarMenuItemProps extends React.ComponentPropsWithoutRef<typeof Link> {
  active?: boolean
  icon?: React.ReactNode
}

export function SidebarMenuItem({ className, active, icon, children, ...props }: SidebarMenuItemProps) {
  return (
    <Link
      className={cn(
        "flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors",
        active ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
        className
      )}
      {...props}
    >
      {icon && <span className="text-gray-500">{icon}</span>}
      {children}
    </Link>
  )
}

export interface SidebarMenuButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  icon?: React.ReactNode
}

export function SidebarMenuButton({ className, icon, children, ...props }: SidebarMenuButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn("flex w-full items-center justify-start gap-2 px-3 py-2", className)}
      {...props}
    >
      {icon && <span className="text-gray-500">{icon}</span>}
      {children}
    </Button>
  )
}
