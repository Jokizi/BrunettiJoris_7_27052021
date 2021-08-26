import Input from "../Input/Input";
import OutlinedChips from "../CardAllUsers/CardAllUsers";
const SearchUsers = ({ myUserId }) => {
  return (
    <div>
      <div>
        <Input label="chercher un utilisateur" type="search" />
      </div>
      <div>
        <OutlinedChips myUserId={myUserId} />
      </div>
    </div>
  );
};
export default SearchUsers;
