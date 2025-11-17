import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, XCircle, AlertCircle } from "lucide-react";

interface DemoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (paymentId: string, payerId: string) => void;
  onError: () => void;
  totalAmount: number;
}

const DemoPaymentModal = ({
  isOpen,
  onClose,
  onSuccess,
  onError,
  totalAmount,
}: DemoPaymentModalProps) => {
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "error"
  >("idle");

  const handlePaymentSuccess = () => {
    setPaymentStatus("processing");

    // Simulate payment processing delay
    setTimeout(() => {
      setPaymentStatus("success");
      const demoPaymentId = `DEMO-PAY-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 9)}`;
      const demoPayerId = `DEMO-PAYER-${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      // Wait a bit before completing to show success state
      setTimeout(() => {
        onSuccess(demoPaymentId, demoPayerId);
        handleClose();
      }, 1500);
    }, 1200);
  };

  const handlePaymentFailure = () => {
    setPaymentStatus("processing");

    // Simulate payment processing delay
    setTimeout(() => {
      setPaymentStatus("error");
      setTimeout(() => {
        onError();
        handleClose();
      }, 2000);
    }, 1200);
  };

  const handleClose = () => {
    setTimeout(() => {
      setPaymentStatus("idle");
      onClose();
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && paymentStatus === "idle" && onClose()}>
      <DialogContent className="sm:max-w-[500px]" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Demo Payment Processor</DialogTitle>
            <Badge
              variant="secondary"
              className="bg-yellow-100 text-yellow-800"
            >
              DEMO MODE
            </Badge>
          </div>
          <DialogDescription>
            This is a simulated payment for demonstration purposes. No real
            transactions will occur.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Amount Display */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Amount:</span>
              <span className="text-2xl font-bold text-gray-900">
                ${totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Status Display */}
          {paymentStatus !== "idle" && (
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              {paymentStatus === "processing" && (
                <>
                  <Loader2 className="h-16 w-16 animate-spin text-blue-500" />
                  <p className="text-lg font-medium text-gray-700">
                    Processing payment...
                  </p>
                </>
              )}

              {paymentStatus === "success" && (
                <>
                  <CheckCircle className="h-16 w-16 text-green-500" />
                  <p className="text-lg font-medium text-green-700">
                    Payment Successful!
                  </p>
                  <p className="text-sm text-gray-500">
                    Redirecting to order confirmation...
                  </p>
                </>
              )}

              {paymentStatus === "error" && (
                <>
                  <XCircle className="h-16 w-16 text-red-500" />
                  <p className="text-lg font-medium text-red-700">
                    Payment Failed
                  </p>
                  <p className="text-sm text-gray-500">
                    Please try again or use a different payment method.
                  </p>
                </>
              )}
            </div>
          )}

          {/* Demo Information */}
          {paymentStatus === "idle" && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1 text-sm text-blue-800">
                  <p className="font-medium mb-1">Demo Mode Information:</p>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>No real payment will be processed</li>
                    <li>Test both success and failure scenarios</li>
                    <li>Orders are marked as demo orders</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {paymentStatus === "idle" && (
            <div className="flex flex-col space-y-3">
              <Button
                onClick={handlePaymentSuccess}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                Simulate Successful Payment
              </Button>
              <Button
                onClick={handlePaymentFailure}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50"
              >
                Simulate Failed Payment
              </Button>
              <Button onClick={handleClose} variant="ghost" className="w-full">
                Cancel
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DemoPaymentModal;
