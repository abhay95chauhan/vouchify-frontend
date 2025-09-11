'use client';
import CardComponent from '@/global/components/card/card-component';
import { Typography } from '@/global/components/typography/typography';
import { Clock, Eye, Mail, MoreVertical, Pen, Tag, Trash } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { IEmailTemplate } from '../model-interfaces/interfaces';
import { useState } from 'react';
import AlertModal from '@/global/components/modal/alert-modal';
import { errorMessages } from '@/global/utils/error-message';
import { deleteEmailTemplatesService } from '../actions/services';
import { useAppDispatch } from '@/redux/hook';
import { getAllEmailTemplatesAction } from '../actions/actions';
import CreateEmailTemplate from '../views/create-email-template';
import { toast } from 'sonner';
import CustomDropdown from '@/global/components/drop-down/custom-dropdown';
import SendEmailToRecipients from '../../smtp/components/send-email-to-recipients';
import { sendEmailTemplateMailService } from '../../smtp/actions/services';

interface IProps {
  t: IEmailTemplate;
  onPreview: (t: IEmailTemplate) => void;
}

export default function TemplateCard({ t, onPreview }: IProps) {
  const dispatch = useAppDispatch();

  const [state, setState] = useState({
    showEmailTemplateDeleteModal: false,
    showEmailTemplateEditModal: false,
    showSendTestEmailModal: false,
  });

  const onCloseModal = () => {
    setState((prev) => ({
      ...prev,
      showEmailTemplateDeleteModal: false,
      showEmailTemplateEditModal: false,
      showSendTestEmailModal: false,
    }));
  };

  const deleteEmailTempalte = async () => {
    const res = await deleteEmailTemplatesService(t.id);
    if (res?.error) {
      toast.error(res?.error?.message);
    } else {
      toast.success(res?.message);
    }
    dispatch(getAllEmailTemplatesAction());
    onCloseModal();
  };

  const threeDotMenu = [
    {
      label: 'Edit',
      icon: <Pen />,
      fn: async () => {
        setState((prev) => ({
          ...prev,
          showEmailTemplateEditModal: true,
        }));
      },
    },
    {
      label: 'Test Mail',
      icon: <Mail />,
      fn: async () => {
        setState((prev) => ({
          ...prev,
          showSendTestEmailModal: true,
        }));
      },
    },
  ];

  const sendTestMail = async (emails: string) => {
    const res = await sendEmailTemplateMailService({
      templateId: t.id,
      email: emails,
    });
    if (res?.error) {
      toast.error(res?.error?.message);
    } else {
      toast.success(res?.message);
    }
  };

  return (
    <CardComponent>
      <div className='space-y-4'>
        <div className='flex items-center justify-between gap-2'>
          <div className='min-w-0 space-y-4'>
            <Typography.H3 className='truncate text-base font-semibold'>
              {t.name}
            </Typography.H3>
          </div>
          <div className='flex items-center gap-2'>
            {t.category && (
              <Badge variant='secondary' className='gap-1'>
                <Tag className='h-3.5 w-3.5' /> {t.category}
              </Badge>
            )}
            <CustomDropdown menu={threeDotMenu} label='Actions'>
              <Button variant='ghost'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </CustomDropdown>
            {/* <Button
              size={'icon'}
              variant={'outline'}
              onClick={() =>
                setState((prev) => ({
                  ...prev,
                  showEmailTemplateEditModal: true,
                }))
              }
            >
              <Pen />
            </Button> */}
          </div>
        </div>
        <div className='mt-1 flex items-center gap-2 text-xs text-muted-foreground'>
          <Mail className='h-3.5 w-3.5' />
          <span className='truncate'>{t.subject}</span>
        </div>
        <div className='flex items-center gap-2'>
          <Clock className='h-3.5 w-3.5 text-muted-foreground' />
          <Typography.Muted>{moment(t.updated_at).fromNow()}</Typography.Muted>
        </div>

        <div className='relative h-40 w-full overflow-hidden rounded-xl border bg-background'>
          <div
            className='origin-top-left scale-[0.35] transform'
            style={{ width: 850, height: 600 }}
          >
            <div
              className='bg-white text-black'
              dangerouslySetInnerHTML={{ __html: t.html }}
            />
          </div>
          {/* subtle gradient fade */}
          <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60' />
        </div>
        <div className='mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2'>
          <Button
            variant='destructive'
            className='w-full'
            onClick={() =>
              setState((prev) => ({
                ...prev,
                showEmailTemplateDeleteModal: true,
              }))
            }
          >
            <Trash className='h-4 w-4' /> Delete
          </Button>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => onPreview(t)}
          >
            <Eye className='h-4 w-4' /> Edit HTML
          </Button>
        </div>
      </div>

      {/* Delete */}
      {state.showEmailTemplateDeleteModal && (
        <AlertModal
          deleteFn={deleteEmailTempalte}
          showModal={state.showEmailTemplateDeleteModal}
          onClose={onCloseModal}
          btnTitle='Delete'
          subTitle={errorMessages.email.delete}
        />
      )}

      <CreateEmailTemplate
        template={t}
        showModal={state.showEmailTemplateEditModal}
        closeModal={onCloseModal}
      />

      {/* send test mail */}
      <SendEmailToRecipients
        title='Test Mail'
        showModal={state.showSendTestEmailModal}
        closeModal={onCloseModal}
        onSave={sendTestMail}
      />
    </CardComponent>
  );
}
