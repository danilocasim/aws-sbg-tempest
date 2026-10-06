import { healthResponse } from "@tempest/db/health";

export const dynamic = "force-dynamic";
export const GET = () => healthResponse("web");
