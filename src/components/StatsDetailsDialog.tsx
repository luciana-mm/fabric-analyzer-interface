import { CheckCircle2, XCircle, Layers, Clock, TrendingUp, AlertTriangle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface StatsDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const recentAnalyses = [
  { id: "TX-1248", type: "Algodão", result: "ok", time: "há 2 min" },
  { id: "TX-1247", type: "Poliéster", result: "ok", time: "há 4 min" },
  { id: "TX-1246", type: "Linho", result: "fail", time: "há 7 min" },
  { id: "TX-1245", type: "Seda", result: "ok", time: "há 9 min" },
  { id: "TX-1244", type: "Algodão", result: "ok", time: "há 12 min" },
  { id: "TX-1243", type: "Lã", result: "fail", time: "há 15 min" },
];

const errorBreakdown = [
  { label: "Falha de iluminação", count: 28, percentage: 41.8 },
  { label: "Tecido fora de posição", count: 19, percentage: 28.4 },
  { label: "Padrão não reconhecido", count: 12, percentage: 17.9 },
  { label: "Outros", count: 8, percentage: 11.9 },
];

export const StatsDetailsDialog = ({ open, onOpenChange }: StatsDetailsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display tracking-[0.2em] uppercase text-lg">
            Detalhes das Estatísticas
          </DialogTitle>
          <DialogDescription className="text-[11px] tracking-[0.25em] uppercase">
            Análise completa da sessão atual
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Resumo */}
          <section>
            <h3 className="font-display text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3">
              Resumo Geral
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg border border-border/40 bg-card/50">
                <div className="flex items-center gap-2 text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2">
                  <Layers className="w-3.5 h-3.5" /> Total Verificado
                </div>
                <p className="font-display text-2xl">1.248</p>
                <p className="text-xs text-muted-foreground mt-1">desde o início da sessão</p>
              </div>
              <div className="p-4 rounded-lg border border-border/40 bg-card/50">
                <div className="flex items-center gap-2 text-muted-foreground text-[10px] tracking-[0.2em] uppercase mb-2">
                  <Clock className="w-3.5 h-3.5" /> Tempo Médio
                </div>
                <p className="font-display text-2xl">2,4s</p>
                <p className="text-xs text-muted-foreground mt-1">por tecido analisado</p>
              </div>
              <div className="p-4 rounded-lg border border-border/40 bg-card/50">
                <div className="flex items-center gap-2 text-primary text-[10px] tracking-[0.2em] uppercase mb-2">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Sucessos
                </div>
                <p className="font-display text-2xl text-primary">1.181</p>
                <Progress value={94.6} className="mt-2 h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">94.6% de aprovação</p>
              </div>
              <div className="p-4 rounded-lg border border-border/40 bg-card/50">
                <div className="flex items-center gap-2 text-destructive text-[10px] tracking-[0.2em] uppercase mb-2">
                  <XCircle className="w-3.5 h-3.5" /> Falhas
                </div>
                <p className="font-display text-2xl text-destructive">67</p>
                <Progress value={5.4} className="mt-2 h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">5.4% de rejeição</p>
              </div>
            </div>
          </section>

          {/* Causas de Erro */}
          <section>
            <h3 className="font-display text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" /> Causas de Falha
            </h3>
            <div className="space-y-3 p-4 rounded-lg border border-border/40 bg-card/50">
              {errorBreakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-foreground/80">{item.label}</span>
                    <span className="font-display tracking-wider text-muted-foreground">
                      {item.count} <span className="text-foreground/50">· {item.percentage}%</span>
                    </span>
                  </div>
                  <Progress value={item.percentage} className="h-1" />
                </div>
              ))}
            </div>
          </section>

          {/* Análises Recentes */}
          <section>
            <h3 className="font-display text-[11px] tracking-[0.3em] uppercase text-muted-foreground mb-3 flex items-center gap-2">
              <TrendingUp className="w-3.5 h-3.5" /> Análises Recentes
            </h3>
            <div className="rounded-lg border border-border/40 bg-card/50 overflow-hidden">
              {recentAnalyses.map((a, i) => (
                <div
                  key={a.id}
                  className={`flex items-center justify-between px-4 py-3 text-xs ${
                    i !== recentAnalyses.length - 1 ? "border-b border-border/30" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {a.result === "ok" ? (
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                    ) : (
                      <XCircle className="w-4 h-4 text-destructive" />
                    )}
                    <span className="font-display tracking-wider text-foreground/80">{a.id}</span>
                    <span className="text-muted-foreground">{a.type}</span>
                  </div>
                  <span className="text-muted-foreground text-[11px]">{a.time}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
};
