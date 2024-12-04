import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint:{ 
    ignoreDuringBuilds:true
  } //add this
};

export default nextConfig;
