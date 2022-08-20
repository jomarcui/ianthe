import { forwardRef, ReactElement, Ref } from 'react';
import { TransitionProps } from '@mui/material/transitions';
import { Slide } from '@mui/material';

// eslint-disable-next-line react/display-name
const Transition = forwardRef(
  (
    props: TransitionProps & {
      children: ReactElement;
    },
    ref: Ref<unknown>
  ) => <Slide direction="up" ref={ref} {...props} />
);

export default Transition;
