export const formatLength = (seconds: number | undefined) =>
  seconds
    ? `${Math.floor(seconds / 60)}:${Math.round(seconds % 60)
        .toString()
        .padStart(2, "0")}`
    : "0:00";
