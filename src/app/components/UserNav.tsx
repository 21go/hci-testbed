"use client";

import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
const DotIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      fill="currentColor"
      width={16}
      height={16}
    >
      <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512z" />
    </svg>
  );
};

export default function UserNav() {
  return (
    <div className="flex items-center justify-end gap-5">
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
      <SignedIn>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Link
              label="Video Settings"
              labelIcon={<DotIcon />}
              href="/video-settings"
            />
          </UserButton.MenuItems>
          <UserButton.UserProfilePage
            label="Video Settings"
            labelIcon={<DotIcon />}
            url="help"
          >
            <div>
              <h1>Help Page</h1>
              <h3>This is the custom help page</h3>
            </div>
          </UserButton.UserProfilePage>
        </UserButton>
      </SignedIn>
    </div>
  );
}
