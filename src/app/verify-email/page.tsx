import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Mail, RefreshCw, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getMeUserService } from '../auth/login/actions-services/services';
import { Typography } from '@/global/components/typography/typography';

export default async function VerifyEmailPage() {
  const jwt = (await cookies()).get('jwt')?.value;

  if (!jwt) {
    redirect('/auth/login');
  }

  const res = await getMeUserService(jwt);

  if (
    res?.code === 200 &&
    res?.data?.organization_id &&
    res?.data?.is_email_varified
  ) {
    redirect('/dashboard');
  } else {
    if (res?.error?.code === 401) {
      redirect('/auth/login');
    }
  }

  // const resendEmail = () => {
  //   setTimeout(() => {
  //     return true;
  //   }, 2000);
  // };
  return (
    <div
      className='flex items-center justify-center min-h-screen'
      style={{
        background: `linear-gradient(
          90deg,
          oklch(0.92 0.05 280),
          oklch(0.95 0.03 340)
        )`,
        padding: '2rem',
      }}
    >
      <div className='absolute inset-0' />
      <div className='relative w-full max-w-md'>
        <Card className='backdrop-blur-sm bg-card/95 border-border/50 shadow-2xl shadow-primary/5'>
          <CardHeader className='text-center pt-4'>
            <div className='mx-auto mb-6 relative'>
              <div className='flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/25'>
                <Mail className='h-8 w-8 text-primary-foreground' />
              </div>
              <div className='absolute -top-1 -right-1 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center shadow-sm'>
                <CheckCircle className='h-4 w-4 text-white' />
              </div>
            </div>

            <CardTitle className='text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-3'>
              Check Your Email
            </CardTitle>
            <CardDescription className='text-muted-foreground text-base leading-relaxed px-2'>
              We&apos;ve sent a secure verification link to your email address.
              Please check your inbox to continue.
            </CardDescription>
          </CardHeader>

          <CardContent className='space-y-6'>
            {true && (
              <div className='rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 p-5 border border-green-200/50 dark:border-green-800/30'>
                <div className='flex items-start space-x-4'>
                  <div className='flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center'>
                    <CheckCircle className='h-5 w-5 text-green-600 dark:text-green-400' />
                  </div>
                  <div className='flex-1 min-w-0'>
                    <Typography.H3 className='font-semibold text-green-900 dark:text-green-100 text-sm'>
                      Verification email sent successfully
                    </Typography.H3>
                    <Typography.P className='text-green-700 dark:text-green-300 text-sm mt-1 leading-relaxed'>
                      Click the secure link in your email to activate your
                      account and get started.
                    </Typography.P>
                  </div>
                </div>
              </div>
            )}

            <div className='text-center space-y-5'>
              <Typography.P className='text-sm text-muted-foreground leading-relaxed'>
                Didn&apos;t receive the email? Check your spam folder or request
                a new one below.
              </Typography.P>

              <Button className='w-full'>
                <RefreshCw className='h-4 w-4 mr-2' />
                Resend Verification Email
              </Button>

              <div className='pt-6 border-t border-border/50'>
                <Link href='/auth/login' className='block'>
                  <Button
                    variant='ghost'
                    className='w-full h-12 hover:bg-muted/50 transition-all duration-200 font-medium text-muted-foreground hover:text-foreground'
                  >
                    <ArrowLeft className='h-4 w-4 mr-2' />
                    Back to Login
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className='text-center mt-8'>
          <p className='text-xs text-muted-foreground/60'>
            Secure email verification powered by advanced encryption
          </p>
        </div>
      </div>
    </div>
  );
}
