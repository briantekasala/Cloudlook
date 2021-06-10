import * as React from "react";
import { PageType } from "../../enums/PageType";

export interface IScopeSelectorProps {
  setSelectedPage(pageType: PageType): void
}

export const ScopeSelector: React.FC<IScopeSelectorProps> = (props:IScopeSelectorProps) => {
  const setSelectedPage = props.setSelectedPage

  return (
    <div className="scopeview">
      <nav>
        <ul className="scopes">
          <li>
            <img onClick={() => setSelectedPage(PageType.TeamsMain)} className="scopeslogo" src="../assets/iconTeams.png" />
          </li>
          <li>
            <img onClick={() => setSelectedPage(PageType.OneDrive)} className="scopeslogo" src="../assets/iconOneDrive.png" />
          </li>
          <li>
          <img onClick={() => setSelectedPage(PageType.DoT)} className="scopeslogo" src="../assets/delaware - dee-red.jpg" />
          </li>
        </ul>
      </nav>
    </div>
  );
};