import { toast, ToastT } from 'sonner';

type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ShowToastOptions {
  message: string;
  type?: ToastType;
  duration?: number;
}

export const useToast = () => {
  const showToast = ({ message, type = 'info', duration = 2000 }: ShowToastOptions) => {
    const toastOptions: Partial<ToastT> = {
      duration,
      style: {
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#111111',
        fontSize: '0.875rem',
        lineHeight: '1.25rem',
        fontWeight: '500',
        letterSpacing: '-0.035em',
        padding: '10px',
        minWidth: '10em',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
    };

    switch (type) {
      case 'success':
        toast.success(message, toastOptions);
        break;
      case 'error':
        toast.error(message, toastOptions);
        break;
      case 'warning':
        toast.warning(message, toastOptions);
        break;
      default:
        toast(message, toastOptions);
    }
  };

  return { showToast };
};
