
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { CalendarClock, ChevronLeft, ChevronRight } from 'lucide-react';
import { addMonths, format, isSameDay, subMonths, parseISO } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CalendarEvent {
  date: Date;
  title: string;
  type: 'maintenance' | 'assignment' | 'audit';
  id?: string;
  priority?: string;
  status?: string;
}

interface MaintenanceTask {
  _id: string;
  description: string;
  scheduledDate: string;
  type: string;
  priority?: string;
  status?: string;
  asset?: {
    name: string;
  };
}

interface DashboardCalendarProps {
  maintenanceData?: MaintenanceTask[];
}

const DashboardCalendar: React.FC<DashboardCalendarProps> = ({ maintenanceData = [] }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const navigate = useNavigate();
  
  console.log('DashboardCalendar: Received maintenance data:', maintenanceData);
  
  // Convert maintenance data to events
  const maintenanceEvents: CalendarEvent[] = maintenanceData
    .filter(task => task && task.scheduledDate) // Filter out invalid tasks
    .map(task => {
      console.log('Processing task for calendar:', task);
      try {
        const eventDate = new Date(task.scheduledDate);
        const title = task.asset?.name 
          ? `${task.asset.name} - ${task.description}` 
          : task.description || `Maintenance Task`;
        
        return {
          date: eventDate,
          title: title,
          type: 'maintenance' as const,
          id: task._id,
          priority: task.priority,
          status: task.status
        };
      } catch (error) {
        console.error('Error processing maintenance task for calendar:', task, error);
        return null;
      }
    })
    .filter(Boolean) as CalendarEvent[]; // Remove null entries
  
  console.log('DashboardCalendar: Processed maintenance events:', maintenanceEvents);
  
  // Sample events - only used if no real data
  const sampleEvents: CalendarEvent[] = [
    { 
      date: new Date(2025, 5, 20), 
      title: 'Server maintenance', 
      type: 'maintenance' 
    },
    { 
      date: new Date(2025, 5, 22), 
      title: 'Laptop assignment', 
      type: 'assignment' 
    },
    { 
      date: new Date(2025, 5, 25), 
      title: 'Quarterly audit', 
      type: 'audit' 
    },
    { 
      date: new Date(2025, 5, 27), 
      title: 'Network switch maintenance', 
      type: 'maintenance' 
    },
  ];

  // Use real data if available, otherwise use sample data
  const events = maintenanceEvents.length > 0 ? maintenanceEvents : sampleEvents;
  
  console.log('DashboardCalendar: Final events for calendar:', events);

  const handlePreviousMonth = () => {
    setCurrentMonth(prevMonth => subMonths(prevMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prevMonth => addMonths(prevMonth, 1));
  };

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const eventsForDate = events.filter(event => isSameDay(event.date, date));
    console.log(`Events for ${format(date, 'yyyy-MM-dd')}:`, eventsForDate);
    return eventsForDate;
  };

  const getEventTypeColor = (type: CalendarEvent['type']): string => {
    switch (type) {
      case 'maintenance':
        return 'bg-orange-500';
      case 'assignment':
        return 'bg-blue-500';
      case 'audit':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getPriorityColor = (priority?: string): string => {
    switch (priority) {
      case 'high':
      case 'critical':
        return 'border-red-500 text-red-600';
      case 'medium':
        return 'border-orange-500 text-orange-600';
      case 'low':
        return 'border-green-500 text-green-600';
      default:
        return 'border-gray-500 text-gray-600';
    }
  };

  const handleEventClick = (event: CalendarEvent) => {
    if (event.id && event.type === 'maintenance') {
      navigate(`/maintenance/details/${event.id}`);
    }
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];

  return (
    <Card className="card-gradient animate-scale-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">
          <div className="flex items-center gap-2">
            <CalendarClock className="h-5 w-5 text-primary" />
            <span>Calendar</span>
          </div>
        </CardTitle>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handlePreviousMonth}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="w-28 text-center text-sm font-medium">
            {format(currentMonth, 'MMMM yyyy')}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={handleNextMonth}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-7/12">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              month={currentMonth}
              className="rounded-md border p-3"
              modifiers={{
                event: (date) => {
                  const hasEvent = events.some(event => isSameDay(event.date, date));
                  console.log(`Date ${format(date, 'yyyy-MM-dd')} has events:`, hasEvent);
                  return hasEvent;
                },
              }}
              modifiersClassNames={{
                event: "border-primary text-primary font-bold bg-primary/10",
              }}
            />
          </div>
          <div className="md:w-5/12 border-l pl-4">
            <h3 className="font-medium mb-2">
              {selectedDate ? format(selectedDate, 'MMMM d, yyyy') : 'Select a date'}
            </h3>
            {selectedDateEvents.length > 0 ? (
              <div className="space-y-2">
                {selectedDateEvents.map((event, index) => (
                  <div 
                    key={`${event.id || index}`}
                    className={`p-2 border rounded-md flex items-start space-x-2 animate-fade-in cursor-pointer hover:bg-gray-50 ${
                      event.priority ? getPriorityColor(event.priority) : ''
                    }`}
                    style={{animationDelay: `${index * 100}ms`}}
                    onClick={() => handleEventClick(event)}
                  >
                    <div className={`h-3 w-3 rounded-full mt-1 ${getEventTypeColor(event.type)}`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium">{event.title}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {event.type}
                        </Badge>
                        {event.priority && (
                          <Badge variant="outline" className={`text-xs ${getPriorityColor(event.priority)}`}>
                            {event.priority}
                          </Badge>
                        )}
                        {event.status && (
                          <Badge variant="outline" className="text-xs">
                            {event.status}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No events scheduled for this date.</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardCalendar;
