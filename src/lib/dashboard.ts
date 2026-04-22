import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { supabase } from "@/integrations/supabase/client";

export interface AnalysisRecord {
  id: string;
  operator_user_id: string;
  reference_code: string;
  tissue_type: string;
  result: "ok" | "fail";
  failure_reason: string | null;
  processing_time_ms: number;
  analyzed_at: string;
}

export interface ProfileRecord {
  id: string;
  user_id: string;
  display_name: string | null;
  employee_code: string | null;
  shift: string | null;
  job_title: string | null;
  department: string | null;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  user_id: string;
  role: string;
}

export interface BreakdownItem {
  label: string;
  count: number;
  percentage: number;
}

export interface RecentAnalysisItem {
  id: string;
  type: string;
  result: "ok" | "fail";
  time: string;
}

export interface DashboardSummary {
  verified: number;
  success: number;
  failure: number;
  successRate: number;
  failureRate: number;
  averageProcessingMs: number | null;
  averageTimeLabel: string;
  recentAnalyses: RecentAnalysisItem[];
  errorBreakdown: BreakdownItem[];
}

export interface EmployeeSummary {
  id: string;
  name: string;
  role: string;
  verified: number;
  success: number;
  failure: number;
  avgTime: string;
  shift: string;
  recentAnalyses: RecentAnalysisItem[];
  errorBreakdown: BreakdownItem[];
  averageProcessingMs: number | null;
  active: boolean;
}

const ANALYSIS_FIELDS = "id, operator_user_id, reference_code, tissue_type, result, failure_reason, processing_time_ms, analyzed_at";
const PROFILE_FIELDS = "id, user_id, display_name, employee_code, shift, job_title, department, active";
const PROFILE_FIELDS_LEGACY = "id, user_id, display_name, created_at, updated_at";
const ROLE_FIELDS = "user_id, role";

const formatDecimalSeconds = (value: number) => `${value.toFixed(1).replace(".", ",")}s`;

export const formatAverageTime = (averageProcessingMs: number | null) => {
  if (averageProcessingMs === null) {
    return "—";
  }

  return formatDecimalSeconds(averageProcessingMs / 1000);
};

const formatRelativeTime = (value: string) =>
  formatDistanceToNow(new Date(value), {
    addSuffix: true,
    locale: ptBR,
  });

const isMissingSchemaError = (error: unknown) => {
  if (!error || typeof error !== "object") {
    return false;
  }

  const maybeError = error as { code?: string; message?: string; details?: string };
  const code = maybeError.code ?? "";
  const message = (maybeError.message ?? "").toLowerCase();
  const details = (maybeError.details ?? "").toLowerCase();

  if (code === "PGRST204" || code === "PGRST205") {
    return true;
  }

  return (
    message.includes("could not find the") ||
    message.includes("does not exist") ||
    details.includes("does not exist")
  );
};

const normalizeLegacyProfile = (profile: {
  id: string;
  user_id: string;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}): ProfileRecord => ({
  id: profile.id,
  user_id: profile.user_id,
  display_name: profile.display_name,
  employee_code: null,
  shift: null,
  job_title: null,
  department: null,
  active: true,
  created_at: profile.created_at,
  updated_at: profile.updated_at,
});

const fetchProfilesCompatible = async () => {
  const full = await supabase.from("profiles").select(PROFILE_FIELDS).order("display_name", { ascending: true });

  if (!full.error) {
    return (full.data ?? []) as ProfileRecord[];
  }

  if (!isMissingSchemaError(full.error)) {
    throw full.error;
  }

  const legacy = await supabase.from("profiles").select(PROFILE_FIELDS_LEGACY).order("display_name", { ascending: true });

  if (legacy.error) {
    throw legacy.error;
  }

  return (legacy.data ?? []).map(normalizeLegacyProfile);
};

const fetchSingleProfileCompatible = async (userId: string) => {
  const full = await supabase
    .from("profiles")
    .select(PROFILE_FIELDS)
    .eq("user_id", userId)
    .maybeSingle();

  if (!full.error) {
    return (full.data as ProfileRecord | null) ?? null;
  }

  if (!isMissingSchemaError(full.error)) {
    throw full.error;
  }

  const legacy = await supabase
    .from("profiles")
    .select(PROFILE_FIELDS_LEGACY)
    .eq("user_id", userId)
    .maybeSingle();

  if (legacy.error) {
    throw legacy.error;
  }

  return legacy.data ? normalizeLegacyProfile(legacy.data) : null;
};

export const fetchCurrentUserProfile = async (userId: string) => {
  return fetchSingleProfileCompatible(userId);
};

export const fetchOperatorAnalyses = async (userId: string) => {
  const { data, error } = await supabase
    .from("analysis_records")
    .select(ANALYSIS_FIELDS)
    .eq("operator_user_id", userId)
    .order("analyzed_at", { ascending: false });

  if (error && isMissingSchemaError(error)) {
    return [];
  }

  if (error) {
    throw error;
  }

  return (data ?? []) as AnalysisRecord[];
};

