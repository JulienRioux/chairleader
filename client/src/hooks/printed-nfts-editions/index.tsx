import { useCallback, useState, useEffect } from 'react';
import { getPrintedVersionsFromMasterAddress } from 'utils';

export const usePrintedNftsEditions = (masterAddress?: string) => {
  const [editionsPrintedList, setEditionsPrintedList] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadPrintedVersions = useCallback(async () => {
    if (!masterAddress) {
      return;
    }

    setIsLoading(true);

    const printedList = await getPrintedVersionsFromMasterAddress(
      masterAddress
    );
    setEditionsPrintedList(printedList ?? []);
    setIsLoading(false);
  }, [masterAddress, setIsLoading]);

  useEffect(() => {
    loadPrintedVersions();
  }, [loadPrintedVersions]);

  return {
    editionsPrintedList,
    editionsPrintedListIsLoading: isLoading,
    refreshEditionsPrintedList: loadPrintedVersions,
  };
};
