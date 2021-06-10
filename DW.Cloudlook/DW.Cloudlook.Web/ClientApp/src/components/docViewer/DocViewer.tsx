import * as React from "react";
import { PageType } from "../../enums/PageType";
import { IFileItem } from "../../models/IFileItem";
import { IGraphService } from "../../services/contracts";
import { GraphService } from "../../services";
import { DocViewerColumns } from "./DocViewerColumns";
import { DocViewerFooter } from "./DocViewerFooter";
import {
  DetailsList,
  DetailsListLayoutMode,
  Fabric,
  Selection,
  PrimaryButton,
  Stack,
  Breadcrumb,
  IBreadcrumbItem,
  
} from "office-ui-fabric-react";
import { checkbox } from "../fileSelector/FileSelector";

export interface IDocViewerProps {
  teamsName: string;
  selectedTeamsId: string;
  token: string;
  returnBackPage: PageType;
  setSelectedPage(pageType: PageType): void;
  screenView : number
}

export const DocViewer: React.FC<IDocViewerProps> = (props: IDocViewerProps) => {
  const { teamsName, token, selectedTeamsId } = props;
  const graphService: IGraphService = new GraphService(token);

  const [fileItems, setFileItems] = React.useState<IFileItem[]>([]);
  const [selectedItems, setSelectedItems] = React.useState<IFileItem[]>([]);
  
  const breadCrumbClick = (ev?: React.MouseEvent<HTMLElement, MouseEvent> | undefined, item?: IBreadcrumbItem | undefined) => {
    ev;
    const clickedFolder: IBreadcrumbItem[] = [];
    breadCrumbItems.forEach((item) => {
      clickedFolder.push({ text: item.text, key: item.key, onClick: breadCrumbClick });
      if (item.key === item.key) {
        setBreadCrumbItems(clickedFolder);
      }
    });
  };
  const [breadCrumbItems, setBreadCrumbItems] = React.useState<IBreadcrumbItem[]>([
    { text: "Documents", key: selectedTeamsId, onClick: breadCrumbClick },
  ]);

  React.useEffect(() => {
    const documents = async () => {
      if (teamsName == "OneDrive") {
        const result = await graphService.getOneDriveFiles();
        setFileItems(result);
      } else {
        const result = await graphService.getTeamFiles(selectedTeamsId);
        setFileItems(result);
      }
    };
    documents();
  }, []);

  const selectedDocViewer: any = new Selection({
    onSelectionChanged: async () => {
      const items: any[] = selectedDocViewer.getSelection();
      if (items.length === 0 || items[0].downloadLink) {
        setSelectedItems(items);
        return items;
      }
      if (items[0].isFolder) {
        if (teamsName == "OneDrive") {
          const result: IFileItem[] = await graphService.getOneDriveFolderFiles(items[0].id);
          setBreadCrumbItems([...breadCrumbItems, { text: items[0].name, key: items[0].id, onClick: breadCrumbClick }]);
          setFileItems(result);
          return items;
        } else {
          const result: IFileItem[] = await graphService.getTeamFolderFiles(selectedTeamsId, items[0].id);
          setBreadCrumbItems([...breadCrumbItems, { text: items[0].name, key: items[0].id, onClick: breadCrumbClick }]);
          setFileItems(result);
          return items;
        }
      }
    },
    getKey: (item: IFileItem) => {
      return item.id;
    },
  });

  const AddAttachment = () => {
    selectedItems.forEach(async (file: IFileItem) => {
      Office.context.mailbox.item?.addFileAttachmentAsync(
        file.downloadLink,
        file.name,
        { isInline: false },
        function callback(result) {
          if (result.error) {
            console.log(result.error);
          } else {
            console.log("Attachment added");
          }
        }
      );
    });
  };
  return (
    <>
      <div className="ms-fontSize-32">{teamsName}</div>
        <Fabric className="Docmain">
          <Breadcrumb
            items={breadCrumbItems}
            maxDisplayedItems={5}
            overflowAriaLabel="More links"
          />
          <div className="DocViewerScreen">
          <DetailsList
            items={fileItems}
            columns={DocViewerColumns}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            selection={selectedDocViewer}
            onRenderCheckbox={checkbox}
          />
          </div>
        </Fabric>

        <Stack>
          <PrimaryButton className="addbutton" onClick={AddAttachment} text="Add Attachment" />
          <DocViewerFooter {...props} setSelectedPage={props.setSelectedPage} pageType={props.returnBackPage} screenView={props.screenView} />
        </Stack>
    </>
  );
};


