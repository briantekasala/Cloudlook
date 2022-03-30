import { IColumn } from "office-ui-fabric-react/lib/DetailsList";
import { IFileItem } from "../models/IFileItem";

export const ColumnUtil: IColumn[] = [
  {
    key: "column1",
    name: "Icon",
    iconName: "page",
    isIconOnly: true,
    minWidth: 40,
    maxWidth: 40,
    onRender: (item: IFileItem) => {
      let fileTypeIcon = item.name.split(".")[1];
      return renderIconImages(fileTypeIcon);
    },
  },

  {
    key: "clomn2",
    name: "Name",
    fieldName: "name",
    minWidth: 70,
    maxWidth: 80,
  },
];


export const renderIconImages = (item: string) => {
  const unsuportedFileTypes: string[] = ["tsx", "ts", "drawio", "undefined"];

  if (unsuportedFileTypes.some((value) => value === item)) {
    item = "txt";
  }
  return (
    <img
      className="icon"
      src={`https://static2.sharepointonline.com/files/fabric/assets/item-types/16/${item}.svg`}
      alt="icon"
    />
  );
};
