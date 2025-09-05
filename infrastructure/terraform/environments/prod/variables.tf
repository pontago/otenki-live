variable "aws_region" {
  type = string
}

variable "gcp_region" {
  type = string
}

variable "gcp_project_id" {
  type = string
}

variable "domain_name" {
  type = string
  default = null
}

variable "fqdn" {
  type    = string
  default = null
}

variable "base_url" {
  default = null
}

variable "param_secret_key" {
  type = string
}

variable "recaptcha_allowed_domains" {
  type = list(string)
  default = []
}