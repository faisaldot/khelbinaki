import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router";
import { authStore } from "../Store/auth";
import type { User } from "../types/api.types";


interface ProtectedRouteProps {
	children: ReactNode;
	requiredRole?: User["role"];
	redirectTo?: string;
}

export default function ProtectedRoute({
	children,
	requiredRole,
	redirectTo = "/",
}: ProtectedRouteProps) {
	const { user, isAuthenticated } = authStore();
	console.log(isAuthenticated,requiredRole);
	const location = useLocation();
	
	console.log(user);
	if (!isAuthenticated) {
		return <Navigate to={redirectTo} state={{ from: location }} replace />;
	}

	if (requiredRole && user?.role !== requiredRole) {
		return <Navigate to="/unauthorized" state={{ from: location }} replace />;
	}

	return <>{children}</>;
}
