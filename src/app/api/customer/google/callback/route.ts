import { completeGoogleCallback } from "@/server/customer-bff/handler";

export const dynamic = "force-dynamic";
export async function GET(request: Request) { return completeGoogleCallback(request); }
