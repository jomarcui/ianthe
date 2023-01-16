import {
  Stack,
  Avatar,
  Card,
  CardHeader,
  Button,
  Dialog,
  DialogTitle,
  IconButton,
  styled,
  DialogActions,
  DialogContent,
  Typography,
} from '@mui/material';
import {
  Close as CloseIcon,
  InfoOutlined as InfoOutlinedIcon,
} from '@mui/icons-material';
import { RoundedButton } from '../../styledComponents/Buttons';
import { useSession } from 'next-auth/react';
import { ReactNode, useState } from 'react';
import { useGetTransactionByIdQuery } from '../../redux/api/transactionsApi';
import { getTotalCredits } from '../../helpers/transactionsHelper';

const AccountCardStyled = styled(Card)(({}) => ({
  '& .MuiCardHeader-action': {
    alignSelf: 'inherit',
  },
}));

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

interface DialogTitleProps {
  id: string;
  children?: ReactNode;
  onClose: () => void;
}

function BootstrapDialogTitle(props: DialogTitleProps) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

interface CashInDialogProps {
  bootstrapDialogIsOpen: boolean;
  handleBootstrapDialogClose: () => void;
}

function CashInDialog({
  bootstrapDialogIsOpen,
  handleBootstrapDialogClose,
}: CashInDialogProps) {
  return (
    <BootstrapDialog
      onClose={handleBootstrapDialogClose}
      open={bootstrapDialogIsOpen}
    >
      <BootstrapDialogTitle
        id="customized-dialog-title"
        onClose={handleBootstrapDialogClose}
      >
        How to Cash In
      </BootstrapDialogTitle>
      <DialogContent dividers>
        <Typography gutterBottom>Send GCash to 09173005463</Typography>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleBootstrapDialogClose}>
          OK
        </Button>
      </DialogActions>
    </BootstrapDialog>
  );
}

const UserActionCard = () => {
  const { data: session, status: sessionStatus } = useSession();
  const { data: getTransactionByIdData } = useGetTransactionByIdQuery(
    session?.user['id'],
    {
      skip: !session,
    }
  );
  const [bootstrapDialogIsOpen, setBootstrapDialogIsOpen] = useState(false);

  const handleAddCreditsButtonClick = () => setBootstrapDialogIsOpen(true);

  const handleBootstrapDialogClose = () => setBootstrapDialogIsOpen(false);

  return (
    <>
      {sessionStatus === 'authenticated' ? (
        <>
          <AccountCardStyled id="user-action-card">
            <CardHeader
              action={
                <Button
                  onClick={handleAddCreditsButtonClick}
                  startIcon={<InfoOutlinedIcon />}
                >
                  Cash in
                </Button>
              }
              avatar={
                <Avatar>{`${session.user.name.split(' ')[0][0]}${
                  session.user.name.split(' ')[1][0]
                }`}</Avatar>
              }
              subheader={`₱${getTotalCredits(
                getTransactionByIdData?.data.transactions
              ).toFixed(2)}`}
              subheaderTypographyProps={{ fontWeight: 700 }}
              title={session.user.name}
            />
          </AccountCardStyled>
          <CashInDialog
            bootstrapDialogIsOpen={bootstrapDialogIsOpen}
            handleBootstrapDialogClose={handleBootstrapDialogClose}
          />
        </>
      ) : (
        <Card>
          <Stack direction="row" spacing={2}>
            <RoundedButton size="large">Register</RoundedButton>
            <RoundedButton size="large">Sign In</RoundedButton>
          </Stack>
        </Card>
      )}
    </>
  );
};

export default UserActionCard;
