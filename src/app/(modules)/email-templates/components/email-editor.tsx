'use client';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { CodeIcon, AppWindowIcon } from 'lucide-react';
import { CustomModal } from '@/global/components/modal/custom-modal';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { toast } from 'sonner';
import { updateEmailTemplatesService } from '../actions/services';
import { IEmailTemplate } from '../model-interfaces/interfaces';

export default function EmailTemplateEditor({
  template,
  showModal,
  onCloseModal,
}: {
  template: IEmailTemplate;
  showModal: boolean;
  onCloseModal: () => void;
}) {
  // Local editable state
  const [html, setHtml] = useState(template?.html || '');
  const [state, setState] = useState({
    isLoading: false,
  });

  const closeModal = () => {
    setState((prev) => ({ ...prev, isLoading: false }));
    onCloseModal();
  };

  const saveTemplate = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));
    const res = await updateEmailTemplatesService(template.id, { html });
    if (res?.error) {
      toast.error(res?.error?.message);
    } else {
      toast.success(res?.message);
    }
    onCloseModal();
  };

  return (
    <CustomModal
      title={template.name}
      loading={state.isLoading}
      showModal={showModal}
      className='w-full sm:max-w-4xl md:max-w-5xl lg:max-w-6xl xl:max-w-7xl'
      buttonLabel='Save Template'
      close={closeModal}
      save={saveTemplate}
    >
      <div className='rounded-2xl shadow-xl border bg-gradient-to-br from-indigo-50 via-white to-purple-50 overflow-hidden'>
        <Tabs defaultValue='code' className='w-full'>
          {/* Tabs header */}
          <TabsList className='flex flex-col sm:grid sm:grid-cols-2 w-full bg-white/70 backdrop-blur-md border-b'>
            <TabsTrigger
              value='code'
              className='flex gap-2 items-center text-sm font-medium data-[state=active]:text-primary'
            >
              <CodeIcon size={16} /> Code Editor
            </TabsTrigger>
            <TabsTrigger
              value='preview'
              className='flex gap-2 items-center text-sm font-medium data-[state=active]:text-primary'
            >
              <AppWindowIcon size={16} /> Live Preview
            </TabsTrigger>
          </TabsList>

          {/* Code editor */}
          <TabsContent value='code' className='p-4'>
            <div className='rounded-xl border bg-black/95 text-white overflow-hidden shadow-inner'>
              <div className='flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-gradient-to-r from-indigo-600/40 to-purple-600/40'>
                <div className='h-3 w-3 rounded-full bg-red-500' />
                <div className='h-3 w-3 rounded-full bg-yellow-400' />
                <div className='h-3 w-3 rounded-full bg-green-500' />
              </div>
              <ScrollArea className='h-[60vh] md:h-[70vh] w-full overflow-auto'>
                <Textarea
                  value={html}
                  onChange={(e) => setHtml(e.target.value)}
                  className='h-full w-full font-mono text-sm md:text-base border-none bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 resize-none'
                />
              </ScrollArea>
            </div>
          </TabsContent>

          {/* Preview */}
          <TabsContent value='preview' className='p-4 md:p-6'>
            <div className='rounded-xl border bg-white shadow-lg overflow-hidden'>
              <ScrollArea className='h-[60vh] md:h-[70vh] w-full overflow-auto'>
                <div
                  className='min-h-[600px] bg-white text-black p-4'
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </CustomModal>
  );
}
