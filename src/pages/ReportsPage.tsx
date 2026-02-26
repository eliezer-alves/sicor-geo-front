import { BarChart3, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function ReportsPage() {
  return (
    <div className="flex h-full items-center justify-center bg-background">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
          <BarChart3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h2 className="text-lg font-semibold text-foreground">Relatorios</h2>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Dashboards e relatorios de credito rural estarao disponiveis em breve.
        </p>
        <Link
          to="/map"
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          Ir para o mapa
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
