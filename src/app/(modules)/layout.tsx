import { Toaster } from 'sonner';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/global/components/sidebar/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Roboto } from 'next/font/google';
import { Suspense } from 'react';
import { Providers } from '@/redux/provider';
import { getMeUserAction } from '../auth/login/actions/actions';
import Loading from './loading';

const roboto = Roboto({
  weight: ['100', '200', '300', '400', '500', '600', '700'], // Add weights as needed
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jwt = (await cookies()).get('jwt')?.value;

  if (!jwt) {
    redirect('/auth/login');
  }
  const res = await await getMeUserAction(jwt);
  if (!res) {
    return <Loading />;
  }
  if (res?.code === 200 && !res?.data?.organization_id) {
    redirect('/');
  } else {
    if (res?.code !== 200) {
      redirect('/auth/login');
    }
  }

  return (
    <html lang='en'>
      <body className={`${roboto.variable}`} cz-shortcut-listen='true'>
        <Providers userData={res?.data}>
          <Toaster richColors />
          {!jwt ? (
            redirect('/auth/login')
          ) : (
            <SidebarProvider>
              <AppSidebar />
              <SidebarInset>
                <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12'>
                  <div className='flex items-center gap-2 px-4'>
                    <SidebarTrigger className='-ml-1' />
                    <Separator
                      orientation='vertical'
                      className='mr-2 data-[orientation=vertical]:h-4'
                    />
                    <Breadcrumb>
                      <BreadcrumbList>
                        <BreadcrumbItem className='hidden md:block'>
                          <BreadcrumbLink href='#'>
                            Building Your Application
                          </BreadcrumbLink>
                        </BreadcrumbItem>
                        <BreadcrumbSeparator className='hidden md:block' />
                        <BreadcrumbItem>
                          <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                        </BreadcrumbItem>
                      </BreadcrumbList>
                    </Breadcrumb>
                  </div>
                </header>

                <Suspense fallback={<Loading />}>
                  <div className='flex flex-1 flex-col gap-4 p-8  pt-4'>
                    {children}
                  </div>
                </Suspense>
              </SidebarInset>
            </SidebarProvider>
          )}
        </Providers>
      </body>
    </html>
  );
}
