import { Bell, Bot, User, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";

import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@/context/authContext";

const TopNavbar = () => {

  const { setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    // Remove stored authentication data
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");

    // Update auth state
    setIsLoggedIn(false);

    // Redirect to signin page
    navigate("/auth");
  };

  return (
    <header className="h-14 border-b border-border bg-card/30 backdrop-blur-md flex items-center justify-between px-6">

      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-secondary/50 border border-border rounded-md px-3 py-1.5 w-72">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search zones, sensors..."
          className="bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none w-full"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-1">

        {/* AI Button */}
        <button className="relative h-9 w-9 rounded-md flex items-center justify-center hover:bg-secondary transition-colors group">
          <Bot className="h-4.5 w-4.5 text-muted-foreground group-hover:text-primary transition-colors" />
          <span className="absolute -top-0.5 -right-0.5 text-[9px] bg-primary text-primary-foreground rounded px-1 font-bold">
            AI
          </span>
        </button>

        {/* Notification Button */}
        <button className="relative h-9 w-9 rounded-md flex items-center justify-center hover:bg-secondary transition-colors group">
          <Bell className="h-4.5 w-4.5 text-muted-foreground group-hover:text-foreground transition-colors" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-accent" />
        </button>

        <div className="w-px h-6 bg-border mx-2" />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-secondary transition-colors">

              <div className="h-7 w-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                <User className="h-3.5 w-3.5 text-primary" />
              </div>

              <span className="text-sm text-foreground hidden sm:block">
                {user?.fullName || "User"}
              </span>

            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">

            <DropdownMenuItem onClick={() => navigate("/")}
              className="cursor-pointer">
              Profile
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => navigate("/setup")}
              className="cursor-pointer"
            >
              Settings
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 cursor-pointer"
            >
              Logout
            </DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </header>
  );
};

export default TopNavbar;