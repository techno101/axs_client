import { handleAxsProxy } from "@/server/axs-proxy/handler";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ path: string[] }> };

async function route(request: Request, context: Context) {
  const { path } = await context.params;
  try {
    return await handleAxsProxy(request, path);
  } catch {
    return Response.json(
      { data: null, meta: {}, error: { code: "SERVICE_UNAVAILABLE", message: "The booking service is temporarily unavailable." } },
      { status: 503, headers: { "Cache-Control": "private, no-store" } },
    );
  }
}

export const GET = route;
export const POST = route;
export const PUT = route;
export const PATCH = route;
export const DELETE = route;
export const OPTIONS = route;
