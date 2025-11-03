'use client';

import { useEffect } from 'react';
import toast from 'react-hot-toast';

export default function SuccessMsg({ successMsg }: { successMsg?: string | null }) {
  useEffect(() => {
    if (successMsg) {
 
      toast.success(successMsg);
    }
  }, [successMsg]);

  return null; // Nothing to render; toast is shown instead
}