import { useState } from "react";
import { Play, Sun, Settings, Info, EyeOff, ArrowLeft, Eye, Microscope } from "lucide-react";
import { LucideIcon } from "lucide-react";
import gridBg from "@/assets/grid-bg.jpg";

interface ActionCardProps {
  icon: LucideIcon;
  label: string;
  description: string;
  onClick?: () => void;
  highlight?: boolean;
}

const ActionCard = ({ icon: Icon, label, description, onClick, highlight }: ActionCardProps) => (
  <button
    onClick={onClick}
    className={`group relative flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border transition-all duration-300 text-center
      ${highlight
        ? "bg-foreground/10 border-foreground/30 glow-primary hover:bg-foreground/15"
        : "bg-card/50 border-border/30 hover:border-foreground/20 hover:bg-card/80"
      } active:scale-[0.96]`}
  >
    <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300
      ${highlight ? "bg-foreground/15" : "bg-muted/60 group-hover:bg-foreground/10"}`}>
      <Icon className={`w-7 h-7 transition-all duration-300
        ${highlight ? "text-foreground" : "text-secondary group-hover:text-foreground"}`} />
    </div>
    <div>
      <p className="font-display text-xs tracking-[0.2em] uppercase text-foreground/90">{label}</p>
      <p className="text-[11px] text-muted-foreground mt-1">{description}</p>
    </div>
  </button>
);

const Index = () => {
  const [menuVisible, setMenuVisible] = useState(true);

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background */}
      <img src={gridBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-20" width={1920} height={1080} />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/70" />

      {/* Top Bar */}
      <header className="relative z-10 flex items-center justify-between px-8 py-5 border-b border-border/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-foreground/10 flex items-center justify-center">
            <Microscope className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h1 className="font-display text-lg tracking-[0.15em] text-foreground uppercase leading-tight">
              TissueScope
            </h1>
            <p className="text-[10px] tracking-[0.3em] text-muted-foreground uppercase">
              Análise de Tecidos
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="hidden sm:inline">Sistema Pronto</span>
          </div>
          <span className="px-3 py-1 rounded-full bg-muted/40 border border-border/30 font-display text-[10px] tracking-wider">
            v1.0.0
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-6">
        {menuVisible ? (
          <div className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-500">
            <div className="text-center mb-8">
              <p className="font-display text-[10px] tracking-[0.4em] text-muted-foreground uppercase mb-2">
                Painel de Controle
              </p>
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent mx-auto" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <ActionCard
                icon={Play}
                label="Iniciar"
                description="Começar análise"
                highlight
              />
              <ActionCard
                icon={Sun}
                label="Calibrar Luz"
                description="Ajustar iluminação"
              />
              <ActionCard
                icon={Settings}
                label="Configurações"
                description="Parâmetros do sistema"
              />
              <ActionCard
                icon={Info}
                label="Informações"
                description="Sobre o sistema"
              />
              <ActionCard
                icon={EyeOff}
                label="Esconder Menu"
                description="Ocultar painel"
                onClick={() => setMenuVisible(false)}
              />
              <ActionCard
                icon={ArrowLeft}
                label="Voltar"
                description="Tela anterior"
              />
            </div>
          </div>
        ) : (
          <button
            onClick={() => setMenuVisible(true)}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl glass-panel border-foreground/20 glow-primary hover:glow-strong transition-all duration-300 active:scale-95 animate-in fade-in duration-500"
          >
            <Eye className="w-5 h-5 text-foreground" />
            <span className="font-display text-sm tracking-wider uppercase text-foreground/80">
              Mostrar Menu
            </span>
          </button>
        )}
      </main>

      {/* Bottom accent line */}
      <div className="relative z-10 h-px bg-gradient-to-r from-transparent via-foreground/10 to-transparent" />
    </div>
  );
};

export default Index;
