import { Button, ButtonProps } from '@/components/ui/button'
import { cn } from '@/lib/utils';


type Props = {
   onClick: ButtonProps["onClick"];
   disabled: boolean;
   isSubscribed: boolean;
   className?: string;
   size?: ButtonProps["size"];
}

const SubscriptionButton = ({ onClick, disabled, isSubscribed, className, size }: Props) => {
  return (
    <Button size={size} onClick={onClick} className={cn("rounded-full", className)} disabled={disabled} variant={isSubscribed ? "secondary" : "default"}>
      {isSubscribed ? "Unsubscribe" : "Subscribe"}
    </Button>
  )
}

export default SubscriptionButton
