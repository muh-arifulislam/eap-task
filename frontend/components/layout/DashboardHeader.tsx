/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { useActivities } from "@/hooks/userActivity";

interface Activity {
  _id: string;
  message: string;
  createdAt: string;
}

export function DashboardHeader() {
  const router = useRouter();

  const { data: activities } = useActivities();

  const [hasNewActivity, setHasNewActivity] = useState(false);

  const lastSeenRef = useRef<string | null>(null);

  // Detect new activity
  useEffect(() => {
    if (!activities?.length) return;

    const newest = activities[0]._id;

    if (lastSeenRef.current && newest !== lastSeenRef.current) {
      setHasNewActivity(true);
    }

    if (!lastSeenRef.current) {
      lastSeenRef.current = newest;
    }
  }, [activities]);

  // When bell opens
  const openBell = () => {
    if (activities?.length) {
      lastSeenRef.current = activities[0]._id;
    }
    setHasNewActivity(false);
  };

  // Logout
  const handleLogout = () => {
    Cookies.remove("access_token", { path: "/" });
    router.push("/login");
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 sticky top-0 bg-background z-10">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
      </div>

      <div className="flex items-center gap-4">
        {/* 🔔 Notification Bell */}
        <DropdownMenu onOpenChange={(open) => open && openBell()}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
              <Bell
                className={`h-5 w-5 ${
                  hasNewActivity ? "animate-bounce text-yellow-500" : ""
                }`}
              />

              {hasNewActivity && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-80" align="end">
            <DropdownMenuLabel>Recent Activity</DropdownMenuLabel>

            <DropdownMenuSeparator />

            {activities?.length ? (
              activities.map((activity: Activity) => (
                <DropdownMenuItem
                  key={activity._id}
                  className="flex flex-col items-start gap-1"
                >
                  <span className="text-sm">{activity.message}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(activity.createdAt)}
                  </span>
                </DropdownMenuItem>
              ))
            ) : (
              <DropdownMenuItem>No activity yet</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* 👤 Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { SidebarTrigger } from "@/components/ui/sidebar";
// import { Separator } from "@/components/ui/separator";

// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { LogOut, User, Bell } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import Cookies from "js-cookie"; // ← Make sure this is imported

// interface ProfileResponse {
//   status: boolean;
//   message: string;
//   data: {
//     id: number;
//     name: string;
//     email: string;
//     image: string | null;
//     employee_id: string;
//     role: string;
//   };
// }

// export function DashboardHeader() {
//   const router = useRouter();
//   const [profile, setProfile] = useState<ProfileResponse["data"] | null>(null);

//   // Helper to get initials (e.g., "Super Admin" -> "SA")
//   const getInitials = (name: string) => {
//     return name
//       .split(" ")
//       .map((n) => n[0])
//       .join("")
//       .toUpperCase()
//       .substring(0, 2);
//   };

//   // Logout function
//   const handleLogout = () => {
//     // Remove access token cookie
//     Cookies.remove("access_token", { path: "/" });

//     // Redirect to login page
//     router.push("/login");
//   };

//   return (
//     <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 sticky top-0 bg-background z-10">
//       <div className="flex items-center gap-2">
//         <SidebarTrigger className="-ml-1" />
//         <Separator orientation="vertical" className="mr-2 h-4" />
//       </div>

//       <div className="flex items-center gap-4">
//         <Button variant="ghost" size="icon" className="relative">
//           <Bell className="h-5 w-5" />
//           <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-background"></span>
//         </Button>

//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="relative h-8 w-8 rounded-full">
//               <Avatar className="h-8 w-8">
//                 <AvatarImage
//                   src={profile?.image || ""}
//                   alt={profile?.name || "User"}
//                 />
//                 <AvatarFallback>
//                   {profile?.name ? getInitials(profile.name) : "AD"}
//                 </AvatarFallback>
//               </Avatar>
//             </Button>
//           </DropdownMenuTrigger>

//           <DropdownMenuContent className="w-56" align="end" forceMount>
//             <DropdownMenuLabel className="font-normal">
//               <div className="flex flex-col space-y-1">
//                 <p className="text-sm font-medium leading-none">
//                   {profile?.name || "Admin User"}
//                 </p>
//                 <p className="text-xs leading-none text-muted-foreground">
//                   {profile?.email || "admin@gmail.com"}
//                 </p>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />

//             <DropdownMenuItem onClick={() => router.push("/dashboard/profile")}>
//               <User className="mr-2 h-4 w-4" />
//               <span>Profile</span>
//             </DropdownMenuItem>

//             <DropdownMenuSeparator />

//             {/* ✅ Log out hooked up */}
//             <DropdownMenuItem
//               className="text-red-600 focus:text-red-600 cursor-pointer"
//               onClick={handleLogout}
//             >
//               <LogOut className="mr-2 h-4 w-4" />
//               <span>Log out</span>
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </div>
//     </header>
//   );
// }
