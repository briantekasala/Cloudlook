import * as React from "react";
import {
  Pivot,
  PivotItem,
  Spinner,
  SpinnerSize,
  Fabric,
  DetailsList,
  DetailsListLayoutMode,
  FontIcon,
  IColumn,
} from "office-ui-fabric-react";
import { PageType } from "../../enums/PageType";
import { IWorkspace }from "../../models/IWorkspace";
import {DocViewer} from "../docViewer/DocViewer";
import { CloudlookService } from "../../services";
import { pivotStyles } from "../msTeamsScope/MsTeamScope";
export interface IDotScreenProps {
  setSelectedPage(pageType: PageType): void;
  bootstrapToken: string;
  backDotscreen: string;
  token: string;
}

export const DotScreen = (props: IDotScreenProps) => {
  let dotService = new CloudlookService("https://localhost:44381/api/doT",props.bootstrapToken)
  const selectedDoTTeams: string = "GetMyActiveTeams";
  const [dotListTeams, setDoTListTeams] = React.useState<IWorkspace[]>([]);
  const [dotLoadingTeams, setDoTLoadingTeams] = React.useState<boolean>(true);
  const [dotTeam, setDoTTeam] = React.useState<IWorkspace>();
  React.useEffect(() => {
    const dotTeams = async () => {
      let result: IWorkspace[] = await dotService.getDoTTeams(selectedDoTTeams);
      setDoTListTeams(result);
      setDoTLoadingTeams(false);
    };
    dotTeams();
  }, []);

  const swicthTeams = async (item?: PivotItem) => {
    if (item) {
      let pivotTable = item.props.itemKey ?item.props.itemKey : ""
      console.log(pivotTable)
      let result: IWorkspace[] = await dotService.getDoTTeams(pivotTable);
      setDoTListTeams(result);
    }
  };
  const DoTTeamsColumnUtil: IColumn[] = [
    {
      key: "clomn1",
      name: "TeamsName",
      fieldName: "name",
      minWidth: 70,
      maxWidth: 80,
      onRender : (item:IWorkspace)=> {
        return <div className="doT" onClick={()=> {
          setDoTTeam({id:item.id,name:item.name})
        }}>{item.name}</div>
      }
    },
  ];
  if (!!dotTeam) {
    return (
      <DocViewer
        {...props}
        teamsName={dotTeam.name}
        selectedTeamsId={dotTeam.id}
        token={props.token}
        returnBackPage={PageType.Home}
        screenView={3}
      />
    );
  }

    return (
      <>
        <Fabric>
          <div className="ScopeScreen">
            <Pivot className="pivot" onLinkClick={swicthTeams} styles={pivotStyles}>
              <PivotItem headerText="Active Teams" itemKey="GetMyActiveTeams"></PivotItem>
              <PivotItem headerText="Personal Teams" itemKey="GetMyPersonalTeams"></PivotItem>
            </Pivot>
            {dotLoadingTeams && <Spinner size={SpinnerSize.large} />}
           
              <DetailsList
                items={dotListTeams}
                columns={DoTTeamsColumnUtil}
                setKey="set"
                layoutMode={DetailsListLayoutMode.justified}
              />
            
            <div className="ScopeFooter">
              <img className="delwareaccent" src="../assets/accentlastsection.png" />
              <div onClick={() => props.setSelectedPage(PageType.Home)}>
                <FontIcon className="backButton" aria-label="ChevronLeftSmall" iconName="ChevronLeftSmall" />
              </div>
            </div>
          </div>
        </Fabric>
      </>
    );
  
};

