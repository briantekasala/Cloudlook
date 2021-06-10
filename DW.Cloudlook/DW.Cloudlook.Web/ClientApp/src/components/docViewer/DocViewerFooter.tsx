import { FontIcon } from "office-ui-fabric-react";
import * as React from "react";
import { PageType } from "../../enums/PageType";

export interface IDocViewerFooterProps {
  setSelectedPage(pageType: PageType): void;
  pageType: PageType;
  screenView : number
}

export const DocViewerFooter: React.FC<IDocViewerFooterProps> = (props: IDocViewerFooterProps) => {
  const setSelectedPage = props.setSelectedPage;
  console.log(props.pageType)
  return (
    <div onClick={() => {setSelectedPage(props.pageType)} }>
    <FontIcon className="backButton" aria-label="ChevronLeftSmall" iconName="ChevronLeftSmall" />
  </div>
  );
};
