"use client";
import { useState } from "react";
import { styled, Stack, Popover, Typography } from "@mui/material";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Badge, { badgeClasses } from "@mui/material/Badge";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { FaVideo } from "react-icons/fa";
import VideoStack from "@/app/components/VideoSelectPopover";
import JoinMeeting from "@/app/modals/JoinMeeting";
import Link from "next/link"; // ✅ Step 1

const CartBadge = styled(Badge)`
  & .${badgeClasses.badge} {
    top: -12px;
    right: -6px;
  }
`;

export default function NavBar() {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [joinMeeting, setJoinMeeting] = useState(false);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "notification-popover" : undefined;

  return (
    <nav className="w-full px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 bg-white shadow-sm z-50">
      {/* LEFT: Logo */}
      <Link href="/">
        <span className="text-xl font-semibold text-green-600 tracking-tight cursor-pointer">
          FaceTime
        </span>
      </Link>

      {/* RIGHT: All actions */}
      <div className="flex items-center gap-4">
        {/* Notification icon */}
        <IconButton onClick={handleClick}>
          <NotificationsIcon />
          <CartBadge badgeContent={2} color="warning" overlap="circular" />
        </IconButton>

        {/* Join button */}
        <button
          className="bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-md shadow-sm flex items-center gap-2 transition-all duration-150"
          onClick={() => setJoinMeeting(true)}
        >
          <FaVideo />
          Join FaceTime
        </button>

        {/* Auth buttons */}
        <SignedOut>
          <SignInButton mode="modal" />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>

      {/* Popover */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 2,
            width: 500,
            borderRadius: 2,
            boxShadow: 3,
            maxHeight: 400,
            overflowY: "auto",
          },
        }}
      >
        <Stack spacing={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            Catch Up on Your Lectures!
          </Typography>
          <VideoStack />
        </Stack>
      </Popover>

      {/* Modal */}
      {joinMeeting && (
        <JoinMeeting enable={joinMeeting} setEnable={setJoinMeeting} />
      )}
    </nav>
  );
}
