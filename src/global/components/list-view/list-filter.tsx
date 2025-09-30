'use client';

import VouchersFilter from '@/app/(modules)/vouchers/components/filter';

interface IProps {
  compName: string;
  showModal: boolean;
  onCloseFilter: (isReset?: boolean) => void;
  onApplyFilter: (filter: Record<string, unknown>) => void;
}

const ListFilter = (props: IProps) => {
  switch (props.compName) {
    case 'voucher':
      return (
        <VouchersFilter
          showModal={props.showModal}
          onCloseFilter={(isReset) => props.onCloseFilter(isReset)}
          applyFilter={(filter) => props.onApplyFilter(filter)}
        />
      );

    default:
      return null;
  }
};

export default ListFilter;
