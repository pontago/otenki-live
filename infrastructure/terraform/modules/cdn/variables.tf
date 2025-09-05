variable "env" {
  type = string
}

variable "project" {
  type = string
}

variable "backend_fqdn" {
  type = string
}

variable "frontend_fqdn" {
  type = string
}

variable "frontend_bucket_regional_domain_name" {
  type = string
}

variable "lambda_api_function_name" {
  type = string
}

variable "lambda_frontend_function_name" {
  type = string
}

variable "cert_arn" {
  type = string
  default = null
}

variable "fqdn" {
  type = string
  default = null
}