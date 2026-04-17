import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Microscope, User, ShieldCheck, ArrowRight, Lock } from "lucide-react";
import { toast } from "sonner";
import gridBg from "@/assets/grid-bg.jpg";

type Role = "operador" | "gestor";

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState<Role>("operador");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error("Preencha todos os campos", {
        description: "Informe usuário e senha para continuar.",
      });
      return;
    }
    setLoading(true);
    setTimeout(() => {
      toast.success(`Bem-vindo${role === "gestor" ? ", Gestor" : ""}`, {
        description:
          role === "gestor"
            ? "Acessando o painel gerencial."
            : "Acessando o painel de operação.",
      });
      navigate(role === "gestor" ? "/gestor" : "/painel");
    }, 600);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden p-6">
      <img
        src={gridBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover opacity-20"
        width={1920}
        height={1080}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/70" />

      <div className="relative z-10 w-full max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-14 h-14 rounded-xl bg-foreground/10 flex items-center justify-center mb-4">
            <Microscope className="w-7 h-7 text-foreground" />
          </div>
          <h1 className="font-display text-2xl tracking-[0.15em] text-foreground uppercase leading-tight">
            TissueScope
          </h1>
          <p className="text-[11px] tracking-[0.3em] text-muted-foreground uppercase mt-1">
            Análise de Tecidos
          </p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border/30 bg-card/50 backdrop-blur-sm p-8">
          <div className="text-center mb-6">
            <p className="font-display text-[11px] tracking-[0.4em] text-muted-foreground uppercase mb-2">
              Acesso ao Sistema
            </p>
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent mx-auto" />
          </div>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {(["operador", "gestor"] as Role[]).map((r) => {
              const Icon = r === "gestor" ? ShieldCheck : User;
              const active = role === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRole(r)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all duration-300 ${
                    active
                      ? "bg-foreground/10 border-foreground/30 glow-primary"
                      : "bg-muted/30 border-border/30 hover:border-foreground/20 hover:bg-muted/50"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors ${
                      active ? "text-foreground" : "text-secondary"
                    }`}
                  />
                  <span className="font-display text-[10px] tracking-[0.25em] uppercase text-foreground/90">
                    {r === "gestor" ? "Gestor" : "Operador"}
                  </span>
                </button>
              );
            })}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="username"
                className="font-display text-[10px] tracking-[0.25em] uppercase text-muted-foreground"
              >
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={role === "gestor" ? "gestor.silva" : "operador.silva"}
                  className="w-full h-11 pl-10 pr-3 rounded-lg bg-muted/40 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground/40 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="password"
                className="font-display text-[10px] tracking-[0.25em] uppercase text-muted-foreground"
              >
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-10 pr-3 rounded-lg bg-muted/40 border border-border/30 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-foreground/40 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 mt-2 flex items-center justify-center gap-2 rounded-lg bg-foreground/10 border border-foreground/30 hover:bg-foreground/15 transition-all font-display text-[11px] tracking-[0.3em] uppercase text-foreground glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Entrando..." : "Entrar"}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="text-[10px] text-center text-muted-foreground mt-6 tracking-wider">
            Acesso restrito · Uso interno
          </p>
        </div>

        <p className="text-[10px] text-center text-muted-foreground mt-6 tracking-[0.2em] uppercase">
          v1.0.0 · TissueScope
        </p>
      </div>
    </div>
  );
};

export default Login;
