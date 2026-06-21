locals {
  app_name = "march"

  # Cloudflare zone that owns the records (NOT the app hostname).
  zone_name = "naughtyshiba.me"

  # All hostnames the gateway + origin cert serve. The old host is included so a
  # later DNS repoint flips it live with no further Terraform changes.
  # `calc-v2` (single label under the apex) so Cloudflare's Universal SSL
  # wildcard `*.naughtyshiba.me` covers it — `v2.calc.*` would be 3rd-level
  # and uncovered, failing the edge TLS handshake.
  hosts = ["calc-v2.naughtyshiba.me", "calc.naughtyshiba.me"]

  # Only the NEW v2 record is managed here. The old `calc` record still points
  # at the legacy VPS and is left untouched until the manual cutover.
  dns_hosts = ["calc-v2.naughtyshiba.me"]

  cert_common_name = "calc.naughtyshiba.me"
  ingress_hostname = "ingress.raccooningis.dev"
}
