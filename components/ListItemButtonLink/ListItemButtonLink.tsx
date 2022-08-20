import {
  Badge,
  Grid,
  ListItem,
  ListItemButton,
  SvgIconTypeMap,
  Typography,
} from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import { UrlObject } from 'url';
import NextLinkComposed from '../NextLinkComposed';
declare type Url = string | UrlObject;

type ListItemButtonLinkProps = {
  href: Url;
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>> & {
    muiName: string;
  };
  label: string;
  notificationsCount?: number;
};

const ListItemButtonLink = ({
  label,
  href,
  Icon,
  notificationsCount,
}: ListItemButtonLinkProps) => {
  return (
    <ListItem divider>
      <ListItemButton component={NextLinkComposed} to={href}>
        <Grid alignItems="center" container spacing={2}>
          <Grid item>
            {notificationsCount ? (
              <Badge badgeContent={notificationsCount} color="error">
                <Icon />
              </Badge>
            ) : (
              <Icon />
            )}
          </Grid>
          <Grid item>
            <Typography>{label}</Typography>
          </Grid>
        </Grid>
      </ListItemButton>
    </ListItem>
  );
};

export default ListItemButtonLink;
