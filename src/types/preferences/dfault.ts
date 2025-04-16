import { UserPreferences } from "./UserPreferences";

export const defaultPreferences: UserPreferences = {
  audio: {
    distortVoice: false,
    safeContextOnly: false,
    muteOnJoin: false,
  },
  video: {
    blur: false,
    onlyShowIn1on1: false,
    verifiedRoomsOnly: false,
    profilePictureVisibility: "group",
  },
  metadata: {
    nameVisibility: "group",
    pronounsVisibility: "private",
    showInterestsIn1on1: true,
  },
};
