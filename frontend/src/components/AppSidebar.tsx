import { useState } from "react";
import { Home, User, Settings, Brain, BookOpen, Users, ChevronDown, ChevronRight } from "lucide-react";
import { NavLink } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import rosieLogoUrl from "@/assets/rosie-logo.png";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Análise de Aluno", url: "/analise-aluno", icon: User },
];

const configItems = [
  { title: "Gemini", url: "/configuracoes/gemini", icon: Brain },
  { title: "Cursos", url: "/configuracoes/cursos", icon: BookOpen },
  { title: "Turmas", url: "/configuracoes/turmas", icon: Users },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const [configExpanded, setConfigExpanded] = useState(true);
  const collapsed = !open;

  return (
    <Sidebar className={`${collapsed ? "w-16" : "w-80"} transition-all duration-300`}>
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Logo Section */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img 
              src={rosieLogoUrl} 
              alt="ROSiE Logo" 
              className="w-10 h-10 rounded-lg bg-primary/10 p-1"
            />
            {!collapsed && (
              <div>
                <h1 className="font-bold text-xl text-sidebar-primary">ROSiE</h1>
                <p className="text-xs text-sidebar-foreground/70 leading-tight">
                  Reimaginar e Organizar os<br />Saberes Individuais dos Estudantes
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarMenu>
            {mainItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild size="lg">
                  <NavLink 
                    to={item.url} 
                    end 
                    className={({ isActive }) => 
                      `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive 
                          ? "bg-sidebar-primary text-sidebar-foreground shadow-primary" 
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {!collapsed && <span className="font-medium">{item.title}</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>

        {/* Configuration Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              {!collapsed && <span>Configurações</span>}
            </div>
            {!collapsed && (
              <button
                onClick={() => setConfigExpanded(!configExpanded)}
                className="opacity-70 hover:opacity-100 transition-opacity"
              >
                {configExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>
            )}
          </SidebarGroupLabel>

          {(collapsed || configExpanded) && (
            <SidebarGroupContent>
              <SidebarMenu>
                {configItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild size="lg">
                      <NavLink 
                        to={item.url}
                        className={({ isActive }) => 
                          `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                            isActive 
                              ? "bg-sidebar-primary text-sidebar-foreground shadow-primary" 
                              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          }`
                        }
                      >
                        <item.icon className="h-5 w-5" />
                        {!collapsed && <span className="font-medium">{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          )}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
