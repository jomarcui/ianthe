export const getTotalCredits = (transactions: any[] = []): number => {
  const total = transactions.reduce(
    (previousValue: number, currentValue) =>
      ['BET', 'DEBIT'].includes(currentValue.type)
        ? (previousValue -= Number(currentValue.amount))
        : (previousValue += Number(currentValue.amount)),
    0
  );

  if (total < 0) return 0;

  return total;
};

export const getTotalNumberOfBetsByQuery = ({
  filterQuery,
  transactions = [],
}: {
  filterQuery: ({ match, team }: { match: string; team: string }) => boolean;
  transactions: any[];
}) => transactions.filter(filterQuery).length;
