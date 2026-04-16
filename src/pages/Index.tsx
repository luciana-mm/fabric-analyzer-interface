import { useState } from "react";
import { Play, Sun, Settings, Info, EyeOff, ArrowLeft, Eye, Microscope } from "lucide-react";
import tissueBg from "@/assets/tissue-bg.jpg";
import MenuButton from "@/components/MenuButton";

const Index = () => {
  const [menuVisible, setMenuVisible] = useState(true);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <img
        src={tissueBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/90 to-background/70" />

      {/* Header */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
        <div className="flex items-center gap-3">
          <Microscope className="w-8 h-8 text-primary drop-shadow-[0_0_10px_hsl(185_70%_50%/0.5)]" />
          <h1 className="font-display text-2xl md:text-3xl tracking-widest text-foreground uppercase">
            Tissue<span className="text-primary">Scope</span>
          </h1>
        </div>
        <p className="text-muted-foreground text-sm tracking-wide">
          Sistema de Análise de Tecidos
        </p>
      </div>

      {/* Menu Panel */}
      {menuVisible ? (
        <div className="relative z-10 w-full max-w-md mx-4 glass-panel rounded-2xl p-6 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-6">
            <p className="font-display text-xs tracking-[0.3em] text-muted-foreground uppercase">
              Menu Principal
            </p>
          </div>

          <MenuButton icon={Play} label="Iniciar" variant="primary" />
          <MenuButton icon={Sun} label="Calibrar Luz" />
          <MenuButton icon={Settings} label="Configurações" />
          <MenuButton icon={Info} label="Informações" />
          <MenuButton
            icon={EyeOff}
            label="Esconder Menu"
            variant="subtle"
            onClick={() => setMenuVisible(false)}
          />
          <MenuButton icon={ArrowLeft} label="Voltar" variant="subtle" />
        </div>
      ) : (
        <button
          onClick={() => setMenuVisible(true)}
          className="relative z-10 flex items-center gap-3 px-6 py-3 rounded-full glass-panel border-primary/40 glow-primary hover:glow-strong transition-all duration-300 active:scale-95"
        >
          <Eye className="w-5 h-5 text-primary" />
          <span className="font-display text-sm tracking-wider uppercase text-foreground/80">
            Mostrar Menu
          </span>
        </button>
      )}

      {/* Status bar */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 text-xs text-muted-foreground z-10">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span>Sistema Pronto</span>
        </div>
        <span className="text-border">|</span>
        <span>v1.0.0</span>
      </div>
    </div>
  );
};

export default Index;
