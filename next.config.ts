import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "hirael.com" },
    ],
  },
  async redirects() {
    return [
      { source: "/ورود", destination: "/login", permanent: false },
      { source: "/%D8%B1%D9%88%D8%AF", destination: "/login", permanent: false },
      { source: "/ثبت-نام", destination: "/register", permanent: false },
      {
        source: "/%D8%AB%D8%A8%D8%AA-%D9%86%D8%A7%D9%85",
        destination: "/register",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
