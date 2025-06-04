import {Request} from "express";

export function getFullName(
  firstName: string,
  middleName: string,
  lastName: string
) {
  return [firstName, middleName, lastName].filter(Boolean).join(" ") || "N/A";
}

export function getIpFromRequest(req: Request) {
  let forwarded = req.headers["x-forwarded-for"];

  // Ensure forwarded is treated as a string, even if it's an array
  if (Array.isArray(forwarded)) {
    forwarded = forwarded[0];
  }

  let ip = forwarded ? forwarded.split(",")[0].trim() : req.ip;
  if (!ip) return "unknown";

  // Regular expressions to match only the IP address part
  const ipv4Regex = /(\d{1,3}\.){3}\d{1,3}/;
  const ipv6Regex = /([a-f0-9:]+:+)+[a-f0-9]+/i;

  // Handle IPv4-mapped IPv6 addresses (e.g., ::ffff:192.168.1.1)
  if (ip.startsWith("::ffff:")) {
    ip = ip.substring(7);
  }

  // Match the IP against IPv4 and IPv6 patterns
  const ipv4Match = ip.match(ipv4Regex);
  const ipv6Match = ip.match(ipv6Regex);

  if (ipv4Match) {
    return ipv4Match[0];
  } else if (ipv6Match) {
    return ipv6Match[0];
  } else {
    return ip; // Fallback if no match
  }
}
