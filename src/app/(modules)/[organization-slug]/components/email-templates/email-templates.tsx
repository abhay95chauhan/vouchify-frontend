'use client';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { EmailTemplate } from '../../model-interface/interfaces';
import EmailTemplateEditor from './email-editor';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/redux/hook';
import TemplateNotFound from './template-not-found';
import { getAllEmailTemplatesAction } from '../../actions-services/actions';
import EmailTemplateCardSkeleton from './template-card-skeleton';

const TemplateCard = React.lazy(() => import('./template-card'));

export default function EmailTemplateGallery() {
  const dispatch = useAppDispatch();
  const { emailTemplates } = useAppSelector((state) => state.organization);

  const [query, setQuery] = useState('');
  const [active, setActive] = useState<EmailTemplate | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllEmailTemplatesAction());
  }, [dispatch]);

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return emailTemplates.filter((t) => {
      const inText =
        t.name.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q);
      return inText;
    });
  }, [emailTemplates, query]);

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
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='w-72'
          />
        </div>
        <div className='flex items-center gap-3'>
          <div className='text-sm text-muted-foreground'>
            {filtered?.length} / {emailTemplates?.length} shown
          </div>
          <Button>
            <Plus /> New Template
          </Button>
        </div>
      </div>

      <Separator />

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {filtered?.length ? (
          filtered?.map((t) => (
            <Suspense key={t.id} fallback={<EmailTemplateCardSkeleton />}>
              <TemplateCard t={t} onPreview={handlePreview} />
            </Suspense>
          ))
        ) : (
          <div className='col-span-full rounded-2xl border p-10 text-center text-muted-foreground'>
            <TemplateNotFound />
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
