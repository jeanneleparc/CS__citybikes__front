export interface IStationBase {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export interface IStation extends IStationBase {
  capacity: number;
  has_kiosk: boolean;
  is_installed: boolean;
  last_updated: Date;
  num_bikes_available: number;
  num_bikes_disabled: number;
  num_docks_available: number;
  num_docks_disabled: number;
  num_ebikes: number;
  station_status: string;
}

export interface IStationStat extends IStationBase {
  avgBikesNb: number;
  fillingRate: number;
}

export const WEEK_DAYS: string[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
