export interface ISearchResult {
  value: ISearchResultValue[];
}

export interface ISearchResultValue {
  searchTerms: string[];
  hitsContainers: IHitsContainer[];
}

export interface IHitsContainer {
  total: number;
  moreResultsAvailable: boolean;
  hits: IHit[]
}

export interface IHit {
  hitId: string;
  rank: number;
  summary: string;
  resource: IResource;
}

export interface IResource {
  ["@microsoft.graph.downloadUrl"]: string;
  name: string;
  lastModifiedDateTime: string;
  id: string;
  parentReference: IParentReference
}

export interface IParentReference {
  driveId: string;
  siteId: string
}