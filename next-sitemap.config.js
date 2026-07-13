/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://matchvault.com",
  generateRobotsTxt: false,
  exclude: ["/admin/*"],
};
