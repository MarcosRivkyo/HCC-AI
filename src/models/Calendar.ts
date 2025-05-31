export interface Reminder {
  id: string;
  date: string;
  text: string;
  done: boolean;
  createdAt?: Date;
}
