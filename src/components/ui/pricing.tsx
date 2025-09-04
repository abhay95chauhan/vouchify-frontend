'use client';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowRight, BadgeCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Typography } from '@/global/components/typography/typography';
import { getAllSubcriptionsService } from '@/app/(modules)/subcriptions/actions/services';
import {
  ISubscriptionGet,
  ISubscriptionPeriod,
} from '@/app/(modules)/subcriptions/model-interfaces/interfaces';

const Pricing = ({
  onSelecPlan,
}: {
  onSelecPlan: (subData: {
    subId: string;
    period: ISubscriptionPeriod;
  }) => void;
}) => {
  const [frequency, setFrequency] = useState<string>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<string>('free'); // 👈 track selection
  const [subcriptions, setSubcriptions] = useState<ISubscriptionGet[]>([]); // 👈 track selection

  useEffect(() => {
    (async () => {
      const res = await getAllSubcriptionsService();
      setSubcriptions(res?.data);
    })();
  }, []);

  return (
    <div className='flex flex-col text-center'>
      <div className='flex flex-col items-center justify-center gap-6'>
        <Typography.P className='mx-auto mt-0 mb-0 max-w-2xl text-balance text-sm text-muted-foreground'>
          Managing a business is hard enough, so why not make your life easier?
          Our pricing plans are simple, transparent and scale with you.
        </Typography.P>

        {/* Frequency toggle */}
        <Tabs defaultValue={frequency} onValueChange={setFrequency}>
          <TabsList>
            <TabsTrigger value='monthly'>Monthly</TabsTrigger>
            <TabsTrigger value='yearly'>
              Yearly
              <Badge variant='secondary'>20% off</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Plans */}
        <div className='mt-4 grid w-full max-w-4xl gap-4 lg:grid-cols-2'>
          {subcriptions.map((plan) => {
            const isSelected = selectedPlan === plan.id;

            return (
              <Card
                onClick={() => {
                  onSelecPlan({
                    subId: plan.id,
                    period: frequency as ISubscriptionPeriod,
                  });
                  setSelectedPlan(plan.id);
                }} // 👈 select card on click
                className={cn(
                  'relative w-full text-left cursor-pointer transition-all',
                  isSelected && 'border-primary ring-2 ring-primary'
                )}
                key={plan.id}
              >
                {/* {plan.popular && (
                  <Badge className='-translate-x-1/2 -translate-y-1/2 absolute top-0 left-1/2 rounded-full'>
                    Popular
                  </Badge>
                )} */}
                <CardHeader>
                  <CardTitle className='font-medium text-xl'>
                    {plan.name}
                  </CardTitle>
                  <CardDescription>
                    <p>{plan.description}</p>
                    <span className='font-medium text-foreground'>
                      {!plan.isFree ? 'INR' : ''}&nbsp;
                      {plan.isFree
                        ? 'Free'
                        : plan.price[frequency as keyof typeof plan.price]}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent className='grid gap-2'>
                  {plan.features.map((feature, index) => (
                    <div
                      className='flex items-center gap-2 text-muted-foreground text-sm'
                      key={index}
                    >
                      <BadgeCheck className='h-4 w-4' />
                      {feature}
                    </div>
                  ))}
                </CardContent>
                <CardFooter className='flex items-end h-full'>
                  <Button
                    type='button'
                    className='w-full'
                    variant={isSelected ? 'default' : 'secondary'}
                  >
                    {isSelected ? 'Selected' : plan.buttonLabel}
                    <ArrowRight className='ml-2 h-4 w-4' />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default Pricing;
