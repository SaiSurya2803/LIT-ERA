export type EventStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
export type VolunteerStatus = 'active' | 'inactive';
export type TaskStatus = 'pending' | 'in-progress' | 'completed';

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string; // ISO date string
  location: string;
  status: EventStatus;
  capacity: number;
  registeredVolunteersCount: number;
}

export interface Volunteer {
  id: string;
  name: string;
  email: string;
  phone: string;
  skills: string[];
  status: VolunteerStatus;
  eventsParticipated: number;
}

export interface Task {
  id: string;
  eventId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedTo?: string; // Volunteer ID
  dueDate?: string; // ISO date string
}
