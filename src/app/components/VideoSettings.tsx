"use client";

import { useEffect, useState } from "react";
import { UserPreferences } from "../../types/preferences/UserPreferences";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useUser } from "@clerk/nextjs";
import { defaultPreferences } from "@/types/preferences/dfault";

export default function VideoSettings() {
  const { user } = useUser();
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences);

  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) return;
      const ref = doc(db, "userPreferences", user.id);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setPrefs(snap.data().settings);
      }
    };
    fetchPreferences();
  }, [user]);

  const handleChange = <
    T extends keyof UserPreferences,
    K extends keyof UserPreferences[T]
  >(
    section: T,
    key: K,
    value: UserPreferences[T][K]
  ) => {
    const updated = {
      ...prefs,
      [section]: {
        ...prefs[section],
        [key]: value,
      },
    };
    setPrefs(updated);
    if (user) {
      setDoc(
        doc(db, "userPreferences", user.id),
        { settings: updated },
        { merge: true }
      );
    }
  };

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <section className="mb-6">
        <h2 className="text-xl font-semibold">Audio</h2>
        <label className="block py-2">
          <input
            type="checkbox"
            checked={prefs.audio.distortVoice}
            onChange={(e) =>
              handleChange("audio", "distortVoice", e.target.checked)
            }
          />{" "}
          Distort voice
        </label>
        <label className="block py-2">
          <input
            type="checkbox"
            checked={prefs.audio.safeContextOnly}
            onChange={(e) =>
              handleChange("audio", "safeContextOnly", e.target.checked)
            }
          />{" "}
          Only allow clear audio in 1:1
        </label>
        <label className="block py-2">
          <input
            type="checkbox"
            checked={prefs.audio.muteOnJoin}
            onChange={(e) =>
              handleChange("audio", "muteOnJoin", e.target.checked)
            }
          />{" "}
          Mute on join
        </label>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Video</h2>
        <label className="block py-2">
          <input
            type="checkbox"
            checked={prefs.video.blur}
            onChange={(e) => handleChange("video", "blur", e.target.checked)}
          />{" "}
          Blur background
        </label>
        <label className="block py-2">
          <input
            type="checkbox"
            checked={prefs.video.onlyShowIn1on1}
            onChange={(e) =>
              handleChange("video", "onlyShowIn1on1", e.target.checked)
            }
          />{" "}
          Show video only in 1:1
        </label>
        <label className="block py-2">
          <input
            type="checkbox"
            checked={prefs.video.verifiedRoomsOnly}
            onChange={(e) =>
              handleChange("video", "verifiedRoomsOnly", e.target.checked)
            }
          />{" "}
          Allow video only in verified rooms
        </label>
        <label className="block py-2">
          Profile Picture Visibility:
          <select
            className="ml-2"
            value={prefs.video.profilePictureVisibility}
            onChange={(e) =>
              handleChange(
                "video",
                "profilePictureVisibility",
                e.target.value as any
              )
            }
          >
            <option value="everyone">Everyone</option>
            <option value="group">Group Only</option>
            <option value="private">Private</option>
          </select>
        </label>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold">Metadata</h2>
        <label className="block py-2">
          Name Visibility:
          <select
            className="ml-2"
            value={prefs.metadata.nameVisibility}
            onChange={(e) =>
              handleChange("metadata", "nameVisibility", e.target.value as any)
            }
          >
            <option value="everyone">Everyone</option>
            <option value="group">Group Only</option>
            <option value="private">Private</option>
          </select>
        </label>
        <label className="block py-2">
          Pronouns Visibility:
          <select
            className="ml-2"
            value={prefs.metadata.pronounsVisibility}
            onChange={(e) =>
              handleChange(
                "metadata",
                "pronounsVisibility",
                e.target.value as any
              )
            }
          >
            <option value="everyone">Everyone</option>
            <option value="group">Group Only</option>
            <option value="private">Private</option>
          </select>
        </label>
        <label className="block py-2">
          <input
            type="checkbox"
            checked={prefs.metadata.showInterestsIn1on1}
            onChange={(e) =>
              handleChange("metadata", "showInterestsIn1on1", e.target.checked)
            }
          />{" "}
          Show interests in 1:1s
        </label>
      </section>
    </main>
  );
}
