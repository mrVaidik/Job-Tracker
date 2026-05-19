"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Plus,
  Calendar,
  Target,
  LogOut,
  ChevronLeft,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WeeklyGoalWidget } from "./weeklyGoal";
import { useJobSearch } from "@/context/jobSearchContext";
import { logout } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/applications", label: "Applications", icon: Briefcase },
  { href: "/add", label: "Add Application", icon: Plus },
  { href: "/interviews", label: "Interviews", icon: Calendar },
];

export function Sidebar() {
  const pathname = usePathname();
  const { weeklyGoal, goalProgress } = useJobSearch();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {}
      <aside
        className={cn(
          "hidden md:flex flex-col fixed inset-y-0 left-0 z-30 bg-card border-r shadow-sm transition-all duration-300",
          collapsed ? "w-20" : "w-72",
        )}
      >
        {}
        <div
          className={cn(
            "flex items-center h-16 px-4 border-b",
            collapsed ? "justify-center" : "justify-between",
          )}
        >
          {!collapsed && (
            <div className="flex items-center gap-2">
              <Target className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                Job Tracker
              </h1>
            </div>
          )}
        </div>

        {}
        <ScrollArea className="flex-1 py-6">
          <nav className="space-y-1 px-3">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    collapsed && "justify-center px-2",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {!collapsed && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {}
        <div className="border-t p-4 space-y-4">
          {!collapsed && (
            <>
              <Separator />
              <WeeklyGoalWidget goal={weeklyGoal} progress={goalProgress} />
              <Separator />
            </>
          )}
          {collapsed && (
            <div className="flex justify-center">
              <WeeklyGoalWidget goal={weeklyGoal} progress={goalProgress} />
            </div>
          )}
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className={cn(
              "w-full text-muted-foreground hover:text-destructive",
              collapsed ? "justify-center" : "justify-start gap-2",
            )}
            onClick={() => logout()}
          >
            <LogOut className="h-4 w-4" />
            {!collapsed && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t bg-card shadow-lg z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs transition-all",
                  isActive
                    ? "text-primary font-semibold"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>

      {}
      <div className="md:hidden h-16" />
    </>
  );
}
