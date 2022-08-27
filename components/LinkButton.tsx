import { forwardRef } from 'react';
import { Button } from 'react-bulma-components';

/* eslint-disable react/display-name */
const LinkButton = forwardRef((props, ref) => (
  <Button {...props} domRef={ref} />
));

export default LinkButton;
