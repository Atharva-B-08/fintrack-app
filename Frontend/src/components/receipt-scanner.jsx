import React, { useEffect, useRef } from 'react'
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Camera, Loader2 } from 'lucide-react';
import useFetch from '../hooks/use-fetch';
import { scanReceipt } from '../actions/transaction';
import { toast } from 'react-toastify';

const ReceiptScanner = ({onScanComplete}) => {
    const fileInputRef = useRef(null);

    const {
        fn: scanReceiptFn,
        data: scanReceiptData,
        loading: scanReceiptLoading,
        error: scanReceiptError,
      } = useFetch(scanReceipt);

    const handleReceiptScan = async (file) => {
        if(file.size > 5 * 1024 * 1024){
            toast.error("File size exceeds 5MB limit");
            return;
        }

        await scanReceiptFn(file);
    }

    useEffect(() => {
        if(scanReceiptData && !scanReceiptLoading){
            onScanComplete(scanReceiptData);
            toast.success("Receipt scanned successfully");
        }
    }, [scanReceiptData, scanReceiptLoading]);


  return (
    <div className="flex items-center gap-4">
      <Input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleReceiptScan(file);
        }}
      />
      <Button
        type="button"
        variant="outline"
        className="w-full h-10 bg-gradient-to-br from-orange-500 via-pink-500 to-purple-500 animate-gradient hover:opacity-90 transition-opacity text-white hover:text-white"
        onClick={() => fileInputRef.current?.click()}
        disabled={scanReceiptLoading}
      >
        {scanReceiptLoading ? (
          <>
            <Loader2 className="mr-2 animate-spin" />
            <span>Scanning Receipt...</span>
          </>
        ) : (
          <>
            <Camera className="mr-2" />
            <span>Scan Receipt with AI</span>
          </>
        )}
      </Button>
    </div>
  )
}

export default ReceiptScanner;