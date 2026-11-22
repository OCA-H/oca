import { ApiError, apiRequest } from '@/app/(view)/common/services/api.service';
import { ROUTES } from '@/app/(view)/common/helper/routes';
import { signOutMember } from '@/app/(view)/common/helper/useAuth';
import type {
  ConsoleSummary,
  DuplicateGroup,
  Occasion,
  PageOf,
  PassPage,
  DonorPassRow,
  ExportCounts,
  ExportKind,
  MemberDetail,
  MemberInput,
  MemberRow,
  StaffUser,
} from '@/app/api/(features)/sv/oca-admin/schema';

export type { ConsoleSummary, DuplicateGroup, Occasion, PageOf, PassPage, DonorPassRow, ExportCounts, ExportKind, MemberDetail, MemberInput, MemberRow, StaffUser };
export { ApiError };

const BASE = '/api/sv/oca-admin';

/** A 401 means the session is over: sign out and come back here after signing in again. */
async function call<T>(url: string, options?: Parameters<typeof apiRequest>[1]): Promise<T> {
  try {
    return await apiRequest<T>(url, options);
  } catch (error) {
    if (error instanceof ApiError && error.status === 401 && typeof window !== 'undefined') {
      await signOutMember();
      const back = `${window.location.pathname}${window.location.hash}`;
      window.location.replace(`${ROUTES.MEMBER_SIGNIN}?redirect=${encodeURIComponent(back)}`);
    }
    throw error;
  }
}

type Result<T> = { data: T; message?: string };

export const ocaAdminService = {
  summary: () => call<{ me: StaffUser; data: ConsoleSummary }>(`${BASE}/summary`),
  membersPage: (params: URLSearchParams, signal?: AbortSignal) => call<PageOf<MemberRow>>(`${BASE}/members?${params}`, { signal }),
  duplicates: () => call<Result<DuplicateGroup[]>>(`${BASE}/members/duplicates`),
  occasions: () => call<Result<Occasion[]>>(`${BASE}/members/occasions`),
  getMember: (id: number) => call<Result<MemberDetail>>(`${BASE}/members/${id}`),
  createMember: (input: MemberInput) => call<Result<MemberRow>>(`${BASE}/members`, { method: 'POST', body: input }),
  updateMember: (id: number, input: MemberInput) => call<Result<MemberRow>>(`${BASE}/members/${id}`, { method: 'PATCH', body: input }),
  deleteMember: (id: number) => call<Result<MemberRow>>(`${BASE}/members/${id}`, { method: 'DELETE' }),
  setRole: (id: number, role: 'admin' | 'member') => call<Result<MemberRow>>(`${BASE}/members/${id}/role`, { method: 'PUT', body: { role } }),
  passesPage: (params: URLSearchParams, signal?: AbortSignal) => call<PassPage>(`${BASE}/donor-passes?${params}`, { signal }),
  /** Every pass matching the filters, as CSV. Returns the file name and how many rows it has. */
  downloadPasses: (params: URLSearchParams) => download(`${BASE}/donor-passes/export?${params}`, 'donor-pass.csv'),
  exportCounts: () => call<Result<ExportCounts>>(`${BASE}/export`),

  /** Downloads an export. Fetched (not linked) so an error shows as a message instead of a JSON page. */
  async downloadExport(kind: ExportKind): Promise<string> {
    return (await download(`${BASE}/export/${kind}`, `OCA_${kind}.csv`)).name;
  },
};

/** Fetches a CSV and saves it. Fetched (not linked) so an error shows as a message. */
async function download(url: string, fallback: string): Promise<{ name: string; count: number | null }> {
  const res = await fetch(url, { credentials: 'include' });
  if (!res.ok) {
    const json = await res.json().catch(() => null);
    throw new ApiError(json?.error || 'The file could not be made. Please try again.', res.status);
  }
  const name = /filename="([^"]+)"/.exec(res.headers.get('Content-Disposition') ?? '')?.[1] ?? fallback;
  const count = res.headers.get('X-Record-Count');
  saveBlob(name, await res.blob());
  return { name, count: count === null ? null : Number(count) };
}

/** Saves a file the browser already has. */
export function saveBlob(name: string, blob: Blob) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = name;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    URL.revokeObjectURL(a.href);
    a.remove();
  }, 600);
}
