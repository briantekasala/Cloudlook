import * as React from "react";
import { PageType } from "../../enums/PageType";
import { DocViewer } from "../docViewer/DocViewer";

interface IOneDriveScopeProps {
  setSelectedPage(PageType: PageType): void;
  token: string;
}

export const OneDriveScope: React.FC<IOneDriveScopeProps> = (props: IOneDriveScopeProps) => {
  return (
    <>
      <DocViewer
        teamsName="OneDrive"
        token={props.token}
        selectedTeamsId={""}
        setSelectedPage={props.setSelectedPage}
        returnBackPage={PageType.Home}
        screenView={2}
      />
    </>
  );
};
