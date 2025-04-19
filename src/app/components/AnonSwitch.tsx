import { Stack, Typography, Switch, Box } from "@mui/material";

export default function AnonSwitch({
  anon,
  onChange,
}: {
  anon: boolean;
  onChange: () => void;
}) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Box display="flex" alignItems="center">
        <Typography variant="h6">Anonymous?</Typography>
      </Box>
      <Switch checked={anon} onChange={onChange} />
    </Stack>
  );
}
