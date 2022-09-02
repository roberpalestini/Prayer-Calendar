import { forwardRef } from 'react';
import { Button } from 'react-bulma-components';
import React from 'react';
/* eslint-disable react/display-name */

const LinkButton = forwardRef<'button', any>((props, ref) => (
  <Button {...props} domRef={ref} />
));

export default LinkButton;
