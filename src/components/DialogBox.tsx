import React, {FunctionComponent} from 'react';
import classNames from 'classnames';
import './DialogBox.sass';

export const DialogBox: FunctionComponent<{
  className?: string;
  id?: string;
  darkBg?: boolean;
  onBGClick?: () => void;
}> = ({children, className, id, darkBg=false, onBGClick}) => {
  return <div 
    className={classNames("DialogBoxWrapper", {darkBg})} 
    onClick={e => {
      if(e.target == e.currentTarget && onBGClick)
        onBGClick()
    }}>
  <div id={id} className={classNames("DialogBox", className)}>
      {children}
    </div>
  </div>
}
