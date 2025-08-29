import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import React from 'react';
import DeleteOrganization from '../../components/delete-organization';
import UpdateOraganization from '../../components/update-oraganization';
import BillingOrganization from '../../components/billing-organization';
import { getMyOrganizationService } from '../../actions-services/services';
import { cookies } from 'next/headers';
import ApiKey from '../../components/api-key';
import SMTPSettings from '@/app/(modules)/smtp/views/smtp-settings';
import { getMySmtpService } from '@/app/(modules)/smtp/actions/services';

const OrganizationSettings = async () => {
  const jwt = (await cookies()).get('jwt')?.value;
  const { data: orgRes } = await getMyOrganizationService(jwt);
  const { data: smtpData } = await getMySmtpService(jwt);

  return (
    <div className='space-y-8 w-full'>
      <div className='space-y-2'>
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
          <TabsTrigger className='cursor-pointer' value='api-key'>
            Api Key
          </TabsTrigger>
          <TabsTrigger className='cursor-pointer' value='smtp'>
            SMTP
          </TabsTrigger>
          <TabsTrigger className='cursor-pointer' value='danger'>
            Danger Zone
          </TabsTrigger>
        </TabsList>

        <TabsContent value='general' className='space-y-4 w-full'>
          <UpdateOraganization orgData={orgRes} />
        </TabsContent>
        <TabsContent value='api-key' className='space-y-4 w-full'>
          <ApiKey orgData={orgRes} />
        </TabsContent>
        <TabsContent value='billing' className='space-y-4 w-full'>
          <BillingOrganization orgData={orgRes} />
        </TabsContent>
        <TabsContent value='smtp' className='space-y-4 w-full'>
          <SMTPSettings smtpData={smtpData} />
        </TabsContent>
        <TabsContent value='danger' className='space-y-4'>
          <DeleteOrganization />
        </TabsContent>
      </Tabs>
    </div>
  );
};
export default OrganizationSettings;
