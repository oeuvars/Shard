import DotPattern from '@/components/global/dot-pattern';
import { Button } from '@/components/ui/button';
import { IconCornerDownRight } from '@tabler/icons-react';
import { toast, ToastT } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastAction {
  label: string;
  onClick: () => void;
}

interface ShowToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
  description?: string;
  action?: ToastAction;
}

export const useToast = () => {
  const showToast = ({
    message,
    type = 'info',
    duration = 2000,
    description,
    action,
  }: ShowToastOptions) => {
    const ToastContent = () => (
      <div className="relative overflow-hidden rounded-lg">
        <div className="relative z-10 p-4 pl-6">
          <div className="flex items-center justify-between gap-5">
            <div className="flex-1">
              <div className="text-black">{message}</div>
              {description && <div className="mt-1 text-sm text-gray-500">{description}</div>}
            </div>
            {action && (
              <Button onClick={action.onClick} size="sm" variant="outline">
                {action.label}
                <IconCornerDownRight />
              </Button>
            )}
          </div>
        </div>

        <DotPattern className="absolute inset-0" />

        <div
          className="absolute inset-0 animate-border bg-gradient-to-r from-transparent via-white to-transparent"
          style={{
            maskImage: 'linear-gradient(to right, transparent, white, transparent)',
            WebkitMaskImage: 'linear-gradient(to right, transparent, white, transparent)',
          }}
        />
      </div>
    );

    const toastOptions: Partial<ToastT> = {
      duration,
      style: {
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(15px)',
        color: '#000',
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        fontWeight: '500',
        letterSpacing: '-0.035em',
        paddingLeft: '5',
        paddingTop: '0',
        paddingBottom: '0',
        minWidth: '27em',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        overflow: 'hidden',
      },
    };

    switch (type) {
      case 'success':
        toast.success(<ToastContent />, toastOptions);
        break;
      case 'error':
        toast.error(<ToastContent />, toastOptions);
        break;
      case 'warning':
        toast.warning(<ToastContent />, toastOptions);
        break;
      default:
        toast(<ToastContent />, toastOptions);
    }
  };

  return { showToast };
};

export default useToast;
