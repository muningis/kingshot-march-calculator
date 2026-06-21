locals {
  app_name = "march"
  hosts    = ["calc-v2.naughtyshiba.me", "calc.naughtyshiba.me"] # gateway + virtualservice
  port     = 3000
  image    = "ghcr.io/muningis/march:${var.image_tag}"

  # Deterministic name of the infra-owned origin-cert secret (see .tf/infra) —
  # recomputed here so the two states stay decoupled (no terraform_remote_state).
  tls_secret_name = "${local.app_name}-origin-cert"
}
