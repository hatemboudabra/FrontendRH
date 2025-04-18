export enum EventsType {
    VOYAGE = 'VOYAGE',
    TEAM_BUILDING = 'TEAM_BUILDING'
  }
export interface Events{
    id : number ; 
    title: string;
    description: string;
    type: EventsType;
    startDate: Date;
    endDate: Date;
    userId: number;

}