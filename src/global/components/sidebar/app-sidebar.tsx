'use client';

import * as React from 'react';
import { Building2, LayoutDashboard, Ticket, TicketCheck } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import LogoSidebar from '../logo/logo-sidebar';
import { useAppSelector } from '@/redux/hook';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.user);

  const data = {
    navMain: [
      {
        title: 'Dashboard',
        url: '/dashboard',
        icon: LayoutDashboard,
      },
      {
        title: 'Vouchers',
        url: '/vouchers',
        icon: Ticket,
      },
      // {
      //   title: 'Gift Cards',
      //   url: '/gift-cards',
      //   icon: Gift,
      // },
      {
        title: 'Redemptions',
        url: '/redeem-vouchers',
        icon: TicketCheck,
      },
      {
        title: user.organization?.name,
        url: `/${user.organization?.slug}`,
        icon: Building2,
      },
    ],
  };

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <div className='my-2'>
          <LogoSidebar />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
