import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import { HttpError } from "@/app/api/core/httpError";
import { SiteContentRepository } from "../repository/siteContentRepository";
import { SiteContentService } from "../services/siteContentService";

type MediaContext = { params: Promise<{ path: string[] }> };

export class SiteContentController extends BaseController {
  constructor(private readonly service: SiteContentService) {
    super();
  }

  /**
   * GET /api/site/media/{section path}/{file}
   * Public: these are the images and videos the public pages show. Each upload gets a new name, so
   * the file at an address never changes and browsers may keep it. Range requests are passed on,
   * so videos can start playing before they have fully downloaded, and be skipped through.
   */
  getMedia = (request: Request, context: MediaContext) =>
    this.handle(async () => {
      const { path } = await context.params;
      const file = await this.service.getMedia(path, request.headers.get("range"));
      if (!file) throw HttpError.notFound("No such file.");
      return new Response(file.body, {
        status: file.contentRange ? 206 : 200,
        headers: {
          "Content-Type": file.contentType,
          "Accept-Ranges": "bytes",
          ...(file.contentRange && { "Content-Range": file.contentRange }),
          ...(file.size !== null && { "Content-Length": String(file.size) }),
          "Cache-Control": "public, max-age=31536000, immutable",
          "X-Content-Type-Options": "nosniff",
        },
      });
    });
}

export const siteContentService = new SiteContentService(new SiteContentRepository());
export const siteContentController = new SiteContentController(siteContentService);
