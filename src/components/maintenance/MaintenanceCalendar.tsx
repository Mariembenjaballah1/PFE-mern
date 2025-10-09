
import React, { useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CalendarDays, ChevronLeft, ChevronRight, Info } from 'lucide-react';
import { addMonths, format, isSameDay, parseISO, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '@/hooks/use-notifications';

interface MaintenanceEvent {
  id: string;
  title: string;
  assetId: string;
  assetName: string;
  startDate: string;
  endDate: string;
  technician: string;
  status: 'scheduled' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

// Mock data for maintenance events
const maintenanceEvents: MaintenanceEvent[] = [
  {
    id: 'm1',
    title: 'Server Rack Maintenance',
    assetId: 'A001',
    assetName: 'Server Rack A12',
    startDate: '2025-05-20',
    endDate: '2025-05-22',
    technician: 'John Doe',
    status: 'scheduled',
    priority: 'medium'
  },
  {
    id: 'm2',
    title: 'Network Switch Upgrade',
    assetId: 'A002',
    assetName: 'Network Switch B5',
    startDate: '2025-05-25',
    endDate: '2025-05-26',
    technician: 'Emma Smith',
    status: 'scheduled',
    priority: 'high'
  },
  {
    id: 'm3',
    title: 'Desktop PC Repair',
    assetId: 'A003',
    assetName: 'Desktop PC C-112',
    startDate: '2025-05-10',
    endDate: '2025-05-10',
    technician: 'Alex Johnson',
    status: 'completed',
    priority: 'low'
  },
  {
    id: 'm4',
    title: 'Printer Maintenance',
    assetId: 'A004',
    assetName: 'Printer HP-4500',
    startDate: '2025-05-15',
    endDate: '2025-05-15',
    technician: 'Alex Johnson',
    status: 'in-progress',
    priority: 'medium'
  }
];

const MaintenanceCalendar: React.FC = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [month, setMonth] = useState<Date>(new Date());
  const [selectedEvent, setSelectedEvent] = useState<MaintenanceEvent | null>(null);
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  
  const hasEventOnDay = (day: Date) => {
    return maintenanceEvents.some(event => {
      const startDate = parseISO(event.startDate);
      const endDate = parseISO(event.endDate);
      
      // Check if the day is within the event range
      return (day >= startDate && day <= endDate);
    });
  };
  
  const getEventsForDay = (day: Date) => {
    return maintenanceEvents.filter(event => {
      const startDate = parseISO(event.startDate);
      const endDate = parseISO(event.endDate);
      
      // Check if the day is within the event range
      return (day >= startDate && day <= endDate);
    });
  };

  const handleDateSelect = (day: Date | undefined) => {
    if (day) {
      setDate(day);
    }
  };
  
  const nextMonth = () => {
    setMonth(addMonths(month, 1));
  };
  
  const prevMonth = () => {
    setMonth(subMonths(month, 1));
  };
  
  const viewEventDetails = (eventId: string) => {
    navigate(`/maintenance/${eventId}`);
  };
  
  const notifyAdminAboutMaintenance = (event: MaintenanceEvent) => {
    addNotification({
      type: 'maintenance',
      title: 'Maintenance Notification',
      message: `Notification sent to admins about ${event.title}`,
      link: `/maintenance/${event.id}`
    });
    
    // Show a confirmation
    alert(`Notification sent to all administrators about ${event.title}`);
  };

  return (
    <Card className="card-gradient">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            Maintenance Calendar
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Calendar
              mode="single"
              selected={date}
              onSelect={handleDateSelect}
              month={month}
              onMonthChange={setMonth}
              locale={fr}
              className="border rounded-md"
              modifiers={{
                hasEvent: (date) => hasEventOnDay(date),
              }}
              modifiersStyles={{
                hasEvent: { 
                  fontWeight: 'bold',
                  backgroundColor: 'rgba(16, 185, 129, 0.1)',
                  borderBottom: '2px solid #10b981' 
                }
              }}
            />
          </div>
          
          <div>
            <div className="mb-3">
              <h3 className="font-medium">
                Events for {format(date, 'MMMM d, yyyy')}
              </h3>
            </div>
            
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-2">
              {getEventsForDay(date).length === 0 ? (
                <p className="text-muted-foreground text-center py-6">
                  No maintenance events scheduled for this day
                </p>
              ) : (
                getEventsForDay(date).map(event => (
                  <div key={event.id} className="border rounded-lg p-3 bg-background/80">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{event.title}</h4>
                      <Badge 
                        variant="outline"
                        className={`
                          ${event.status === 'scheduled' ? 'border-blue-500 text-blue-500' : ''}
                          ${event.status === 'in-progress' ? 'border-orange-500 text-orange-500' : ''}
                          ${event.status === 'completed' ? 'border-green-500 text-green-500' : ''}
                        `}
                      >
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Badge>
                    </div>
                    
                    <div className="mt-2 text-sm space-y-1">
                      <p>Asset: {event.assetName}</p>
                      <p>
                        Duration: {format(parseISO(event.startDate), 'MMM d')} 
                        {event.startDate !== event.endDate && ` - ${format(parseISO(event.endDate), 'MMM d')}`}
                      </p>
                      <p>Technician: {event.technician}</p>
                      <p>Priority: 
                        <Badge variant="outline" className="ml-2 capitalize">
                          {event.priority}
                        </Badge>
                      </p>
                    </div>
                    
                    <div className="mt-3 flex justify-between">
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => viewEventDetails(event.id)}
                      >
                        View Details
                      </Button>
                      
                      <Button 
                        size="sm"
                        onClick={() => notifyAdminAboutMaintenance(event)}
                      >
                        Notify Admins
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceCalendar;
