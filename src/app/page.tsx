"use client";
import { useState } from "react";
import { FaLink, FaVideo } from "react-icons/fa";
import Image from "next/image";
import InstantMeeting from "@/app/modals/InstantMeeting";
import UpcomingMeeting from "@/app/modals/UpcomingMeeting";
import CreateLink from "@/app/modals/CreateLink";
import JoinMeeting from "@/app/modals/JoinMeeting";
import { Stack } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import NotificationsIcon from "@mui/icons-material/Notifications";
import Badge, { badgeClasses } from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import Popover from "@mui/material/Popover";
import VideoStack from "@/app/components/VideoSelectPopover";
import { Typography } from "@mui/material";
export default function Dashboard() {
  const [startInstantMeeting, setStartInstantMeeting] =
    useState<boolean>(false);
  const [joinMeeting, setJoinMeeting] = useState<boolean>(false);
  const [showUpcomingMeetings, setShowUpcomingMeetings] =
    useState<boolean>(false);
  const [showCreateLink, setShowCreateLink] = useState<boolean>(false);
  const CartBadge = styled(Badge)`
		& .${badgeClasses.badge} {
			top: -12px;
			right: -6px;
		}
	`;
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <>
      <div className="absolute top-4 right-4 z-10">
        <Stack direction="row" spacing={5} alignItems="center">
          <IconButton aria-label="notification" onClick={handleClick}>
            <NotificationsIcon />
            <CartBadge badgeContent={2} color="warning" overlap="circular" />
          </IconButton>
          {/* No Popover here anymore */}
          <button
            className="text-sm bg-green-500 px-2 w-[150px] hover:bg-green-600 py-3 flex flex-col items-center text-white rounded-md shadow-sm cursor-pointer"
            onClick={() => setJoinMeeting(true)}
          >
            <FaVideo className="mb-[3px] text-white" />
            Join FaceTime
          </button>
        </Stack>
      </div>

      {/* Popover rendered outside layout */}
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
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

      <main className="w-full h-screen flex flex-col items-center justify-center">
        <h1 className="font-bold text-2xl text-center">FaceTime</h1>
        <div className="flex flex-col">
          <button
            className="text-green-500 underline text-sm text-center cursor-pointer"
            onClick={() => setShowUpcomingMeetings(true)}
          >
            Upcoming FaceTime
          </button>
        </div>

        <div className="flex items-center justify-center space-x-4 mt-6">
          <button
            className="bg-gray-500 px-4 w-[200px] py-3 flex flex-col items-center hover:bg-gray-600 text-white rounded-md shadow-sm"
            onClick={() => setShowCreateLink(true)}
          >
            <FaLink className="mb-[3px] text-gray-300" />
            Create link
          </button>
          <button
            className="bg-green-500 px-4 w-[200px] hover:bg-green-600 py-3 flex flex-col items-center text-white rounded-md shadow-sm"
            onClick={() => setStartInstantMeeting(true)}
          >
            <FaVideo className="mb-[3px] text-white" />
            New FaceTime
          </button>
        </div>
        <div className="mt-8 flex items-center justify-center">
          <p className="text-sm text-gray-600 mr-2">Powered by</p>
          <a
            href="https://getstream.io"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center"
          >
            <Image
              src="/stream-logo.png"
              alt="Stream Logo"
              width={80}
              height={20}
            />
          </a>
        </div>
      </main>

      {startInstantMeeting && (
        <InstantMeeting
          enable={startInstantMeeting}
          setEnable={setStartInstantMeeting}
        />
      )}
      {showUpcomingMeetings && (
        <UpcomingMeeting
          enable={showUpcomingMeetings}
          setEnable={setShowUpcomingMeetings}
        />
      )}
      {showCreateLink && (
        <CreateLink enable={showCreateLink} setEnable={setShowCreateLink} />
      )}
      {joinMeeting && (
        <JoinMeeting enable={joinMeeting} setEnable={setJoinMeeting} />
      )}
    </>
  );
}
