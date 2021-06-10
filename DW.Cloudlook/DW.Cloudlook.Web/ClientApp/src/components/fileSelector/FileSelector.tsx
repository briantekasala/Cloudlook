import * as React from "react";
import { useState, useEffect } from "react";
import { Spinner, SpinnerSize } from "office-ui-fabric-react/lib/Spinner";
import { GraphService } from "../../services/GraphService";
import { IGraphService } from "../../services/contracts/IGraphService";
import {
  DetailsList,
  DetailsListLayoutMode,
  Fabric,
  MarqueeSelection,
  Selection,
  PrimaryButton,
  Stack,
  SearchBox,
  IObjectWithKey,
  Checkbox,
  IDetailsListCheckboxProps,
  ICheckboxStyleProps,
  ICheckboxStyles,
} from "office-ui-fabric-react";
import { ColumnUtil } from "../../utils/ColumnUtil";
import { IFileItem } from "../../models/IFileItem";

export interface IFileSelectorProps {
  token: string;
}

export const FileSelector: React.FC<IFileSelectorProps> = (
  props: IFileSelectorProps
) => {
  const graphService: IGraphService = new GraphService(props.token);

  const [selectionDetails, setSelectionDetails] =
    useState<string>("Nothing selected");
  const [selectedFiles, setSelectedFiles] = useState<IObjectWithKey[]>([]);
  const [listItems, setListItems] = useState<IFileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [fileLoading, setFileLoading] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");

  let _selection = new Selection({
    onSelectionChanged: () => {
      setSelectionDetails(_getSelectionDetails());
    },
  });

  useEffect(() => {
    const listItems = async () => {
      let result: IFileItem[] = await graphService.getRecentFiles();
      setListItems(result);
      setLoading(false);
    };
    listItems();
  }, []);

  const _getSelectionDetails = (): string => {
    const selectionCount = _selection.getSelectedCount();
    const selectedFiles = _selection.getSelection();
    if (selectionCount <= 0) {
      return selectionDetails;
    } else {
      setSelectedFiles(selectedFiles);
      return `${selectionCount} items selected`;
    }
  };

  const AddAttachment = async () => {
    selectedFiles.forEach(async (file: any) => {
      let downloadLink: string = file.downloadLink;
      if (!downloadLink) {
        downloadLink = await graphService.getFileUrl(
          file.siteId,
          file.driveId,
          file.id
        );
      }
      Office.context.mailbox.item?.addFileAttachmentAsync(
        downloadLink,
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

  const searchBox = async (value: string) => {
    setFileLoading(true);
    let searchValue: string = value;
    setSearchTerm(searchValue);
    const results = await graphService.searchDriveItems(searchTerm);
    setListItems(results);
    setFileLoading(false);
  };

  if (loading) {
    return (
      <div className="fileSelector">
        <div className="loader">
          <Spinner label=" Loading..." size={SpinnerSize.large} />
        </div>
      </div>
    );
  } else {
    return (
      <Fabric>
        <p className="searchText">
          <strong>Search:</strong> The list below show the files you recently
          worked on. Use the search box to search withing Office 365
        </p>
        <SearchBox
          className="Searchbox"
          placeholder={"Search"}
          onSearch={(value) => searchBox(value)}
        />
        {fileLoading && (
          <Spinner
            className="fileLoader"
            label="Loading... files"
            size={SpinnerSize.large}
          />
        )}
        {!fileLoading && (
          <div className="filecontainer">
            <DetailsList
              items={listItems}
              columns={ColumnUtil}
              setKey="set"
              layoutMode={DetailsListLayoutMode.justified}
              selection={_selection}
              onRenderCheckbox={checkbox}
            />
          </div>
        )}
        <Stack>
          <PrimaryButton
            className="addbutton"
            onClick={AddAttachment}
            text="Add Attachment"
          />
        </Stack>
      </Fabric>
    );
  }
};

export const checkbox = (
  props: IDetailsListCheckboxProps | undefined
): JSX.Element => {
  return (
    <div>
      <Checkbox
        checked={props != undefined ? props.checked : undefined}
        styles={customiseCheckBox}
      />
    </div>
  );
};

export const customiseCheckBox = (
  props: ICheckboxStyleProps
): ICheckboxStyles => {
  const style: ICheckboxStyles = {
    checkbox: [
      {
        borderColor: "#72c4bf",
        background: "#72c4bf",
        borderRadius: "50%",
        height:"20px",
        width:"20px"
      },
      props.checked && {
        borderColor: "#72c4bf",
        background: "#72c4bf",
      },
    ],
  };

  return style;
};
