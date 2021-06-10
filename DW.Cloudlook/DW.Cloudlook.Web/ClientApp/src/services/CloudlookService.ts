import { IUserFavorite } from "../models/IUserFavorite";
import { IWorkspace } from "../models/IWorkspace";
import { ICloudlookService } from "./contracts";

export class CloudlookService implements ICloudlookService {

  url: string;
  token: string;

  constructor(apiUrl: string, bootstrapToken: string) {
    this.url = apiUrl;
    this.token = bootstrapToken
  }

  async requireobotoken(resource: string) {
    try {
      const response = await fetch(`${this.url}/Auth/AcquireOboToken?resource=` + resource,
        {
          headers: {
            Authorization: `Bearer ${this.token}`
          },
          method: "GET"
        }
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
      return await response.text();


    } catch (error) {
      throw new Error(error);
    }
  }

  async getUserFavorites(userId: string): Promise<IUserFavorite[]> {
    try {
      const response = await fetch(`${this.url}/Favorites/GetListOfFavorites?userId=${userId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const result: IUserFavorite[] = await response.json();
      return result;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteFavorite(userId: string, teamId:string): Promise<void> {
    try {
      const response = await fetch(`${this.url}/Favorites/DeleteFavorites?teamId=${teamId}&userId=${userId}`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: "DELETE"
      })
      if (!response.ok) {
        throw new Error(await response.text());
      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async addFavorite(userId: string, teamId:string, teamName:string): Promise<void> {
    let data = {
      UserId: userId,
      TeamId: teamId,
      TeamName: teamName
    }
    try {
      const response = await fetch(`${this.url}/Favorites/AddFavorite`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data)
      })
      if (!response.ok) {
        throw new Error(await response.text());
      }

    } catch (error) {
      throw new Error(error);
    }
  }
  
  async getDoTTeams(rescource: string): Promise<IWorkspace[]> {
    try {
      const response = await fetch(`${this.url}/${rescource}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      if (!response.ok) {
        throw new Error(await response.text());
      }
      const result : IWorkspace[]= await response.json();
      return result
      
    } catch (error) {
      throw new Error(error);
    }

  }

}