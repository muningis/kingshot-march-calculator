# DNS + Origin CA TLS (edge) and the k8s workload, from the shared garazas
# modules. Identity/routing/stage all live here in the app stage.
module "edge" {
  source = "git::ssh://git@github.com/muningis/garazas.git//terraform/modules/app-edge?ref=main"

  app_name         = local.app_name
  zone_name        = local.zone_name
  staging_host     = local.staging_host
  production_hosts = local.prod_hosts
  stage            = var.stage
}

module "workload" {
  source = "git::ssh://git@github.com/muningis/garazas.git//terraform/modules/app-workload?ref=main"

  app_name        = local.app_name
  image           = local.image
  hosts           = module.edge.hosts
  tls_secret_name = module.edge.tls_secret_name
}
