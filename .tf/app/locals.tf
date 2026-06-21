locals {
  app_name  = "march"
  zone_name = "naughtyshiba.me"

  # All hosts the cert + gateway serve. calc-v2 is a single label under
  # *.naughtyshiba.me (edge-TLS coverage); calc.* is the legacy host whose DNS
  # flips to the cluster on cutover (stage=production).
  hosts         = ["calc-v2.naughtyshiba.me", "calc.naughtyshiba.me"]
  staging_hosts = ["calc-v2.naughtyshiba.me"]

  image = "ghcr.io/muningis/march:${var.image_tag}"
}
