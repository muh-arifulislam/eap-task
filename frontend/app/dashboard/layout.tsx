import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import Breadcrumbs from "@/components/Breadcrumbs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 md:p-6 border m-4 md:m-6 rounded-lg bg-sidebar shadow-xs">
          <Breadcrumbs />
          <div>{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
