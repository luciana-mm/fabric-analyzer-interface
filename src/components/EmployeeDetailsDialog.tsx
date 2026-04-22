import { CheckCircle2, XCircle, Layers, Clock, TrendingUp, AlertTriangle, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import type { BreakdownItem, RecentAnalysisItem } from "@/lib/dashboard";

export interface Employee {
  id: string;
  name: string;
  role: string;
  verified: number;
  success: number;
  failure: number;
  avgTime: string;
  shift: string;
}

interface EmployeeDetailsDialogProps {
  employee: Employee | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  errorBreakdown: BreakdownItem[];
  recentAnalyses: RecentAnalysisItem[];
}

export const EmployeeDetailsDialog = ({
  employee,
  open,
  onOpenChange,
  errorBreakdown,
  recentAnalyses,
}: EmployeeDetailsDialogProps) => {
  if (!employee) return null;

  const successRate = ((employee.success / employee.verified) * 100).toFixed(1);
  const failureRate = ((employee.failure / employee.verified) * 100).toFixed(1);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-foreground/10 flex items-center justify-center">
              <User className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <DialogTitle className="font-display tracking-[0.2em] uppercase text-lg">
                {employee.name}
              </DialogTitle>
              <DialogDescription className="text-[11px] tracking-[0.25em] uppercase">
                {employee.id} · {employee.role} · Turno {employee.shift}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Resumo */}
          <section>
            <h3 className="font-display text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Resumo Individual
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg border border-border/40 bg-card/50">
                <div className="flex items-center gap-2 text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2">
                  <Layers className="w-3.5 h-3.5" /> Total Verificado
                </div>
                <p className="font-display text-2xl">{employee.verified}</p>
                <p className="text-xs text-muted-foreground mt-1">na sessão atual</p>
              </div>
              <div className="p-4 rounded-lg border border-border/40 bg-card/50">
                <div className="flex items-center gap-2 text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2">
                  <Clock className="w-3.5 h-3.5" /> Tempo Médio
                </div>
                <p className="font-display text-2xl">{employee.avgTime}</p>
                <p className="text-xs text-muted-foreground mt-1">por tecido analisado</p>
              </div>
              <div className="p-4 rounded-lg border border-border/40 bg-card/50">
                <div className="flex items-center gap-2 text-primary text-[10px] tracking-[0.2em] uppercase mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sucessos
                </div>
                <p className="font-display text-2xl text-primary">{employee.success}</p>
                <Progress value={parseFloat(successRate)} className="mt-2 h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">{successRate}% de aprovação</p>
              </div>
              <div className="p-4 rounded-lg border border-border/40 bg-card/50">
                <div className="flex items-center gap-2 text-destructive text-[10px] tracking-[0.2em] uppercase mb-2">
                  <XCircle className="w-3.5 h-3.5" /> Falhas
                </div>
                <p className="font-display text-2xl text-destructive">{employee.failure}</p>
                <Progress value={parseFloat(failureRate)} className="mt-2 h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">{failureRate}% de rejeição</p>
              </div>
            </div>
          </section>

          {/* Causas de Erro */}
          <section>
            <h3 className="font-display text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" /> Principais Causas de Falha
            </h3>
            {errorBreakdown.length > 0 ? (
              <div className="space-y-3 p-4 rounded-lg border border-border/40 bg-card/50">
                {errorBreakdown.map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-foreground/80">{item.label}</span>
                      <span className="font-display tracking-wider text-muted-foreground">
                        {item.count} <span className="text-foreground/50">· {item.percentage.toFixed(1)}%</span>
                      </span>
                    </div>
                    <Progress value={item.percentage} className="h-1" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg border border-border/40 bg-card/50 text-xs text-muted-foreground">
                Nenhuma falha registrada para este funcionário.
              </div>
            )}
          </section>

          {/* Análises Recentes */}
          <section>
            <h3 className="font-display text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Análises Recentes
            </h3>
            {recentAnalyses.length > 0 ? (
              <div className="rounded-lg border border-border/40 bg-card/50 overflow-hidden">
                {recentAnalyses.map((analysis, index) => (
                  <div
                    key={analysis.id}
                    className={`flex items-center justify-between px-4 py-3 text-xs ${
                      index !== recentAnalyses.length - 1 ? "border-b border-border/30" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {analysis.result === "ok" ? (
                        <CheckCircle2 className="w-4 h-4 text-primary" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive" />
                      )}
                      <span className="font-display tracking-wider text-foreground/80">{analysis.id}</span>
                      <span className="text-muted-foreground">{analysis.type}</span>
                    </div>
                    <span className="text-muted-foreground text-[11px]">{analysis.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-lg border border-border/40 bg-card/50 text-xs text-muted-foreground">
                Nenhuma análise recente encontrada.
              </div>
            )}
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
