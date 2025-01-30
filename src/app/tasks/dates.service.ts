import {Injectable} from "@angular/core";
import {DateTime} from "luxon";

@Injectable({providedIn: 'root'})
export class DatesService {

  formatToDatetimeLocal(dateString: string): string {
    const timeZoneMap: { [key: string]: string } = {
      CET: 'Europe/Paris',
      CEST: 'Europe/Paris',
    };

    const [datePart, timePart, timeZone] = dateString.split(' ');

    const fullDateString = `${datePart} ${timePart}`;
    const ianaTimeZone = timeZoneMap[timeZone] || 'UTC';

    const parsedDate = DateTime.fromFormat(fullDateString, 'dd/MM/yyyy HH:mm:ss', {zone: ianaTimeZone});
    return parsedDate.toFormat('yyyy-MM-dd\'T\'HH:mm');
    // Format for datetime-local
  }

  getCurrentDateInDatetimeLocalFormat(): {
    startDate: string;
    endDate: string;
  } {
    let now = DateTime.now();
    let anHourFromNow = now.plus({hours: 1});
    return {
      startDate: now.toFormat('yyyy-MM-dd\'T\'HH:mm'),
      endDate: anHourFromNow.toFormat('yyyy-MM-dd\'T\'HH:mm'),
    };
  }
}
