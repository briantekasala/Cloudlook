import { IFileItem } from "../models/IFileItem";
import { IRecentItems } from "../models/IRecentItems";
import { IHit, IHitsContainer, ISearchResultValue } from "../models/ISearchResult";
import { ISearchFileUrl } from "../models/ISearchFileUrl";
import { IGraphService } from "./contracts/IGraphService";
import { ITeam } from "../models/ITeam";
import { IDriveItem } from "../models/IDriveItem";


export class GraphService implements IGraphService {
  url: string;
  token: string;

  constructor(token: string) {
    this.url = `https://graph.microsoft.com/v1.0`;
    this.token = token;
  }

  async getRecentFiles(): Promise<IFileItem[]> {
    try {
      const response = await fetch(`${this.url}/me/drive/recent`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: "GET"
      }
      );
      if (!response.ok) {
        throw new Error(await response.text())
      }

      const result = await response.json();
      const items: IRecentItems[] = result.value;
      const fileItems: IFileItem[] = items.map((item: IRecentItems) => {
        return {
          name: item.name,
          lastModifiedDateTime: item.lastModifiedDateTime,
          downloadLink: "",
          siteId: item.remoteItem.sharepointIds.siteId,
          driveId: item.remoteItem.parentReference.driveId,
          id: item.remoteItem.id,
          isFolder: false
        }
      })
      return fileItems;
    }
    catch (error) {
      throw new Error(error);
    }
  }

  async searchDriveItems(searchTerm: string): Promise<IFileItem[]> {

    try {
      const response = await fetch(`${this.url}/search/query`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          'content-type': 'application/json;charset=UTF-8'
        },
        method: "POST",
        body: JSON.stringify({
          "requests": [
            {
              "entityTypes": [
                "driveItem"
              ],
              "query": {
                "queryString": `ContentTypeId:0x0101* ${searchTerm}`
              }
            }
          ]
        })

      })

      if (!response.ok) {
        throw new Error(await response.text())
      }
      const result = await response.json();
      const items: ISearchResultValue[] = result.value;
      const searchArray: IFileItem[] = [];
      items.forEach((searchResultValue: ISearchResultValue) => {
        searchResultValue.hitsContainers.forEach((hitsContainer: IHitsContainer) => {
          hitsContainer.hits.forEach((hit: IHit) => {
            searchArray.push({
              name: hit.resource.name,
              lastModifiedDateTime: hit.resource.lastModifiedDateTime,
              downloadLink: hit.resource["@microsoft.graph.downloadUrl"],
              siteId: hit.resource.parentReference.siteId,
              driveId: hit.resource.parentReference.driveId,
              id: hit.resource.id,
              isFolder: false
            })
          })

        })
      })
      return searchArray;

    } catch (error) {
      throw new Error(error);
    }
  }

  async getFileUrl(siteId: string, driveId: string, itemsId: string): Promise<string> {
    try {
      const response = await fetch(`${this.url}/sites/${siteId}/drives/${driveId}/items/${itemsId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${this.token}`
        }
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }
      const result: ISearchFileUrl = await response.json();
      return result["@microsoft.graph.downloadUrl"]

    } catch (error) {
      throw new Error(error);
    }

  }

  async getJoinedTeams(): Promise<ITeam[]> {
    try {
      const response = await fetch(`${this.url}/me/joinedTeams`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: "GET"
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }
      const result = await response.json()
      return result.value;
    }

    catch (error) {
      throw new Error(error)
    }
  }
  async getTeamFiles(groupId: string): Promise<IFileItem[]> {
    try {
      const response = await fetch(`${this.url}/groups/${groupId}/drive/root/children`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: "GET"
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }
      const result = await response.json();
      return this.mapDriveItemToFileItem(result.value);
    }

    catch (error) {
      throw new Error(error)
    }
  }
  async getOneDriveFiles(): Promise<IFileItem[]> {
    try {
      const response = await fetch(`${this.url}/me/drive/root/children`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: "GET"
      })
      if (!response.ok) {
        throw new Error(await response.text())
      }
      const result = await response.json();
      return this.mapDriveItemToFileItem(result.value);
    }

    catch (error) {
      throw new Error(error)
    }
  }
  async getTeamFolderFiles(groupId: string, folderId: string): Promise<IFileItem[]> {
    try {
      const response = await fetch(`${this.url}/groups/${groupId}/drive/items/${folderId}/children`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: "GET"
      })

      if (!response.ok) {
        throw new Error(await response.text())

      }
      const result = await response.json();
      return this.mapDriveItemToFileItem(result.value);
    } catch (error) {
      throw new Error(error)
    }
  }
  async getOneDriveFolderFiles(folderId: string): Promise<IFileItem[]> {
    try {
      const response = await fetch(`${this.url}/me/drive/items/${folderId}/children`, {
        headers: {
          Authorization: `Bearer ${this.token}`
        },
        method: "GET"
      })

      if (!response.ok) {
        throw new Error(await response.text())

      }
      const result = await response.json();
      return this.mapDriveItemToFileItem(result.value);
    } catch (error) {
      throw new Error(error)
    }
  }
  //#region private methods
  mapDriveItemToFileItem = (driveItems: IDriveItem[]): IFileItem[] => {
    const fileItems: IFileItem[] = driveItems.map((item: IDriveItem) => {
      return {
        name: item.name,
        lastModifiedDateTime: item.lastModifiedDateTime,
        downloadLink: item["@microsoft.graph.downloadUrl"],
        siteId: item.parentReference.id,
        driveId: item.parentReference.driveId,
        id: item.id,
        isFolder: !!item.folder
      }
    });
    return fileItems;
  }
  //#endregion
}