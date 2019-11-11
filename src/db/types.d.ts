import ActivityRecord from "../models/activity";
import { DefiniteTimeRange } from "../models/time";

export interface DatabaseRecords {
  activity: ActivityRecord[];
}

/** Service for interacting with activity records */
export interface ActivityService {
  /**
   * Creates & stores an activity record
   * @param url activity URL
   * @param favIconUrl page favicon URL
   * @param title page title
   * @param startTime activity start time in milliseconds
   * @param endTime activity end time in milliseconds
   * @returns ID of the created record
   */
  createActivityRecord(
    url: string,
    favIconUrl: string,
    title: string,
    startTime: number,
    endTime: number
  ): Promise<number>;

  /**
   * Deletes a list of activity records
   * @param recordId List of activity records IDs to be deleted
   */
  deleteActivityRecords(recordIds: number[]): Promise<void>;

  /**
   * Fetches all stored activity records
   * @returns Collection of activity records
   */
  fetchAllActivityRecords(): Promise<ActivityRecord[]>;

  /**
   * Fetches time range of all stored activity records
   * @returns Time Range composed of `startTime` of the oldest activity record
   * & `endTime` of the newest activity record
   */
  fetchActivityTimeRange(): Promise<DefiniteTimeRange | null>;
}

/** Service for interacting with activity records */
export interface DataMigrationService {
  /**
   * Export all table records in database
   * @returns object containing all records keyed by their respective table name
   */
  exportDatabaseRecords(): Promise<DatabaseRecords>;

  /**
   * Import table records into database (overwrites existing records)
   */
  importDatabaseRecords(records: DatabaseRecords): void;
}
