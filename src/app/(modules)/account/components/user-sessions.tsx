'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Monitor,
  Smartphone,
  Tablet,
  Globe,
  MapPin,
  Clock,
  Shield,
  AlertTriangle,
  Loader,
  LogIn,
} from 'lucide-react';
import { Typography } from '@/global/components/typography/typography';
import { Button } from '@/components/ui/button';
import { IUserSessionGet } from '../model-interfaces/interfaces';
import moment from 'moment-timezone';
import { Label } from '@/components/ui/label';
import CardComponent from '@/global/components/card/card-component';
import { useAppSelector } from '@/redux/hook';
import { logoutService } from '@/app/auth/login/actions-services/services';
import { redirect } from 'next/navigation';
import {
  deleteUserSessionsService,
  updateUserSessionsService,
} from '../actions/services';
import { toast } from 'sonner';
import { revalidateOrganizationPage } from '../../[organization-slug]/components/revalidate-path';
import { useState } from 'react';

interface IProps {
  sessions: IUserSessionGet[];
  token: string;
}

export default function UserSessions({ sessions, token }: IProps) {
  const { user } = useAppSelector((state) => state.user);

  const [state, setState] = useState({
    isLoading: false,
  });

  const getDeviceIcon = (userAgent?: string) => {
    if (!userAgent) return <Globe className='h-5 w-5' />;

    const ua = userAgent.toLowerCase();
    if (
      ua.includes('mobile') ||
      ua.includes('android') ||
      ua.includes('iphone')
    ) {
      return <Smartphone className='h-5 w-5' />;
    }
    if (ua.includes('tablet') || ua.includes('ipad')) {
      return <Tablet className='h-5 w-5' />;
    }
    return <Monitor className='h-5 w-5' />;
  };

  const getDeviceInfo = (userAgent?: string) => {
    if (!userAgent)
      return { device: 'Unknown Device', browser: 'Unknown Browser' };

    let device = 'Desktop';
    let browser = 'Unknown Browser';

    const ua = userAgent.toLowerCase();

    // Device detection
    if (
      ua.includes('mobile') ||
      ua.includes('android') ||
      ua.includes('iphone')
    ) {
      device = 'Mobile';
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      device = 'Tablet';
    }

    // Browser detection
    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';
    else if (ua.includes('edge')) browser = 'Edge';

    return { device, browser };
  };

  const handleLogout = async (curSe: boolean, sessionId: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    if (curSe) {
      logoutService();
      redirect('/auth/login');
    } else {
      const res = await updateUserSessionsService(sessionId, {
        revoked: true,
      });
      if (res?.error) {
        toast.error(res?.error?.message);
      } else {
        toast.success(res?.message);
      }
    }
    revalidateOrganizationPage();
    setState((prev) => ({ ...prev, isLoading: false }));
  };

  const handleDeleteSession = async (sessionId: string) => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const res = await deleteUserSessionsService(sessionId);
    revalidateOrganizationPage();
    if (res?.error) {
      toast.error(res?.error?.message);
    } else {
      toast.success(res?.message);
    }
    setState((prev) => ({ ...prev, isLoading: false }));
  };

  //   const handleLogoutAll = async () => {
  //     setIsLoggingOut('all');
  //     // Simulate logout all API call
  //     await new Promise((resolve) => setTimeout(resolve, 1500));
  //     setIsLoggingOut(null);
  //     // Handle actual logout all logic here
  //   };

  return (
    <div className='py-4 space-y-8'>
      {/* Header Section */}
      <div className='space-y-2'>
        <div className='flex items-center gap-3'>
          <Shield className='h-8 w-8 text-primary' />
          <Typography.H2>Active Sessions</Typography.H2>
        </div>
        <Typography.Muted>
          Manage your account security by monitoring active sessions across all
          devices
        </Typography.Muted>
      </div>

      {/* Sessions Grid */}
      <div className='space-y-4'>
        {sessions?.length ? (
          sessions.map((session) => {
            const { device, browser } = getDeviceInfo(session.user_agent);
            const isCurrentSession = token === session.token;
            let isExpiringSoon = false;
            let isExpired = false;

            if (user?.organization?.timezone) {
              const now = moment().tz(user.organization.timezone);
              const expiry = moment(session.expires_at).tz(
                user.organization.timezone
              );

              isExpired = expiry?.isBefore(now); // already expired
              isExpiringSoon =
                !isExpired && expiry?.isBefore(now.clone()?.add(24, 'hours'));
              // only true if not expired but will expire in < 24h
            }
            return (
              <Card
                key={session.id}
                className='group hover:shadow-lg transition-all duration-300 border-2 hover:border-primary/20'
              >
                <CardHeader className='pb-4'>
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center gap-4'>
                      <div className='p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors'>
                        {getDeviceIcon(session.user_agent)}
                      </div>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                          <Typography.H3 className='font-semibold text-lg'>
                            {device}
                          </Typography.H3>
                          {isCurrentSession && (
                            <Badge
                              variant='secondary'
                              className='bg-accent/20 text-accent-foreground'
                            >
                              Current Session
                            </Badge>
                          )}
                          {isExpiringSoon && (
                            <Badge
                              variant='outline'
                              className='border-amber-200 text-amber-700 bg-amber-50'
                            >
                              <AlertTriangle className='h-3 w-3 mr-1' />
                              Expires Soon
                            </Badge>
                          )}
                          {isExpired && (
                            <Badge
                              variant='destructive'
                              className='border-destructive-200 text-destructive bg-destructive-50'
                            >
                              <AlertTriangle className='h-3 w-3 mr-1' />
                              Expired
                            </Badge>
                          )}
                        </div>
                        <Typography.Muted>{browser}</Typography.Muted>
                      </div>
                    </div>
                    <div className='space-x-2'>
                      <Button
                        variant={'outline'}
                        onClick={() =>
                          handleLogout(isCurrentSession, session.id)
                        }
                      >
                        {state.isLoading ? (
                          <Loader className='animate-spin' />
                        ) : (
                          <LogIn />
                        )}
                        End Session
                      </Button>
                      {(session.revoked || isExpired) && (
                        <Button
                          variant={'destructive'}
                          onClick={() => handleDeleteSession(session.id)}
                        >
                          {' '}
                          {state.isLoading && (
                            <Loader className='animate-spin' />
                          )}
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className='pt-0'>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-4 text-sm'>
                    <div className='flex items-center gap-2'>
                      <MapPin className='h-4 w-4' />
                      <Label className='font-medium'>IP Address:</Label>
                      <Typography.Muted className='font-mono'>
                        {session.ip_address || 'Unknown'}
                      </Typography.Muted>
                    </div>

                    <div className='flex items-center gap-2'>
                      <Clock className='h-4 w-4' />
                      <Label>Logged In At -</Label>
                      <Typography.Muted>
                        {moment(session.created_at).format('lll')}
                      </Typography.Muted>
                    </div>

                    <div className='flex items-center gap-2  '>
                      <Shield className='h-4 w-4' />
                      <Label className='font-medium'>Expires:</Label>
                      <Typography.Muted
                        className={
                          isExpiringSoon ? 'text-amber-600 font-medium' : ''
                        }
                      >
                        {moment(session.expires_at).format('lll')}
                      </Typography.Muted>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        ) : (
          <CardComponent cardContentClass='text-center py-8 space-y-4'>
            <Shield className='h-16 w-16 mx-auto text-muted-foreground' />
            <Typography.H3>No Active Sessions</Typography.H3>
            <Typography.Muted>
              You don&apos;t have any Active Sessions at the moment.
            </Typography.Muted>
          </CardComponent>
        )}
      </div>
    </div>
  );
}
