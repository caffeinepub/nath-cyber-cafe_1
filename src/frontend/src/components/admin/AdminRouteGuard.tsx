import { ReactNode } from 'react';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useGetCallerUserRole } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';
import { UserRole } from '../../backend';

interface AdminRouteGuardProps {
  children: ReactNode;
}

export default function AdminRouteGuard({ children }: AdminRouteGuardProps) {
  const { identity, login, loginStatus } = useInternetIdentity();
  const { data: userRole, isLoading: roleLoading } = useGetCallerUserRole();

  const isAuthenticated = !!identity;

  if (!isAuthenticated) {
    return (
      <div className="container max-w-md mx-auto py-20">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Authentication Required
            </CardTitle>
            <CardDescription>
              Please sign in with Internet Identity to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={login}
              disabled={loginStatus === 'logging-in'}
              className="w-full"
            >
              {loginStatus === 'logging-in' ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (roleLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (userRole !== UserRole.admin) {
    return (
      <div className="container max-w-md mx-auto py-20">
        <Card className="border-destructive">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Shield className="h-5 w-5" />
              Access Denied
            </CardTitle>
            <CardDescription>
              You do not have permission to access the admin dashboard. Only authorized administrators can access this area.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