export const fetchManagerData = async () => {
  const [profiles, rolesResult, analysesResult] = await Promise.all([
    fetchProfilesCompatible(),
    supabase.from("user_roles").select(ROLE_FIELDS),
    supabase.from("analysis_records").select(ANALYSIS_FIELDS).order("analyzed_at", { ascending: false }),
  ]);

  if (rolesResult.error) {
    throw rolesResult.error;
  }

  let analyses: AnalysisRecord[] = [];

  if (analysesResult.error && !isMissingSchemaError(analysesResult.error)) {
    throw analysesResult.error;
  }

  if (!analysesResult.error) {
    analyses = (analysesResult.data ?? []) as AnalysisRecord[];
  }

  if (analysesResult.error) {
    analyses = [];
  }

  return {
    profiles,
    roles: (rolesResult.data ?? []) as UserRoleRecord[],
    analyses,
  };
};

export const buildDashboardSummary = (analyses: AnalysisRecord[]): DashboardSummary => {
  const verified = analyses.length;
  const success = analyses.filter((analysis) => analysis.result === "ok").length;
  const failure = verified - success;
  const averageProcessingMs = verified
    ? Math.round(analyses.reduce((total, analysis) => total + analysis.processing_time_ms, 0) / verified)
    : null;

  const recentAnalyses = analyses.slice(0, 6).map((analysis) => ({
    id: analysis.reference_code,
    type: analysis.tissue_type,
    result: analysis.result,
    time: formatRelativeTime(analysis.analyzed_at),
  }));

  const breakdownSource = analyses.filter((analysis) => analysis.result === "fail");
  const breakdownMap = new Map<string, number>();

  breakdownSource.forEach((analysis) => {
    const label = analysis.failure_reason?.trim() || "Falha não informada";
    breakdownMap.set(label, (breakdownMap.get(label) ?? 0) + 1);
  });

  const errorBreakdown = Array.from(breakdownMap.entries())
    .map(([label, count]) => ({
      label,
      count,
      percentage: failure ? (count / failure) * 100 : 0,
    }))
    .sort((left, right) => right.count - left.count);

  return {
    verified,
    success,
    failure,
    successRate: verified ? (success / verified) * 100 : 0,
    failureRate: verified ? (failure / verified) * 100 : 0,
    averageProcessingMs,
    averageTimeLabel: formatAverageTime(averageProcessingMs),
    recentAnalyses,
    errorBreakdown,
  };
};

export const buildEmployeeSummaries = (
  profiles: ProfileRecord[],
  roles: UserRoleRecord[],
  analyses: AnalysisRecord[],
): EmployeeSummary[] => {
  const roleByUser = new Map(roles.map((role) => [role.user_id, role.role] as const));
  const analysesByUser = new Map<string, AnalysisRecord[]>();

  analyses.forEach((analysis) => {
    const grouped = analysesByUser.get(analysis.operator_user_id) ?? [];
    grouped.push(analysis);
    analysesByUser.set(analysis.operator_user_id, grouped);
  });

  return profiles
    .filter((profile) => profile.active !== false)
    .filter((profile) => roleByUser.get(profile.user_id) === "operador")
    .map((profile) => {
      const profileAnalyses = (analysesByUser.get(profile.user_id) ?? []).slice().sort((left, right) => {
        return new Date(right.analyzed_at).getTime() - new Date(left.analyzed_at).getTime();
      });

      const verified = profileAnalyses.length;
      const success = profileAnalyses.filter((analysis) => analysis.result === "ok").length;
      const failure = verified - success;
      const averageProcessingMs = verified
        ? Math.round(profileAnalyses.reduce((total, analysis) => total + analysis.processing_time_ms, 0) / verified)
        : null;

      const breakdownMap = new Map<string, number>();
      profileAnalyses
        .filter((analysis) => analysis.result === "fail")
        .forEach((analysis) => {
          const label = analysis.failure_reason?.trim() || "Falha não informada";
          breakdownMap.set(label, (breakdownMap.get(label) ?? 0) + 1);
        });

      const errorBreakdown = Array.from(breakdownMap.entries())
        .map(([label, count]) => ({
          label,
          count,
          percentage: failure ? (count / failure) * 100 : 0,
        }))
        .sort((left, right) => right.count - left.count);

      return {
        id: profile.employee_code || profile.user_id,
        name: profile.display_name || "Sem nome",
        role: profile.job_title || "Operador",
        verified,
        success,
        failure,
        avgTime: formatAverageTime(averageProcessingMs),
        shift: profile.shift || "Sem turno",
        recentAnalyses: profileAnalyses.slice(0, 5).map((analysis) => ({
          id: analysis.reference_code,
          type: analysis.tissue_type,
          result: analysis.result,
          time: formatRelativeTime(analysis.analyzed_at),
        })),
        errorBreakdown,
        averageProcessingMs,
        active: profile.active ?? true,
      };
    })
    .sort((left, right) => right.verified - left.verified);
};
