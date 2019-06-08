import * as React from "react";
import { Command, CommandGroup, GetIcon } from "../types";
import { MdeToolbarButtonGroup } from "./MdeToolbarButtonGroup";
import { MdeToolbarDropdown } from "./MdeToolbarDropdown";
import { MdeToolbarButton } from "./MdeToolbarButton";
import { Tab } from "../types/Tab";
import { L18n } from "..";
import { classNames } from "../util/ClassNames";
import { insertText } from "../util/InsertTextAtPosition";

export interface MdeToolbarProps {
  getIcon: GetIcon;
  commands: CommandGroup[];
  onCommand: (command: Command) => void;
  onTabChange: (tab: Tab) => void;
  onImageUpload: (tab: File, scene: string) => string;
  readOnly: boolean;
  tab: Tab,
  l18n: L18n,
  myRef?: any
}

function getDataTransferFiles(event) {
  var dataTransferItemsList = [];

  if (event.dataTransfer) {
    var dt = event.dataTransfer;
    if (dt.files && dt.files.length) {
      dataTransferItemsList = dt.files;
    } else if (dt.items && dt.items.length) {
      // During the drag even the dataTransfer.files is null
      // but Chrome implements some drag store, which is accesible via dataTransfer.items
      dataTransferItemsList = dt.items;
    }
  } else if (event.target && event.target.files) {
    dataTransferItemsList = event.target.files;
  }
  // Convert from DataTransferItemsList to the native Array
  return Array.prototype.slice.call(dataTransferItemsList);
}

function insertImage(src, ref) {
  const textArea = ref.current.parentElement.querySelector(".mde-text")
  insertText(textArea, `![](${src})`)
}

export class MdeToolbar extends React.Component<MdeToolbarProps> {
  constructor(props) {
    super(props);

    this['myRef'] = React.createRef();
  }


  handleTabChange = (tab: Tab) => {
    const { onTabChange } = this.props;
    onTabChange(tab);
  };

  onImagePicked = async (ev) => {
    if (!this.props.onImageUpload) {
      console.warn(
        "uploadImage callback must be defined to handle image uploads."
      );
    }
    const files = getDataTransferFiles(ev);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const src = await this.props.onImageUpload(file, 'card')
      insertImage(src, this['myRef'])
    }
  }

  render() {
    const { l18n } = this.props;
    const { getIcon, children, commands, onCommand, readOnly } = this.props;
    if ((!commands || commands.length === 0) && !children) {
      return null;
    }
    return (
      <div className="mde-header" ref={this['myRef']}>
        <div className="mde-tabs">
          <button
            type="button"
            className={classNames({ "selected": this.props.tab === "write" })}
            onClick={() => this.handleTabChange("write")}
          >
            {l18n.write}
          </button>
          <button
            type="button"
            className={classNames({ "selected": this.props.tab === "preview" })}
            onClick={() => this.handleTabChange("preview")}
          >
            {l18n.preview}
          </button>
        </div>
        {
          commands.map((commandGroup: CommandGroup, i: number) => (
            <MdeToolbarButtonGroup key={i} hidden={this.props.tab === "preview"}>
              {
                commandGroup.commands.map((c: Command, j) => {
                  if (c.children) {
                    return (
                      <MdeToolbarDropdown
                        key={j}
                        buttonProps={c.buttonProps}
                        getIcon={getIcon}
                        buttonContent={c.icon ? c.icon(getIcon) : getIcon(c.name)}
                        commands={c.children}
                        onCommand={(cmd) => onCommand(cmd)}
                        readOnly={readOnly}
                      />
                    );
                  }
                  return <MdeToolbarButton
                    key={j}
                    name={c.name}
                    buttonContent={c.icon ? c.icon(getIcon) : getIcon(c.name)}
                    buttonProps={c.buttonProps}
                    onClick={() => onCommand(c as Command)}
                    readOnly={readOnly}
                    buttonComponentClass={c.buttonComponentClass}
                    onImagePicked={this.onImagePicked}
                  />;
                })
              }
            </MdeToolbarButtonGroup>))
        }
      </div>
    );
  }
}
