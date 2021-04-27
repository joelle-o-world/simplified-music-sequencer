import React, {FunctionComponent, ReactNode} from 'react';
import classNames from 'classnames';
import './DialogBox.sass';

export const DialogBox: FunctionComponent<{
  className?: string;
  id?: string;
  darkBg?: boolean;
  onBGClick?: () => void;
  above?: ReactNode;
  below?: ReactNode;
}> = ({children, className, id, darkBg=false, onBGClick, above, below}) => {
  return <div 
    className={classNames("DialogBoxWrapper", {darkBg})} 
    onClick={e => {
      if(e.target == e.currentTarget && onBGClick)
        onBGClick()
    }}>
    {above}
    <div id={id} className={classNames("DialogBox", className)}>
      {children}
    </div>
    {below}
  </div>
}
