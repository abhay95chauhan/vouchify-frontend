'use client';
import React, { Suspense, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { EmailTemplate } from '../../model-interface/interfaces';
import EmailTemplateEditor from './email-editor';
import { Button } from '@/components/ui/button';
import { Mail, Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import { getAllEmailTemplatesAction } from '../../actions-services/actions';
import EmailTemplateCardSkeleton from './template-card-skeleton';
import DataNotFound from '@/global/components/data-not-found/data-not-found';
import { errorMessages } from '@/global/utils/error-message';
import { useQuery } from '@/hooks/use-query';

const TemplateCard = React.lazy(() => import('./template-card'));

export default function EmailTemplateGallery() {
  const { query, setQuery, queryString } = useQuery();

  const dispatch = useAppDispatch();
  const { emailTemplates } = useAppSelector((state) => state.organization);

  const [active, setActive] = useState<EmailTemplate | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllEmailTemplatesAction(queryString));
  }, [dispatch, queryString]);

  const handlePreview = (t: EmailTemplate) => {
    setActive(t);
    setOpen(true);
  };

  const onClose = () => {
    setActive(null);
    setOpen(false);
    dispatch(getAllEmailTemplatesAction());
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex items-center gap-2'>
          <Input
            placeholder='Search For Templates…'
            value={query.search}
            onChange={(e) =>
              setQuery((prev) => ({ ...prev, search: e.target.value }))
            }
            className='w-72'
          />
        </div>

        <Button>
          <Plus /> New Template
        </Button>
      </div>

      <Separator />

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {emailTemplates?.length ? (
          emailTemplates?.map((t) => (
            <Suspense key={t.id} fallback={<EmailTemplateCardSkeleton />}>
              <TemplateCard t={t} onPreview={handlePreview} />
            </Suspense>
          ))
        ) : (
          <div className='col-span-full rounded-2xl border p-10 text-center text-muted-foreground'>
            <DataNotFound
              MainIcon={<Mail className='text-primary' size={150} />}
              title={errorMessages.email.notFound.title}
              description={errorMessages.email.notFound.desc}
              primaryAction={{
                label: errorMessages.email.notFound.btnLabel,
                btnClick: () => {
                  console.log('new temp');
                },
              }}
            />
          </div>
        )}
      </div>

      {/* <PreviewDialog open={open} onOpenChange={setOpen} template={active} /> */}
      {active && (
        <EmailTemplateEditor
          showModal={open}
          onCloseModal={onClose}
          template={active as EmailTemplate}
        />
      )}
    </div>
  );
}
