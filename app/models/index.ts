import * as artist from "./artist.server"
import * as artwork from "./artwork.server"
import * as exhibition from "./exhibition.server"
import * as userPassword from "./user-password.server"
import * as userProfile from "./user-profile.server"
import * as userRole from "./user-role.server"
import * as user from "./user.server"

export const model = {
  artwork,
  artist,
  exhibition,
  user,
  userPassword,
  userProfile,
  userRole,
}
