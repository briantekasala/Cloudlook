
import { IColumn } from "office-ui-fabric-react/lib/DetailsList";
import { IFileItem } from "../../models/IFileItem";
import { renderIconImages } from "../../utils/ColumnUtil";

export const DocViewerColumns: IColumn[] = [
  {
    key: "column1",
    name: "Icon",
    iconName: "page",
    isIconOnly: true,
    minWidth: 12,
    maxWidth: 12,
    onRender: (item: IFileItem) => {
      if (item.isFolder) {
        let fileTypeIcon = "folder"
        return renderIconImages(fileTypeIcon)
      }
      else {
        let fileTypeIcon = item.name.split(".")[1];
        return renderIconImages(fileTypeIcon);
      }
    },
  },
  {
    key: "clomn1",
    name: "Name",
    fieldName: "name",
    minWidth: 60,
    maxWidth: 80,
    onRender :(item:IFileItem)=>{
      return(
        <div className="oneDriveTeam">
          {item.name}
        </div>
      )
    }
  },
];