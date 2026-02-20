export interface Site {
  _id: string;
  name: string;
}

export interface WorkDayData {
  _id: string;
  dateString: string;
  startTime: string;
  endTime: string;
  netHours: number;
  site?: string;
  note?: string;
}
