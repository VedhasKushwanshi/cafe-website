import React from 'react';
import { Check, ChefHat, Clock, Coffee, MapPin, PackageCheck, RefreshCw } from 'lucide-react';
import { useCafe } from '../context/CafeContext';
import type { Order, OrderStatus } from '../types/cafe';

const STEPS: Array<{
  key: OrderStatus;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  {
    key: 'received',
    label: 'Order Received',
    description: 'Sent directly to our Bidholi bar',
    icon: Clock,
  },
  {
    key: 'preparing',
    label: 'Preparing',
    description: 'Brewing chai & pulling fresh espresso',
    icon: ChefHat,
  },
  {
    key: 'ready',
    label: 'Ready',
    description: 'Hot off the counter & plated fresh',
    icon: Coffee,
  },
  {
    key: 'completed',
    label: 'Completed',
    description: 'Served — enjoy every sip!',
    icon: PackageCheck,
  },
];

interface OrderTrackerProps {
  order: Order;
  compact?: boolean;
}

export function OrderTracker({ order, compact = false }: OrderTrackerProps) {
  const { advanceOrderStatus } = useCafe();
  const currentIdx = STEPS.findIndex((s) => s.key === order.status);
  const progressPercent = (currentIdx / (STEPS.length - 1)) * 100;

  return (
    <div className="bg-[#FFFDF9] rounded-2xl border border-[#E8D5BC] p-6 sm:p-7 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-4 pb-5 border-b border-[#E8D5BC]/70">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#6F4E37] mb-1">
            <span className="font-mono font-semibold text-[#C88746]">{order.id}</span>
            <span aria-hidden="true">·</span>
            <span className="capitalize">
              {order.orderType === 'dine-in'
                ? `Dine-In · Table #${order.tableNumber ?? 1}`
                : `Takeaway · ${order.pickupTime || 'In 15 mins'}`}
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-semibold text-[#3B2416]">
            {STEPS[currentIdx]?.label ?? 'Order Received'}
          </h3>
          <p className="text-sm text-[#6F4E37] mt-0.5">
            {order.status === 'completed'
              ? 'Thank you for ordering with Chai & Coc Café.'
              : `Estimated preparation time: ~${order.estimatedMinutes} minutes`}
          </p>
        </div>

        <button
          type="button"
          onClick={() => advanceOrderStatus(order.id)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E8D5BC] bg-[#FFF4E6]/70 text-xs font-semibold text-[#3B2416] hover:bg-[#E8D5BC]/60 transition-colors whitespace-nowrap cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>
            {order.status === 'completed' ? 'Replay Status Demo' : 'Simulate Next Stage'}
          </span>
        </button>
      </div>

      {/* Visual Progress Track */}
      <div className="mt-7 mb-2 relative">
        <div className="hidden sm:block absolute top-5 left-[10%] right-[10%] h-0.5 bg-[#E8D5BC]">
          <div
            className="h-full bg-[#C88746] transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-2 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const done = idx < currentIdx || (idx === currentIdx && order.status === 'completed');
            const current = idx === currentIdx && order.status !== 'completed';
            return (
              <li
                key={step.key}
                className="flex sm:flex-col items-center sm:text-center gap-3.5 sm:gap-2.5"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors border-2 ${
                    done
                      ? 'bg-[#3B2416] border-[#3B2416] text-[#FFFDF9]'
                      : current
                        ? 'bg-[#C88746] border-[#C88746] text-[#FFFDF9] shadow-md shadow-[#C88746]/30'
                        : 'bg-[#FFFDF9] border-[#E8D5BC] text-[#6F4E37]'
                  }`}
                >
                  {done ? <Check className="w-4 h-4" strokeWidth={2.8} /> : <Icon className="w-4 h-4" />}
                </div>
                <div>
                  <p
                    className={`text-sm font-semibold ${
                      done || current ? 'text-[#3B2416]' : 'text-[#6F4E37]/75'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-[#6F4E37] mt-0.5 leading-snug">{step.description}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Itemized summary */}
      {!compact && (
        <div className="mt-6 pt-5 border-t border-[#E8D5BC]/70 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-sm">
          <div className="space-y-1">
            <p className="text-xs font-semibold text-[#6F4E37]">Items in this order</p>
            <p className="text-[#3B2416] font-medium">
              {order.items.map((item) => `${item.quantity}× ${item.name}`).join(', ')}
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <div className="text-left sm:text-right">
              <p className="text-xs text-[#6F4E37]">Total Paid ({order.paymentMethod.toUpperCase()})</p>
              <p className="font-mono text-base font-semibold text-[#3B2416] tabular-nums">
                ₹{order.total}
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6F4E37] pl-4 border-l border-[#E8D5BC]">
              <MapPin className="w-3.5 h-3.5 text-[#C88746]" />
              <span>UPES Bidholi</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
