output "tls_secret_name" {
  value = module.edge.tls_secret_name
}

output "hosts" {
  value = module.edge.hosts
}

output "url" {
  value = "https://${local.staging_host}"
}
