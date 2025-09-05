variable "env" {
    type = string
}

variable "project" {
    type = string
}

variable "backend_dir" {
    type = string
}

variable "docker_dir" {
    type = string
}

variable "ecr_backend_name" {
    type = string
}

variable "ecr_ffmpeg_name" {
    type = string
}

variable "cors" {
    type = string
}

variable "log_level" {
    type = string
    default = "INFO"
}

variable "ses_sender_email" {
    type = string
}

variable "clothing_model_weights_path" {
    type = string
}

variable "detection_model_weights_path" {
    type = string
}

variable "youtube_cookies_path" {
    type = string
}

variable "recaptcha_site_key" {
    type = string
}

variable "gcp_project_id" {
  type = string
}

variable "gcp_service_account_email" {
  type = string
}

variable "gcp_pool_id" {
  type = string
}

variable "gcp_provider_id" {
  type = string
}