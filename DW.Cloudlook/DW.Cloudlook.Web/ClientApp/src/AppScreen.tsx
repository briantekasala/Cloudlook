import * as React from "react";
import { useState } from "react";
import { PageType } from "./enums/PageType";
import { ScopeSelector } from "./components/scopeSelector/ScopeSelector";
import { WelcomeHeader } from "./components/welcomeHeader/WelcomeHeader";
import { FileSelector } from "./components/fileSelector/FileSelector";
import { MsTeamsScope } from "./components/msTeamsScope/MsTeamScope";
import { OneDriveScope } from "./components/oneDriveScope/OneDriveScope";
import { DotScreen } from "./components/doT/DotScreen";

export interface IAppScreenProps {
  token: string;
  bootstrapToken: string;
  userId: string;
}

export const AppScreen: React.FC<IAppScreenProps> = (
  props: IAppScreenProps
) => {
  const [selectedPage, setSelectedPage] = useState<PageType>(PageType.Home);

  switch (selectedPage) {
    case PageType.Home:
      return (
        <div>
          <WelcomeHeader />
          <ScopeSelector {...props} setSelectedPage={setSelectedPage} />
          <FileSelector {...props} token={props.token} />
        </div>
      );
    case PageType.TeamsMain:
      return (
        <MsTeamsScope
          setSelectedPage={setSelectedPage}
          bootstrapToken={props.bootstrapToken}
          token={props.token}
          userId={props.userId}
        />
      );
    case PageType.DoT:
      return (
        <DotScreen
          {...props}
          setSelectedPage={setSelectedPage}
          bootstrapToken={props.bootstrapToken}
          backDotscreen={""}
          token={props.token}
        />
      );
    case PageType.OneDrive:
      return (
        <OneDriveScope
          {...props}
          setSelectedPage={setSelectedPage}
          token={props.token}
        />
      );
    default:
      return (
        <div>
          <strong>Page Not Found</strong>
        </div>
      );
  }
};
