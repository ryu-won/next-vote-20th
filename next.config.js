/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true, // styled-components 활성화
  },
};

module.exports = nextConfig; // CommonJS 방식으로 수정