import next from "@tempest/config/eslint/next";

const config = [...next, { ignores: ["scripts/**"] }];
export default config;
