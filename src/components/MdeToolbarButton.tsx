import * as React from "react";

export interface MdeToolbarButtonProps {
  name: string;
  buttonComponentClass?: React.ComponentClass | string;
  buttonProps: any;
  buttonContent: React.ReactNode;
  onClick: React.MouseEventHandler<any>;
  readOnly: boolean;
  onImagePicked?: any;
}

export const MdeToolbarButton: React.SFC<MdeToolbarButtonProps> = (props) => {
  const { buttonComponentClass, buttonContent, buttonProps, onClick, readOnly, name, onImagePicked } = props;
  const finalButtonComponent = buttonComponentClass || "button";
  const hiddenInputStyles: React.CSSProperties = {
    position: 'absolute',
    top: '-100px',
    left: '-100px',
    visibility: 'hidden'
  }
  return (
    <li className="mde-header-item">
      {name === 'image' ? <input onChange={onImagePicked} type="file" style={hiddenInputStyles} /> : null}
      {React.createElement(finalButtonComponent, {
        "data-name": name,
        ...buttonProps,
        ...{
          onClick,
          disabled: readOnly,
          type: "button"
        }
      }, buttonContent)}
    </li>
  );
};
