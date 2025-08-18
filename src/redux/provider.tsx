'use client';

import { IUser } from '@/app/auth/login/model-interfaces/interfaces';
import { setUser } from '@/app/auth/login/reducers/reducers';
import { AppStore, makeStore } from '@/redux/store';
import { useRef } from 'react';
import { Provider } from 'react-redux';

export function Providers({
  children,
  userData,
}: {
  children: React.ReactNode;
  userData: IUser;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  storeRef.current.dispatch(setUser(userData));

  return <Provider store={storeRef.current}>{children}</Provider>;
}
