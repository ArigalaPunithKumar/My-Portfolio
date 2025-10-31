import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { CalendarIcon, Loader2, Clock } from "lucide-react";
import { format } from "date-fns";

interface ScheduleMeetingProps {
  onClose: () => void;
}

const timeSlots = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
  "12:00 PM", "12:30 PM", "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM", "05:00 PM", "05:30 PM",
];

const ScheduleMeeting = ({ onClose }: ScheduleMeetingProps) => {
  const [date, setDate] = useState<Date>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!date || !selectedTime) {
      toast({
        title: "Missing information",
        description: "Please select both date and time for the meeting.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Save meeting to database
      const { error: dbError } = await supabase.from("meetings").insert({
        name,
        email,
        phone,
        subject,
        message,
        meeting_date: date.toISOString(),
        meeting_time: selectedTime,
      });

      if (dbError) throw dbError;

      // Send notification email
      const { error: emailError } = await supabase.functions.invoke(
        "send-meeting-notification",
        {
          body: {
            name,
            email,
            phone,
            subject,
            message,
            meetingDate: format(date, "MMMM dd, yyyy"),
            meetingTime: selectedTime,
          },
        }
      );

      if (emailError) {
        console.error("Email notification error:", emailError);
        // Don't throw - meeting is still saved
      }

      toast({
        title: "Meeting scheduled!",
        description: "You'll receive a confirmation email shortly.",
      });

      onClose();
    } catch (error: any) {
      console.error("Error scheduling meeting:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to schedule meeting. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-6 z-50">
      <Card className="glass-strong w-full max-w-2xl p-8 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold gradient-text">Schedule a Meeting</h2>
          <Button variant="ghost" onClick={onClose} size="sm">
            ✕
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground/80 mb-2 block">
                Full Name *
              </label>
              <Input
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="glass border-border/30 focus:border-primary/50"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground/80 mb-2 block">
                Email Address *
              </label>
              <Input
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="glass border-border/30 focus:border-primary/50"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/80 mb-2 block">
              Phone Number
            </label>
            <Input
              type="tel"
              placeholder="+91 1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="glass border-border/30 focus:border-primary/50"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/80 mb-2 block">
              Subject
            </label>
            <Input
              placeholder="What would you like to discuss?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="glass border-border/30 focus:border-primary/50"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-foreground/80 mb-2 block">
                Select Date *
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal glass border-border/30"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0 glass-strong" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground/80 mb-2 block">
                Select Time *
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal glass border-border/30"
                  >
                    <Clock className="mr-2 h-4 w-4" />
                    {selectedTime || "Pick a time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2 glass-strong max-h-60 overflow-y-auto" align="start">
                  <div className="grid gap-1">
                    {timeSlots.map((time) => (
                      <Button
                        key={time}
                        variant={selectedTime === time ? "default" : "ghost"}
                        className="justify-start"
                        onClick={() => setSelectedTime(time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground/80 mb-2 block">
              Additional Message
            </label>
            <Textarea
              placeholder="Tell me more about what you'd like to discuss..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="glass border-border/30 focus:border-primary/50 resize-none"
            />
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              className="btn-neon flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Schedule Meeting"
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="btn-ghost-glow"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ScheduleMeeting;
