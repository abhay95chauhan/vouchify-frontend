import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AlertTriangle, Trash2 } from 'lucide-react';
import React from 'react';

const DeleteOrganization = () => {
  return (
    <>
      <Card className='border-destructive'>
        <CardHeader>
          <CardTitle className='text-destructive flex items-center'>
            <AlertTriangle className='mr-2 h-5 w-5' />
            Danger Zone
          </CardTitle>
          <CardDescription>
            Irreversible and destructive actions for your organization
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='space-y-4'>
            <div className='flex items-center justify-between p-4 border border-destructive rounded-lg'>
              <div>
                <h3 className='font-semibold text-destructive'>
                  Delete Organization
                </h3>
                <p className='text-sm text-muted-foreground'>
                  Permanently delete this organization and all its data
                </p>
              </div>
              <Button variant='destructive'>
                <Trash2 className='mr-2 h-4 w-4' />
                Delete Organization
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default DeleteOrganization;
