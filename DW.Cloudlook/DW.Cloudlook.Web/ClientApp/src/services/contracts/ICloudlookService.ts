import { IUserFavorite } from "../../models/IUserFavorite";
import { IWorkspace } from "../../models/IWorkspace";

export interface ICloudlookService {
  requireobotoken(rescource: string): Promise<string>;
  getUserFavorites(userId: string): Promise<IUserFavorite[]>;
  deleteFavorite(userId: string, teamId:string):Promise<void>;
  addFavorite(userId: string, teamId:string, teamName:string):Promise<void>;
  getDoTTeams(rescource:string):Promise<IWorkspace[]>;
}