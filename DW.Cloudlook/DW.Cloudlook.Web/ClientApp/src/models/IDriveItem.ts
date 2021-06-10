
export interface IDriveItem {
	name: string;
	lastModifiedDateTime: string;
	parentReference: IDriveParentReference;
	folder: any;
	id: string;
	["@microsoft.graph.downloadUrl"]: string;
}

export interface IDriveParentReference {
	id: string;
	driveId: string;
}
