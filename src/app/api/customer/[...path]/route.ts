import { handleCustomerBff } from "@/server/customer-bff/handler";

export const dynamic = "force-dynamic";
type Context = { params: Promise<{ path: string[] }> };
async function route(request: Request, context: Context) { const { path } = await context.params; return handleCustomerBff(request, path); }
export const GET = route;
export const POST = route;
export const PATCH = route;
export const DELETE = route;
