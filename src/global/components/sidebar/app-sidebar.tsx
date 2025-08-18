'use client';

import * as React from 'react';
import { Bot, Settings2, SquareTerminal } from 'lucide-react';

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

// This is sample data.
const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '',
  },

  navMain: [
    {
      title: 'Dashboard',
      url: '#',
      icon: SquareTerminal,
      isActive: true,
    },
    {
      title: 'Vouchers',
      url: '#',
      icon: Bot,
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAppSelector((state) => state.user);
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
