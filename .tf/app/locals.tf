locals {
  app_name     = "march"
  zone_name    = "naughtyshiba.me"
  staging_host = "calc-v2.naughtyshiba.me"        # single label under *.naughtyshiba.me (edge TLS coverage)
  prod_hosts   = ["calc.naughtyshiba.me"]         # legacy host; cert+gateway cover it, DNS flips on cutover
  image        = "ghcr.io/muningis/march:${var.image_tag}"
}
