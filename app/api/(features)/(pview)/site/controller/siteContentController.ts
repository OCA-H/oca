import "server-only";
import { BaseController } from "@/app/api/core/baseController";
import { HttpError } from "@/app/api/core/httpError";
import { SiteContentRepository } from "../repository/siteContentRepository";
import { SiteContentService } from "../services/siteContentService";

type MediaContext = { params: Promise<{ path: string[] }> };

/** How long a signed storage address for a section file stays valid: a week. */
const MEDIA_LINK_LIFE = 7 * 24 * 60 * 60;
/** How long browsers and the CDN keep the redirect to it: a day, so a kept redirect never points at an expired address. */
const MEDIA_REDIRECT_CACHE = 24 * 60 * 60;

export class SiteContentController extends BaseController {
  constructor(private readonly service: SiteContentService) {
    super();
  }

  /**
   * GET /api/site/media/{section path}/{file}[?download=1]
   * Public: the images, videos and documents the public pages show. The file itself is not sent
   * from here: this redirects to a signed address on storage, so the browser downloads it (video
   * seeking included) straight from Supabase and none of it passes through our functions, which
   * on Vercel count against Fast Origin Transfer. The redirect is kept by browsers and Vercel's
   * CDN for a day, well inside the signed address's week, so most views never reach this function.
   * Each upload gets a new name, so an address always means the same file.
   */
  getMedia = (request: Request, context: MediaContext) =>
    this.handle(async () => {
      const { path } = await context.params;
      const download = new URL(request.url).searchParams.has("download");
      const url = await this.service.getMediaUrl(path, MEDIA_LINK_LIFE, download);
      if (!url) throw HttpError.notFound("No such file.");
      const cache = `public, max-age=${MEDIA_REDIRECT_CACHE}`;
      return new Response(null, {
        status: 307,
        headers: { Location: url, "Cache-Control": cache, "CDN-Cache-Control": cache },
      });
    });
}

export const siteContentService = new SiteContentService(new SiteContentRepository());
export const siteContentController = new SiteContentController(siteContentService);
