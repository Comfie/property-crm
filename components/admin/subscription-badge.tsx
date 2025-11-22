import { Badge } from '@/components/ui/badge';
import { SubscriptionStatus, SubscriptionTier } from '@prisma/client';

interface SubscriptionBadgeProps {
  tier?: SubscriptionTier;
  status?: SubscriptionStatus;
}

export function SubscriptionTierBadge({ tier }: { tier: SubscriptionTier }) {
  const variants: Record<
    SubscriptionTier,
    { variant: 'default' | 'secondary' | 'outline' | 'destructive'; label: string }
  > = {
    FREE: { variant: 'outline', label: 'Free' },
    STARTER: { variant: 'secondary', label: 'Starter' },
    PROFESSIONAL: { variant: 'default', label: 'Professional' },
    ENTERPRISE: { variant: 'default', label: 'Enterprise' },
  };

  const config = variants[tier];

  return (
    <Badge variant={config.variant} className="font-normal">
      {config.label}
    </Badge>
  );
}

export function SubscriptionStatusBadge({ status }: { status: SubscriptionStatus }) {
  const variants: Record<SubscriptionStatus, { className: string; label: string }> = {
    TRIAL: { className: 'bg-blue-100 text-blue-800 hover:bg-blue-200', label: 'Trial' },
    ACTIVE: { className: 'bg-green-100 text-green-800 hover:bg-green-200', label: 'Active' },
    PAST_DUE: { className: 'bg-orange-100 text-orange-800 hover:bg-orange-200', label: 'Past Due' },
    CANCELLED: { className: 'bg-red-100 text-red-800 hover:bg-red-200', label: 'Cancelled' },
    EXPIRED: { className: 'bg-gray-100 text-gray-800 hover:bg-gray-200', label: 'Expired' },
  };

  const config = variants[status];

  return <Badge className={`${config.className} font-normal`}>{config.label}</Badge>;
}
