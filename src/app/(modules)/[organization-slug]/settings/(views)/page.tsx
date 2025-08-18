import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import DeleteOrganization from '../../components/delete-organization';
import UpdateOraganization from '../../components/update-oraganization';
import BillingOrganization from '../../components/billing-organization';
import { getMyOrganizationAction } from '../../actions/actions';
import { cookies } from 'next/headers';

const OrganizationSettings = async () => {
  const jwt = (await cookies()).get('jwt')?.value;
  const { data: orgRes } = await getMyOrganizationAction(jwt);

  return (
    <div className='space-y-8 w-full'>
      <div>
        <h1 className='text-3xl font-bold tracking-tight'>{orgRes?.name}</h1>
        <p className='text-muted-foreground'>{orgRes?.description}</p>
      </div>

      <Tabs defaultValue='general' className='space-y-4 w-full'>
        <TabsList className='w-full'>
          <TabsTrigger className='cursor-pointer' value='general'>
            General
          </TabsTrigger>
          <TabsTrigger className='cursor-pointer' value='billing'>
            Billing
          </TabsTrigger>

          <TabsTrigger className='cursor-pointer' value='danger'>
            Danger Zone
          </TabsTrigger>
        </TabsList>

        <TabsContent value='general' className='space-y-4 w-full'>
          <UpdateOraganization orgData={orgRes} />
        </TabsContent>
        <TabsContent value='billing' className='space-y-4 w-full'>
          <BillingOrganization orgData={orgRes} />
        </TabsContent>
        <TabsContent value='danger' className='space-y-4'>
          <DeleteOrganization />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default OrganizationSettings;
