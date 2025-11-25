'use client';

import { useMemo, useCallback, useState } from 'react';
import {
  Calendar,
  dateFnsLocalizer,
  Views,
  SlotInfo,
  NavigateAction,
  View,
} from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { cn } from '@/lib/utils';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface BookingEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: string;
  propertyId: string;
  propertyName: string;
  guestName: string;
  totalAmount: number;
  type?: 'booking' | 'lease';
}

interface Booking {
  id: string;
  guestName: string;
  checkInDate: string;
  checkOutDate: string;
  status: string;
  totalAmount: number;
  property: {
    id: string;
    name: string;
  };
}

interface TenantLease {
  id: string;
  leaseStartDate: string;
  leaseEndDate: string | null;
  isActive: boolean;
  tenant: {
    id: string;
    firstName: string;
    lastName: string;
  };
  property: {
    id: string;
    name: string;
  };
}

interface BookingCalendarProps {
  bookings: Booking[];
  leases?: TenantLease[];
  onSelectEvent?: (event: BookingEvent) => void;
  onSelectSlot?: (slotInfo: SlotInfo) => void;
  className?: string;
}

const statusColors: Record<string, { bg: string; border: string }> = {
  PENDING: { bg: '#fef3c7', border: '#f59e0b' },
  CONFIRMED: { bg: '#dbeafe', border: '#3b82f6' },
  CHECKED_IN: { bg: '#d1fae5', border: '#10b981' },
  CHECKED_OUT: { bg: '#f3f4f6', border: '#6b7280' },
  CANCELLED: { bg: '#fee2e2', border: '#ef4444' },
  NO_SHOW: { bg: '#f3e8ff', border: '#a855f7' },
  LEASE: { bg: '#fca5a5', border: '#dc2626' }, // Red for tenant leases
};

