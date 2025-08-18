export function getInitials(name: string): string {
  return name
    .trim() // remove extra spaces at start/end
    .split(/\s+/) // split by one or more spaces
    .map((word) => word[0]?.toUpperCase()) // take first char and uppercase
    .join('');
}
