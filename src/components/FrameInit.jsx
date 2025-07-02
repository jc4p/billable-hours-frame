
'use client';

import { useEffect } from 'react';
import { initializeFrame } from '@/lib/frame';

export function FrameInit() {
  useEffect(() => {
    initializeFrame();
  }, []);

  return null;
}