export function BookingCalendar({
  bookings,
  leases = [],
  onSelectEvent,
  onSelectSlot,
  className,
}: BookingCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);

  const handleNavigate = useCallback((newDate: Date, view: View, action: NavigateAction) => {
    setCurrentDate(newDate);
  }, []);

  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view);
  }, []);

  // Transform bookings and leases to calendar events
  const events: BookingEvent[] = useMemo(() => {
    const bookingEvents = bookings.map((booking) => ({
      id: booking.id,
      title: `${booking.guestName} - ${booking.property.name}`,
      start: new Date(booking.checkInDate),
      end: new Date(booking.checkOutDate),
      status: booking.status,
      propertyId: booking.property.id,
      propertyName: booking.property.name,
      guestName: booking.guestName,
      totalAmount: booking.totalAmount,
      type: 'booking' as const,
    }));

    const leaseEvents = leases.map((lease) => ({
      id: lease.id,
      title: `🏠 ${lease.tenant.firstName} ${lease.tenant.lastName} (Tenant) - ${lease.property.name}`,
      start: new Date(lease.leaseStartDate),
      end: lease.leaseEndDate
        ? new Date(lease.leaseEndDate)
        : new Date(new Date().getFullYear() + 1, 11, 31),
      status: 'LEASE',
      propertyId: lease.property.id,
      propertyName: lease.property.name,
      guestName: `${lease.tenant.firstName} ${lease.tenant.lastName}`,
      totalAmount: 0,
      type: 'lease' as const,
    }));

    return [...bookingEvents, ...leaseEvents];
  }, [bookings, leases]);

  // Custom event styling based on status
  const eventStyleGetter = useCallback((event: BookingEvent) => {
    const colors = statusColors[event.status] || statusColors.PENDING;
    return {
      style: {
        backgroundColor: colors?.bg,
        borderLeft: `4px solid ${colors?.border}`,
        color: '#1f2937',
        borderRadius: '4px',
        padding: '2px 4px',
        fontSize: '12px',
        fontWeight: 500,
      },
    };
  }, []);

  // Custom toolbar component for better styling
  const CustomToolbar = useCallback(({ label, onNavigate, onView, view }: any) => {
    return (
      <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('PREV')}
            className="hover:bg-muted rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          >
            Back
          </button>
          <button
            onClick={() => onNavigate('TODAY')}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          >
            Today
          </button>
          <button
            onClick={() => onNavigate('NEXT')}
            className="hover:bg-muted rounded-md px-3 py-1.5 text-sm font-medium transition-colors"
          >
            Next
          </button>
        </div>

        <h2 className="text-lg font-semibold">{label}</h2>

        <div className="flex items-center gap-1 rounded-md border p-1">
          <button
            onClick={() => onView(Views.MONTH)}
            className={cn(
              'rounded px-3 py-1 text-sm font-medium transition-colors',
              view === Views.MONTH ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Month
          </button>
          <button
            onClick={() => onView(Views.WEEK)}
            className={cn(
              'rounded px-3 py-1 text-sm font-medium transition-colors',
              view === Views.WEEK ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Week
          </button>
          <button
            onClick={() => onView(Views.AGENDA)}
            className={cn(
              'rounded px-3 py-1 text-sm font-medium transition-colors',
              view === Views.AGENDA ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
            )}
          >
            Agenda
          </button>
        </div>
      </div>
    );
  }, []);

  return (
    <div className={cn('booking-calendar', className)}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 700 }}
        views={[Views.MONTH, Views.WEEK, Views.AGENDA]}
        view={currentView}
        date={currentDate}
        onNavigate={handleNavigate}
        onView={handleViewChange}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={onSelectEvent}
        onSelectSlot={onSelectSlot}
        selectable
        popup
        components={{
          toolbar: CustomToolbar,
        }}
        formats={{
          eventTimeRangeFormat: () => '',
          agendaDateFormat: 'EEE MMM d',
          agendaTimeFormat: 'HH:mm',
          agendaTimeRangeFormat: ({ start, end }) =>
            `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
        }}
      />

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4">
        {Object.entries(statusColors).map(([status, colors]) => (
          <div key={status} className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded"
              style={{ backgroundColor: colors.bg, border: `2px solid ${colors.border}` }}
            />
            <span className="text-muted-foreground text-xs">{status.replace('_', ' ')}</span>
          </div>
        ))}
      </div>

      <style jsx global>{`
        .booking-calendar .rbc-calendar {
          font-family: inherit;
        }
        .booking-calendar .rbc-header {
          padding: 8px;
          font-weight: 600;
          font-size: 13px;
        }
        .booking-calendar .rbc-today {
          background-color: hsl(var(--primary) / 0.1);
        }
        .booking-calendar .rbc-event {
          border: none;
        }
        .booking-calendar .rbc-event:focus {
          outline: 2px solid hsl(var(--primary));
          outline-offset: 2px;
        }
        .booking-calendar .rbc-show-more {
          color: hsl(var(--primary));
          font-weight: 500;
        }
        .booking-calendar .rbc-off-range-bg {
          background-color: hsl(var(--muted) / 0.5);
        }
        .booking-calendar .rbc-date-cell {
          padding: 4px 8px;
          text-align: right;
        }
        .booking-calendar .rbc-month-view {
          border-radius: 8px;
          border: 1px solid hsl(var(--border));
          overflow: hidden;
        }
        .booking-calendar .rbc-time-view {
          border-radius: 8px;
          border: 1px solid hsl(var(--border));
          overflow: hidden;
        }
        .booking-calendar .rbc-agenda-view {
          border-radius: 8px;
          border: 1px solid hsl(var(--border));
          overflow: hidden;
        }
        .booking-calendar .rbc-agenda-view table {
          border: none;
        }
        .booking-calendar .rbc-agenda-empty {
          padding: 40px;
          text-align: center;
          color: hsl(var(--muted-foreground));
        }
      `}</style>
    </div>
  );
}
