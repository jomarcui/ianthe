import { StyledAvatar, StyledListItemAvatar } from './ListItemAvatar.styles';

const ListItemAvatar = ({ children }: { children: React.ReactNode }) => {
  return (
    <StyledListItemAvatar>
      <StyledAvatar>{children}</StyledAvatar>
    </StyledListItemAvatar>
  );
};

export default ListItemAvatar;
