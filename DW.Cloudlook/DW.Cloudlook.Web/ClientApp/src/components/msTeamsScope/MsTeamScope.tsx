import {
  CheckboxVisibility,
  DetailsList,
  DetailsListLayoutMode,
  Fabric,
  FontIcon,
  Pivot,
  PivotItem,
} from "office-ui-fabric-react";
import * as React from "react";
import { PageType } from "../../enums/PageType";
import { TeamsScope } from "../../enums/TeamsScope";
import { ICloudlookService, IGraphService } from "../../services/contracts";
import { CloudlookService, GraphService } from "../../services";

import { IUserFavorite } from "../../models/IUserFavorite";
import { ITeam } from "../../models/ITeam";
import { DocViewer } from "../docViewer/DocViewer";

export interface IMsTeamsScopeProps {
  setSelectedPage(pageType: PageType): void;
  bootstrapToken: string;
  token: string;
  userId: string;
}

export const MsTeamsScope: React.FC<IMsTeamsScopeProps> = (
  props: IMsTeamsScopeProps
) => {
  const cloudlookService: ICloudlookService = new CloudlookService(
    "https://localhost:44381",
    props.bootstrapToken
  );
  const graphService: IGraphService = new GraphService(props.token);

  const [userFavorites, setUserFavorites] = React.useState<IUserFavorite[]>([]);
  const [joinedTeams, setJoinedTeams] = React.useState<ITeam[]>([]);
  const [selectedTeam, setSelectedTeam] = React.useState<ITeam>();
  const [selectedScope, setSelectedScope] = React.useState<TeamsScope>(
    TeamsScope.Favorites
  );

  React.useEffect(() => {
    const getTeams = async () => {
      if (selectedScope === TeamsScope.Favorites) {
        const favorites = await cloudlookService.getUserFavorites(props.userId);
        setUserFavorites(favorites);
      } else {
        const joined = await graphService.getJoinedTeams();
        setJoinedTeams(joined);
      }
    };
    getTeams();
  }, [selectedScope]);

  const onSwitchScope = async (item?: PivotItem) => {
    if (item?.props.itemKey === "Favorites") {
      setSelectedScope(TeamsScope.Favorites);
    } else {
      setSelectedScope(TeamsScope.Joined);
    }
  };

  const onRenderDeleteIcon = (userFavorite: IUserFavorite) => {
    return (
      <FontIcon
        className="fontIcon"
        onClick={async () => {
          await cloudlookService.deleteFavorite(
            props.userId,
            userFavorite.teamId
          );
          const favorites = await cloudlookService.getUserFavorites(
            props.userId
          );
          setUserFavorites(favorites);
        }}
        iconName={"Delete"}
      />
    );
  };
  const onRenderStarIcon = (scope: TeamsScope, team: ITeam) => {
    const isFavorite: boolean =
      scope === TeamsScope.Favorites ||
      userFavorites.some((f: IUserFavorite) => f.teamId === team.id);
    return (
      <FontIcon
        className="fontIcon"
        onClick={async () => {
          isFavorite
            ? await cloudlookService.deleteFavorite(props.userId, team.id)
            : await cloudlookService.addFavorite(
                props.userId,
                team.id,
                team.displayName
              );

          const favorites = await cloudlookService.getUserFavorites(
            props.userId
          );
          setUserFavorites(favorites);
        }}
        iconName={isFavorite ? "FavoriteStarFill" : "FavoriteStar"}
      />
    );
  };
  const getColumns = (scope: TeamsScope) => {
    return [
      {
        key: "favo",
        name: "",
        fieldName: "action",
        minWidth: 20,
        maxWidth: 20,
        onRender:
          scope === TeamsScope.Favorites
            ? (item: IUserFavorite) => onRenderDeleteIcon(item)
            : (item: ITeam) => {
                if (item.isArchived === false) {
                  return onRenderStarIcon(scope, item);
                }
              },
      },
      {
        key: scope === TeamsScope.Favorites ? "teamName" : "displayName",
        fieldName: scope === TeamsScope.Favorites ? "teamName" : "displayName",
        name: "Team Name",
        minWidth: 120,
        onRender:
          scope === TeamsScope.Favorites
            ? (item: IUserFavorite) => {
                return (
                  <div
                    className="teamName"
                    onClick={() =>
                      setSelectedTeam({
                        id: item.teamId,
                        displayName: item.teamName,
                        isArchived: !!undefined,
                      })
                    }
                  >
                    {item.teamName}
                  </div>
                );
              }
            : (item: ITeam) => {
                if (item.isArchived === false) {
                  return (
                    <div
                      className="teamName"
                      onClick={() => setSelectedTeam(item)}
                    >
                      {item.displayName}
                    </div>
                  );
                }
              },
      },
    ];
  };

  if (!!selectedTeam) {
    return (
      <DocViewer
        {...props}
        teamsName={selectedTeam.displayName}
        selectedTeamsId={selectedTeam.id}
        token={props.token}
        returnBackPage={PageType.Home}
        screenView={1}
      />
    );
  }

  return (
    <>
      <Fabric>
        <div className="ScopeScreen">
          <Pivot
            className="pivot"
            onLinkClick={onSwitchScope}
            styles={pivotStyles}
          >
            <PivotItem
              headerText="My Favorites"
              itemKey="Favorites"
              itemIcon="FavoriteStarFill"
            >
              {userFavorites.length === 0 ? (
                <p>there are no favorites</p>
              ) : (
                <div className="teamContainer">
                  <DetailsList
                    items={userFavorites}
                    columns={getColumns(TeamsScope.Favorites)}
                    layoutMode={DetailsListLayoutMode.justified}
                    checkboxVisibility={CheckboxVisibility.hidden}
                  />
                </div>
              )}
            </PivotItem>
            <PivotItem
              headerText="Personal Teams"
              itemKey="Joined"
              itemIcon="UserFollowed"
            >
              {joinedTeams.length === 0 ? (
                <p>there are no teams</p>
              ) : (
                <DetailsList
                  items={joinedTeams}
                  columns={getColumns(TeamsScope.Joined)}
                  layoutMode={DetailsListLayoutMode.justified}
                  checkboxVisibility={CheckboxVisibility.hidden}
                />
              )}
            </PivotItem>
          </Pivot>

          <div className="ScopeFooter">
            <div onClick={() => props.setSelectedPage(PageType.Home)}>
              <FontIcon
                className="backButtonTeam"
                aria-label="ChevronLeftSmall"
                iconName="ChevronLeftSmall"
              />
            </div>
          </div>
        </div>
      </Fabric>
    </>
  );
};

export const pivotStyles = {
  root: {
    color: "yellow",
  },
  linkIsSelected: {
    selectors: {
      ":before": {
        height: "4px",
        backgroundColor: "#72c4bf", // was previously defaulted at 2px
      },
    },
  },
};
