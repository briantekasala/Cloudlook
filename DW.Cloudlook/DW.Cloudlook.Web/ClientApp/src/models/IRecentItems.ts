export interface IRecentItems {
  name: string;
  id: string;
  webDavUrl: string;
  lastModifiedDateTime: string;
  remoteItem: IParentReference;
}
export interface IParentReference {
  id: string;
  driveId: string;
  parentReference: IParentReference;
  sharepointIds: ISharePointIds;
}
export interface ISharePointIds {
  siteId: string;
}
