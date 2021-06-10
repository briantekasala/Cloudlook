import { IFileItem } from "../../models/IFileItem";
import { ITeam } from "../../models/ITeam";


export interface IGraphService {
  getRecentFiles(): Promise<IFileItem[]>;
  searchDriveItems(searchitem: string): Promise<IFileItem[]>;
  getFileUrl(siteId: string, driveId: string, itemsId: string): Promise<string>;
  getJoinedTeams(): Promise<ITeam[]>;
  getTeamFiles(groupId: string): Promise<IFileItem[]>;
  getOneDriveFiles(): Promise<IFileItem[]>;
  getTeamFolderFiles(groupId: string, folderId: string): Promise<IFileItem[]>;
  getOneDriveFolderFiles(folderId: string): Promise<IFileItem[]>;
}