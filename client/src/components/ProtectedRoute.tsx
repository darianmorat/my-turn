import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate } from "react-router-dom";

type Role = "admin" | "agent" | "receptionist";

interface ProtectedRouteProps {
   children: React.ReactNode;
   allowedRoles: Role[];
}

// Helper function to get default route based on role
const getDefaultRouteForRole = (role: Role): string => {
   switch (role) {
      case "admin":
         return "/selection";
      case "agent":
         return "/modules";
      case "receptionist":
         return "/reception";
      default:
         return "/";
   }
};

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
   const { user, isLoading } = useAuthStore();

   if (isLoading) {
      return <div>Loading...</div>;
   }

   if (!user) {
      return <Navigate to="/" replace />;
   }

   // Admin has access to everything
   if (user.role === "admin") {
      return <>{children}</>;
   }

   // Check if current role is allowed
   if (!allowedRoles.includes(user.role)) {
      // Redirect to their default page
      return <Navigate to={getDefaultRouteForRole(user.role)} replace />;
   }

   return <>{children}</>;
};
