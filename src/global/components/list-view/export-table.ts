export const tableColumns = (tableName: string) => {
  switch (tableName) {
    case '/voucher/list':
      return {
        header: [
          'name',
          'description',
          'code',
          'prefix',
          'postfix',
          'discount_type',
          'discount_value',
          'max_redemptions',
          'redemption_count',
          'min_order_amount',
          'organization_id',
          'max_discount_amount',
          'redeem_limit_per_user',
          'start_date',
          'end_date',
          'created_at',
          'updated_at',
        ],
      };

    default:
      return { header: [] };
  }
};
