import { Cloud, Home, BarChart, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-hot-toast';
import { useAuth } from "@/context/AuthContext"; // Importing the AuthContext
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: BarChart,
  },
  {
    title: "Forecast",
    url: "/dashboard/forecast",
    icon: Cloud,
  },
];

export function AppSidebar() {
  const navigate = useNavigate();
  const { logout } = useAuth(); // Get the logout function from context

  const handleLogout = async () => {
    try {
      await logout(); // Call logout function from context

      navigate('/login');
      toast.success('Successfully logged out');
    } catch (error) {
      console.error('Error during logout:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Atmos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center' }}>
                    <LogOut />
                    <span>Logout</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
