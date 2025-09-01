import CardComponent from '@/global/components/card/card-component';
import { Typography } from '@/global/components/typography/typography';
import { Clock, Eye, Mail, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import moment from 'moment';
import { Button } from '@/components/ui/button';
import { IEmailTemplate } from '../model-interfaces/interfaces';

export default function TemplateCard({
  t,
  onPreview,
}: {
  t: IEmailTemplate;
  onPreview: (t: IEmailTemplate) => void;
}) {
  return (
    <CardComponent>
      <div className='space-y-4'>
        <div className='flex items-start justify-between gap-2'>
          <div className='min-w-0 space-y-4'>
            <Typography.H3 className='truncate text-base font-semibold'>
              {t.name}
            </Typography.H3>
          </div>
          {t.category && (
            <Badge variant='secondary' className='gap-1'>
              <Tag className='h-3.5 w-3.5' /> {t.category}
            </Badge>
          )}
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
              className='w-[850px] h-[600px] bg-white text-black'
              dangerouslySetInnerHTML={{ __html: t.html }}
            />
          </div>
          {/* subtle gradient fade */}
          <div className='pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/60' />
        </div>
        <div className='mt-3 flex items-center justify-between'>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => onPreview(t)}
          >
            <Eye className='h-4 w-4' /> Edit Or Preview HTML
          </Button>
        </div>
      </div>
    </CardComponent>
  );
}
