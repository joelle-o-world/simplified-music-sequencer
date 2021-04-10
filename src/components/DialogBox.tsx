import React, {FunctionComponent} from 'react';
import classNames from 'classnames';
import './DialogBox.sass';

export const DialogBox: FunctionComponent<{
  className?: string;
}> = ({children, className}) => {
  return <div className="DialogBoxWrapper">
    <div className={classNames("DialogBox", className)}>
      {children}
    </div>
  </div>
}
