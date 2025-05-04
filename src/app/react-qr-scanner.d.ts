declare module 'react-qr-scanner' {
    import * as React from 'react';
  
    export interface QrReaderProps {
      delay?: number;
      onError: (error: any) => void;
      onScan: (data: any) => void;
      style?: React.CSSProperties;
      facingMode?: 'user' | 'environment';
      className?: string;
    }
  
    const QrReader: React.FC<QrReaderProps>;
    export default QrReader;
  }
  